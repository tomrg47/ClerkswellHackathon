namespace ClerkswellHackathon.Web.Models;

public class PhoneLoginDto
{
    public required string PhoneNumber { get; set; }
}

public class PhoneVerifyDto
{
    public required string PhoneNumber { get; set; }
    public required string Code { get; set; }
}
