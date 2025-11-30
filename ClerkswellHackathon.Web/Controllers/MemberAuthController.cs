using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Services;
using ClerkswellHackathon.Web.Models;
using ClerkswellHackathon.Web.Services;

namespace ClerkswellHackathon.Web.Controllers;

[ApiController]
[Route("api/member")]
public class MemberAuthController : ControllerBase
{
    private readonly IMemberService _memberService;
    private readonly IMemberManager _memberManager;
    private readonly SignInManager<MemberIdentityUser> _signInManager;
    private readonly ITwilioService _twilioService;

    public MemberAuthController(
        IMemberService memberService,
        IMemberManager memberManager,
        SignInManager<MemberIdentityUser> signInManager,
        ITwilioService twilioService)
    {
        _memberService = memberService;
        _memberManager = memberManager;
        _signInManager = signInManager;
        _twilioService = twilioService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] MemberRegistrationDto model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid registration data"
            });
        }

        // Validate member group
        if (model.MemberGroup.ToLower() != "staff" && model.MemberGroup.ToLower() != "family")
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Member group must be either 'staff' or 'family'"
            });
        }

        // Check if member already exists
        var existingMember = _memberService.GetByEmail(model.Email);
        if (existingMember != null)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "A member with this email already exists"
            });
        }

        try
        {
            // Create the member identity
            var identityUser = MemberIdentityUser.CreateNew(
                model.Email,
                model.Email,
                "Member", // Member type alias - adjust if yours is different
                true, // isApproved
                model.Name
            );

            var result = await _memberManager.CreateAsync(identityUser, model.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = string.Join(", ", result.Errors.Select(e => e.Description))
                });
            }

            // Get the created member
            var member = _memberService.GetByEmail(model.Email);
            if (member != null)
            {
                // Assign to the appropriate group
                _memberService.AssignRole(member.Id, model.MemberGroup.ToLower());
                _memberService.Save(member);
            }

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Member registered successfully",
                Data = new
                {
                    Email = model.Email,
                    Name = model.Name,
                    Group = model.MemberGroup.ToLower()
                }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = $"An error occurred during registration: {ex.Message}"
            });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] MemberLoginDto model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid login data"
            });
        }

        try
        {
            var result = await _signInManager.PasswordSignInAsync(
                model.Username,
                model.Password,
                isPersistent: true,
                lockoutOnFailure: true
            );

            if (result.Succeeded)
            {
                var member = _memberService.GetByUsername(model.Username);
                if (member != null)
                {
                    var roles = _memberService.GetAllRoles(member.Id);

                    return Ok(new ApiResponse<object>
                    {
                        Success = true,
                        Message = "Login successful",
                        Data = new
                        {
                            Username = member.Username,
                            Email = member.Email,
                            Name = member.Name,
                            Groups = roles
                        }
                    });
                }
            }

            if (result.IsLockedOut)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Account is locked out"
                });
            }

            if (result.IsNotAllowed)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Login not allowed. Account may not be approved."
                });
            }

            return Unauthorized(new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid username or password"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = $"An error occurred during login: {ex.Message}"
            });
        }
    }

    [HttpPost("phone/send-code")]
    public async Task<IActionResult> SendPhoneCode([FromBody] PhoneLoginDto model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid phone number"
            });
        }

        try
        {
            var success = await _twilioService.SendVerificationCodeAsync(model.PhoneNumber);

            if (success)
            {
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Verification code sent successfully"
                });
            }

            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Failed to send verification code"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = $"An error occurred: {ex.Message}"
            });
        }
    }

    [HttpPost("phone/verify")]
    public async Task<IActionResult> VerifyPhoneCode([FromBody] PhoneVerifyDto model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid verification data"
            });
        }

        try
        {
            var verified = await _twilioService.VerifyCodeAsync(model.PhoneNumber, model.Code);

            if (!verified)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Invalid verification code"
                });
            }

            // Find member by phone number
            var members = _memberService.GetAll(0, int.MaxValue, out _);
            var member = members.FirstOrDefault(m => 
                m.GetValue<string>("phoneNumber") == model.PhoneNumber);

            if (member == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "No account found with this phone number"
                });
            }

            // Sign in the member
            var identityUser = await _memberManager.FindByIdAsync(member.Key.ToString());
            if (identityUser != null)
            {
                await _signInManager.SignInAsync(identityUser, isPersistent: true);

                var roles = _memberService.GetAllRoles(member.Id);

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Login successful",
                    Data = new
                    {
                        PhoneNumber = model.PhoneNumber,
                        Username = member.Username,
                        Email = member.Email,
                        Name = member.Name,
                        Groups = roles
                    }
                });
            }

            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = "Failed to sign in"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = $"An error occurred during verification: {ex.Message}"
            });
        }
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Logout successful"
        });
    }

    [HttpGet("current")]
    public IActionResult GetCurrentMember()
    {
        if (!User.Identity?.IsAuthenticated ?? true)
        {
            return Unauthorized(new ApiResponse<object>
            {
                Success = false,
                Message = "Not authenticated"
            });
        }

        var username = User.Identity.Name;
        if (username == null)
        {
            return Unauthorized(new ApiResponse<object>
            {
                Success = false,
                Message = "Could not retrieve user information"
            });
        }

        var member = _memberService.GetByUsername(username);
        if (member == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Member not found"
            });
        }

        var roles = _memberService.GetAllRoles(member.Id);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Member retrieved successfully",
            Data = new
            {
                Username = member.Username,
                Email = member.Email,
                Name = member.Name,
                Groups = roles
            }
        });
    }
}
