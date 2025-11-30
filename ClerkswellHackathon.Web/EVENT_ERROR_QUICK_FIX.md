# ?? Event Saving Error - Quick Fix

## Problem
Getting "Error saving event" when trying to create events from the dashboard.

---

## ? Solution (Most Common)

### The issue is usually one of these:

1. **Events Listing page doesn't exist**
2. **Event document type not created**
3. **Properties missing from Event document type**
4. **Application needs restart**

---

## ?? Quick Fix Steps

### Step 1: Create Events Listing Page (2 minutes)

1. Open Umbraco ? **Content** section
2. Right-click your home page
3. **Create** ? Select "Events Listing"
   - If you don't see "Events Listing", see Step 2 first!
4. Name: `Events`
5. **Save and Publish** (important!)

### Step 2: Create Document Types (5 minutes)

#### Create "Events Listing" Document Type:
1. **Settings** ? **Document Types** ? **Create**
2. Name: `Events Listing`
3. Alias: `eventsListing` (must be exact!)
4. Add 2 properties:
   - `pageTitle` (Textstring)
   - `introduction` (Textarea)
5. **Structure** tab ? Allow child: "Event"
6. **Templates** tab ? Create template
7. **Save**

#### Create "Event" Document Type:
1. **Settings** ? **Document Types** ? **Create**
2. Name: `Event`
3. Alias: `event` (must be exact!)
4. Add these properties with **exact** aliases:

**CRITICAL - Aliases must match exactly:**

| Alias | Data Type |
|-------|-----------|
| `eventTitle` | Textstring |
| `eventDescription` | Rich Text Editor |
| `eventStartDate` | Date/Time Picker |
| `eventEndDate` | Date/Time Picker |
| `eventLocation` | Textstring |
| `eventType` | Textstring |
| `maxAttendees` | Numeric |
| `currentAttendees` | Numeric |
| `requiresRegistration` | True/False |
| `contactEmail` | Textstring |
| `contactPhone` | Textstring |
| `imageUrl` | Textstring |
| `tags` | Textstring |
| `isFeatured` | True/False |

5. **Templates** tab ? Create template
6. **Save**

### Step 3: Restart Application

1. Stop debugging (Shift+F5)
2. **Rebuild** (Ctrl+Shift+B)
3. Start debugging (F5)

### Step 4: Create Events Listing Page (if not done)

Now go back to Step 1 if you skipped it!

### Step 5: Test

1. Go to **Families** ? **Events** tab
2. Click **+ Create Event**
3. Fill in required fields:
   - Title ?
   - Description ?
   - Start Date ?
   - End Date ?
   - Location ?
4. Click **Create Event**
5. ? Should see success message!

---

## ?? Diagnose the Issue

### Run Diagnostic Script:

1. Open browser console (F12)
2. Copy and paste from: `wwwroot/js/event-diagnostics.js`
3. Hit Enter
4. Follow the output to see what's wrong

### Or Check Manually:

#### Test 1: API Working?
Open in browser: `/umbraco/backoffice/api/events/getall`
- ? Should see `[]` or list of events
- ? If 404: Application needs restart
- ? If 500: Check logs

#### Test 2: Events Listing Exists?
1. Content ? Check for "Events" page
2. Click it ? Info tab
3. Document Type should be "Events Listing"

#### Test 3: Console Errors?
1. F12 ? Console tab
2. Look for errors when clicking "Create Event"
3. Red errors = problem!

---

## ?? Checklist

Before creating events:

- [ ] Events Listing document type created (alias: `eventsListing`)
- [ ] Event document type created (alias: `event`)
- [ ] All 14 properties added to Event with **exact** aliases
- [ ] Events Listing page created in Content
- [ ] Events Listing page **published**
- [ ] Application restarted
- [ ] Browser cache cleared (Ctrl+F5)

---

## ?? Improved Dashboard

The dashboard now shows **better error messages**!

When you get an error, it will tell you:
- ? "Events Listing page not found" ? Create the page!
- ? "Property does not exist" ? Add missing properties!
- ? "Document type not found" ? Create Event document type!

**Check browser console (F12) for detailed info!**

---

## ?? Detailed Guides

- **Full troubleshooting:** `EVENT_SAVING_TROUBLESHOOTING.md`
- **Setup guide:** `INTEGRATED_EVENTS_SETUP.md`
- **Integration info:** `INTEGRATION_COMPLETE.md`

---

## ?? Pro Tips

1. **Always check browser console first!**
2. **Aliases are case-sensitive** - use exact matches
3. **Publish the Events Listing page** - not just save
4. **Restart after creating document types**
5. **Clear cache** if changes don't appear

---

## ? You're Done!

Once you complete the steps above, you should be able to:
- ? Create events from dashboard
- ? See events in Content tree
- ? View events on website at `/events`
- ? Edit and delete events

**Happy event managing! ??**
