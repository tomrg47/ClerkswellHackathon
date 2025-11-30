# Login Authentication Setup

## Overview
The login system now supports two authentication methods:
1. **Username/Password** - Traditional login with username and password
2. **Phone Number** - SMS verification using Twilio

## Twilio Setup Instructions

### 1. Create a Twilio Account
1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free account
3. Complete phone verification

### 2. Get Your Twilio Credentials
1. Log into your Twilio Console: [https://console.twilio.com](https://console.twilio.com)
2. From your dashboard, copy:
   - **Account SID**
   - **Auth Token**

### 3. Create a Verify Service
1. In Twilio Console, navigate to **Verify** ? **Services**
2. Click **Create new Service**
3. Give it a name (e.g., "Restore Hope Login")
4. Copy the **Service SID** (starts with `VA...`)

### 4. Configure Your Application
Update `appsettings.json` with your Twilio credentials:

```json
"Twilio": {
  "AccountSid": "YOUR_ACCOUNT_SID",
  "AuthToken": "YOUR_AUTH_TOKEN",
  "VerifyServiceSid": "YOUR_VERIFY_SERVICE_SID"
}
```

**Important:** For production, use User Secrets or Environment Variables instead of storing credentials in appsettings.json

### 5. Add Phone Number to Member Profile
Members need a `phoneNumber` property in their Umbraco member type:
1. Go to Umbraco Backoffice ? Settings ? Member Types
2. Edit the "Member" type
3. Add a new property:
   - Name: Phone Number
   - Alias: `phoneNumber`
   - Type: Textstring
4. Save

## Usage

### Username/Password Login
- Enter username and password
- Click "Log In"

### Phone Number Login
1. Click the "Phone" tab
2. Enter phone number in international format (e.g., +44 7700 900000)
3. Click "Send Code"
4. Enter the 6-digit verification code received via SMS
5. Click "Verify & Log In"

## API Endpoints

### POST `/api/member/login`
Login with username and password
```json
{
  "username": "johndoe",
  "password": "SecurePassword123!"
}
```

### POST `/api/member/phone/send-code`
Send verification code to phone
```json
{
  "phoneNumber": "+447700900000"
}
```

### POST `/api/member/phone/verify`
Verify code and login
```json
{
  "phoneNumber": "+447700900000",
  "code": "123456"
}
```

## Testing
- **Twilio Trial Account**: Can only send SMS to verified phone numbers
- **Production**: Upgrade your Twilio account to send to any phone number

## Security Notes
- Verification codes expire after 10 minutes (Twilio default)
- Maximum 5 verification attempts per phone number
- Account lockout is enabled after failed password attempts
