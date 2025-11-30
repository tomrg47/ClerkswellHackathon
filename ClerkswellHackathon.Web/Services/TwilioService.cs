using Microsoft.Extensions.Options;
using ClerkswellHackathon.Web.Models;
using Twilio;
using Twilio.Rest.Verify.V2.Service;

namespace ClerkswellHackathon.Web.Services;

public interface ITwilioService
{
    Task<bool> SendVerificationCodeAsync(string phoneNumber);
    Task<bool> VerifyCodeAsync(string phoneNumber, string code);
}

public class TwilioService : ITwilioService
{
    private readonly TwilioSettings _settings;

    public TwilioService(IOptions<TwilioSettings> settings)
    {
        _settings = settings.Value;
        TwilioClient.Init(_settings.AccountSid, _settings.AuthToken);
    }

    public async Task<bool> SendVerificationCodeAsync(string phoneNumber)
    {
        try
        {
            var verification = await VerificationResource.CreateAsync(
                to: phoneNumber,
                channel: "sms",
                pathServiceSid: _settings.VerifyServiceSid
            );

            return verification.Status == "pending";
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<bool> VerifyCodeAsync(string phoneNumber, string code)
    {
        try
        {
            var verificationCheck = await VerificationCheckResource.CreateAsync(
                to: phoneNumber,
                code: code,
                pathServiceSid: _settings.VerifyServiceSid
            );

            return verificationCheck.Status == "approved";
        }
        catch (Exception)
        {
            return false;
        }
    }
}
