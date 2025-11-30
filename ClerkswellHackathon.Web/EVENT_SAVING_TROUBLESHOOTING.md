# ?? Event Saving Error - Troubleshooting Guide

## Common Error: "Error saving event"

This error occurs when trying to create or update events from the dashboard. Here's how to diagnose and fix it.

---

## ?? Step 1: Check Browser Console

1. **Open Developer Tools** (F12 in browser)
2. **Go to Console tab**
3. **Look for error messages** when you click "Create Event"

### Common Console Errors:

#### Error 1: "Events Listing page not found"
```
Status: 400 Bad Request
Message: "Please create an 'Events Listing' page in the Content section first"
```

**Fix:**
1. Go to **Content** section in Umbraco
2. Create a page with document type "Events Listing"
3. Name it "Events"
4. **Save and Publish**

---

#### Error 2: "Event document type not found"
```
Status: 500 Internal Server Error
Message: "Could not find content type with alias 'event'"
```

**Fix:**
1. Go to **Settings ? Document Types**
2. Create "Event" document type with alias `event` (lowercase, exact!)
3. Add all required properties (see below)

---

#### Error 3: "Property does not exist"
```
Status: 500 Internal Server Error
Message: "Property with alias 'eventTitle' does not exist"
```

**Fix:**
The Event document type is missing required properties. See "Required Properties" below.

---

#### Error 4: "404 Not Found"
```
Status: 404
URL: /umbraco/backoffice/api/events/create
```

**Fix:**
1. **Restart the application**
2. Make sure `EventsManagementController.cs` exists
3. Check that the route attribute is correct: `[Route("umbraco/backoffice/api/events")]`

---

## ? Step 2: Verify Prerequisites

### Required Document Types

#### 1. Events Listing Document Type
- **Name:** Events Listing
- **Alias:** `eventsListing` (exact!)
- **Icon:** icon-calendar-alt
- **Properties:**
  - `pageTitle` (Textstring)
  - `introduction` (Textarea)
- **Structure:** Allow child node type "Event"

#### 2. Event Document Type
- **Name:** Event
- **Alias:** `event` (exact!)
- **Icon:** icon-calendar
- **Properties:** (All aliases must match exactly!)

| Property Name | Alias | Data Type | Required |
|--------------|-------|-----------|----------|
| Event Title | `eventTitle` | Textstring | Yes |
| Event Description | `eventDescription` | Rich Text Editor | Yes |
| Event Start Date | `eventStartDate` | Date/Time Picker | Yes |
| Event End Date | `eventEndDate` | Date/Time Picker | Yes |
| Location | `eventLocation` | Textstring | Yes |
| Event Type | `eventType` | Textstring or Dropdown | No |
| Max Attendees | `maxAttendees` | Numeric | No |
| Current Attendees | `currentAttendees` | Numeric | No |
| Requires Registration | `requiresRegistration` | True/False | No |
| Contact Email | `contactEmail` | Textstring | No |
| Contact Phone | `contactPhone` | Textstring | No |
| Image URL | `imageUrl` | Textstring | No |
| Tags | `tags` | Textstring | No |
| Is Featured | `isFeatured` | True/False | No |

---

## ?? Step 3: Create Events Listing Page

This is **CRITICAL** - the dashboard won't work without it!

1. Go to **Content** section
2. Right-click your home page (or root)
3. Click **Create**
4. Select **Events Listing**
5. Name: "Events"
6. **Save and Publish**

### Verify it exists:
1. Refresh the page
2. You should see "Events" node in content tree
3. Check the Info tab shows "Document Type: Events Listing"

---

## ?? Step 4: Check Application Logs

If the error persists, check Umbraco logs:

1. **Location:** `App_Data/Logs/`
2. **Open latest log file** (named by date)
3. **Search for:** "EventsManagement" or "Error creating event"

### Common Log Errors:

#### Missing Property:
```
System.InvalidOperationException: Property with alias 'eventTitle' does not exist on content type 'Event'
```
**Fix:** Add the missing property to Event document type

#### Type Mismatch:
```
System.ArgumentException: Could not convert value to DateTime
```
**Fix:** Ensure date fields use "Date/Time Picker" data type

#### Permission Denied:
```
System.UnauthorizedAccessException: User does not have permission to create content
```
**Fix:** Check user permissions in Users section

---

## ?? Step 5: Test API Directly

Test if the API is working:

