using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Services;
using ClerkswellHackathon.Web.Models;

namespace ClerkswellHackathon.Web.Controllers;

[ApiController]
[Route("api/member")]
public class MemberAuthController : ControllerBase
{
    private readonly IMemberService _memberService;
    private readonly IMemberManager _memberManager;
    private readonly SignInManager<MemberIdentityUser> _signInManager;

    public MemberAuthController(
        IMemberService memberService,
        IMemberManager memberManager,
        SignInManager<MemberIdentityUser> signInManager)
    {
        _memberService = memberService;
        _memberManager = memberManager;
        _signInManager = signInManager;
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
                model.Email,
                model.Password,
                isPersistent: true,
                lockoutOnFailure: true
            );

            if (result.Succeeded)
            {
                var member = _memberService.GetByEmail(model.Email);
                if (member != null)
                {
                    var roles = _memberService.GetAllRoles(member.Id);

                    return Ok(new ApiResponse<object>
                    {
                        Success = true,
                        Message = "Login successful",
                        Data = new
                        {
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
                Message = "Invalid email or password"
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

        var email = User.Identity.Name;
        if (email == null)
        {
            return Unauthorized(new ApiResponse<object>
            {
                Success = false,
                Message = "Could not retrieve user information"
            });
        }

        var member = _memberService.GetByEmail(email);
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
                Email = member.Email,
                Name = member.Name,
                Groups = roles
            }
        });
    }
}