1. **Open browser**
2. **Navigate to:** `/umbraco/backoffice/api/events/getall`
3. **Expected result:** Empty array `[]` or list of events

### If you get 404:
- Application needs restart
- Controller not registered
- Route is wrong

### If you get 500:
- Check application logs
- Document types missing
- Database connection issue

---

## ? Complete Checklist

Before creating events, verify:

- [ ] Event document type exists with alias `event`
- [ ] Events Listing document type exists with alias `eventsListing`
- [ ] All 13+ properties added to Event with correct aliases
- [ ] Events Listing page created in Content section
- [ ] Events Listing page is published
- [ ] Application has been restarted after code changes
- [ ] Browser cache cleared (Ctrl+Shift+Delete)
- [ ] User has permission to create content

---

## ?? Step 6: Test with Simple Event

Try creating a minimal event:

```json
{
  "title": "Test Event",
  "description": "This is a test",
  "startDate": "2025-12-31T10:00",
  "endDate": "2025-12-31T12:00",
  "location": "Test Location",
  "eventType": "Community Event",
  "status": "Draft",
  "maxAttendees": 10,
  "currentAttendees": 0,
  "requiresRegistration": false,
  "contactEmail": "",
  "contactPhone": "",
  "tags": [],
  "imageUrl": "",
  "isFeatured": false
}
```

### Using Browser Console:
```javascript
fetch('/umbraco/backoffice/api/events/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        title: "Test Event",
        description: "This is a test",
        startDate: "2025-12-31T10:00",
        endDate: "2025-12-31T12:00",
        location: "Test Location",
        eventType: "Community Event",
        status: "Draft",
        maxAttendees: 10,
        currentAttendees: 0,
        requiresRegistration: false,
        contactEmail: "",
        contactPhone: "",
        tags: [],
        imageUrl: "",
        isFeatured: false
    })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

If this works, the issue is with the dashboard form data.

---

## ?? Common Dashboard Issues

### Issue: Date format wrong
**Symptom:** Error converting date
**Fix:** Ensure datetime-local inputs are formatted as: `YYYY-MM-DDTHH:mm`

### Issue: Checkbox values
**Symptom:** Boolean properties not saving correctly
**Fix:** Dashboard checks for `formData.get('field') === 'on'`

### Issue: Tags parsing
**Symptom:** Tags not saving
**Fix:** Tags should be comma-separated string, split in controller

### Issue: Integer conversion
**Symptom:** Number fields cause error
**Fix:** Dashboard uses `parseInt(formData.get('maxAttendees'))`

---

## ?? Quick Fix Steps

If you're stuck, try this quick reset:

### 1. Verify Document Types
```sql
-- Check in Umbraco database
SELECT * FROM umbracoContentType 
WHERE alias IN ('event', 'eventsListing')
```

### 2. Verify Events Listing Page
```sql
-- Check in Umbraco database
SELECT c.*, ct.alias
FROM umbracoContent c
JOIN umbracoContentType ct ON c.contentTypeId = ct.nodeId
WHERE ct.alias = 'eventsListing'
```

### 3. Clear Cache
- Restart application
- Clear browser cache
- Republish Events Listing page

---

## ?? Still Having Issues?

### Enable Detailed Logging:

Update `appsettings.json`:
```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Debug",
      "Override": {
        "ClerkswellHackathon.Web.Controllers": "Debug"
      }
    }
  }
}
```

### Check Network Tab:

1. F12 ? Network tab
2. Click "Create Event"
3. Look for `/events/create` request
4. Check **Request Payload**
5. Check **Response**

### Get Help:

Include in your question:
- Browser console errors (screenshot)
- Network tab response (screenshot)
- Application log errors
- Document type structure

---

## ? Success Indicators

You'll know it's working when:

1. ? **Dashboard loads** without errors
2. ? **Create Event button** opens modal
3. ? **Submit creates event** without error
4. ? **Content tree** shows new event node
5. ? **Dashboard refreshes** and shows event
6. ? **Website displays** event at `/events`

---

## ?? Most Common Fix

**90% of issues are solved by:**

1. Creating Events Listing page in Content
2. Publishing the Events Listing page
3. Restarting the application
4. Clearing browser cache

**Try this first!**

---

## Updated Dashboard Features

The dashboard now includes:
- ? Better error messages
- ? Console logging for debugging
- ? Detailed troubleshooting hints
- ? Request/response logging

**Check browser console for detailed error information!**
