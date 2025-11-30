# ?? Integrated Events Management System - Setup Guide

## ? What's Different Now

Your Events Management system is now **fully integrated**! This means:

- ? **Create events in the dashboard** ? Automatically creates content nodes
- ? **Edit events in the dashboard** ? Updates content nodes
- ? **Delete events in the dashboard** ? Removes content nodes
- ? **Create events in Content section** ? Shows in dashboard
- ? **Publish/Unpublish in Content** ? Syncs with dashboard status

**One system, two interfaces, complete sync!**

---

## ?? Quick Setup (5 Steps)

### Step 1: Create Document Types

You **MUST** create these document types before the system will work:

#### 1.1 Create "Event" Document Type

1. Go to **Settings ? Document Types ? Create**
2. Fill in:
   - **Name:** `Event`
   - **Alias:** `event` (must be exactly this!)
   - **Icon:** `icon-calendar`
3. Click **Add Group** ? Name it "Event Details"
4. Add these properties:

| Property Name | Alias | Data Type | Required |
|--------------|-------|-----------|----------|
| Event Title | `eventTitle` | Textstring | Yes |
| Event Description | `eventDescription` | Rich Text Editor | Yes |
| Event Start Date | `eventStartDate` | Date/Time Picker | Yes |
| Event End Date | `eventEndDate` | Date/Time Picker | Yes |
| Location | `eventLocation` | Textstring | Yes |
| Event Type | `eventType` | Dropdown | No |
| Max Attendees | `maxAttendees` | Numeric | No |
| Current Attendees | `currentAttendees` | Numeric | No |
| Requires Registration | `requiresRegistration` | True/False | No |
| Contact Email | `contactEmail` | Email Address | No |
| Contact Phone | `contactPhone` | Textstring | No |
| Image URL | `imageUrl` | Textstring | No |
| Tags | `tags` | Textstring | No |
| Is Featured | `isFeatured` | True/False | No |

5. Go to **Templates** tab ? Click **Create**
6. **Save**

#### 1.2 Create "Events Listing" Document Type

1. Go to **Settings ? Document Types ? Create**
2. Fill in:
   - **Name:** `Events Listing`
   - **Alias:** `eventsListing` (must be exactly this!)
   - **Icon:** `icon-calendar-alt`
3. Add properties:
   - `pageTitle` (Textstring)
   - `introduction` (Textarea)
4. Go to **Structure** tab
5. Under "Allowed child node types" ? Add `Event`
6. Go to **Templates** tab ? Click **Create**
7. **Save**

---

### Step 2: Configure Templates

#### 2.1 Event Template

1. Go to **Settings ? Templates ? Event**
2. **Delete all existing code**
3. Copy ALL code from `Views/Event.cshtml`
4. **Save**

#### 2.2 Events Listing Template

1. Go to **Settings ? Templates ? Events Listing**
2. **Delete all existing code**
3. Copy ALL code from `Views/EventsListing.cshtml`
4. **Save**

---

### Step 3: Create Events Listing Page

This is **REQUIRED** for the dashboard to work!

1. Go to **Content**
2. Right-click your home page (or wherever you want events)
3. Click **Create**
4. Select **Events Listing**
5. Fill in:
   - **Name:** `Events`
   - **Page Title:** Leave blank (will default to "Upcoming Events")
   - **Introduction:** Leave blank (will default to description)
6. Click **Save and Publish**

**?? IMPORTANT:** The dashboard will NOT work until you create this Events Listing page!

---

### Step 4: Test the Integration

#### Test Dashboard ? Content Tree Sync:

1. Go to **Umbraco Backoffice**
2. Navigate to **Families ? Events** tab
3. Click **+ Create Event**
4. Fill in:
   - Title: "Test Event"
   - Description: "This is a test"
   - Start Date: Tomorrow
   - End Date: Tomorrow
   - Location: "Test Location"
   - Event Type: "Community Event"
   - Status: "Published" ?
5. Click **Create Event**
6. Go to **Content ? Events**
7. **You should see "Test Event" as a child node!**

#### Test Content Tree ? Dashboard Sync:

1. In **Content ? Events**, right-click
2. Select **Create ? Event**
3. Fill in all required fields
4. **Save and Publish**
5. Go to **Families ? Events** tab
6. **You should see your new event in the list!**

---

### Step 5: Visit the Website

1. Navigate to `/events` on your website
2. You should see all published events
3. Click on an event to see details
4. Test search and filtering

---

## ?? How It Works

### Architecture:

```
???????????????????????????????????????????????
?         DASHBOARD (Families ? Events)        ?
?  Create/Edit/Delete events via API          ?
???????????????????????????????????????????????
                  ?
                  ?
    ???????????????????????????????
    ?  EventsManagementController  ?
    ?  Uses IContentService        ?
    ???????????????????????????????
                  ?
                  ?
        ???????????????????
        ?  UMBRACO CMS    ?
        ?  Content Nodes  ?
        ???????????????????
                  ?
                  ?
      ?????????????????????????
      ?   PUBLIC WEBSITE       ?
      ?   /events pages        ?
      ?????????????????????????
```

### Key Points:

1. **Dashboard uses IContentService** to create actual Umbraco content nodes
2. **No more mock data** - everything is real content
3. **Published status synced** - Draft vs Published controlled by dashboard
4. **Content tree edits sync** - Changes in Content section appear in dashboard
5. **Single source of truth** - Umbraco database stores everything

---

## ?? Property Mapping

| Dashboard Field | Content Property Alias | Notes |
|----------------|----------------------|-------|
| Title | `eventTitle` | Also sets node name |
| Description | `eventDescription` | Rich text |
| Start Date | `eventStartDate` | DateTime |
| End Date | `eventEndDate` | DateTime |
| Location | `eventLocation` | Text |
| Event Type | `eventType` | Dropdown value |
| Max Attendees | `maxAttendees` | Number |
| Current Attendees | `currentAttendees` | Number |
| Requires Registration | `requiresRegistration` | Boolean |
| Contact Email | `contactEmail` | Text |
| Contact Phone | `contactPhone` | Text |
| Image URL | `imageUrl` | Text (URL) |
| Tags | `tags` | Comma-separated text |
| Is Featured | `isFeatured` | Boolean |
| Status | Published/Unpublished | Umbraco publish state |

---

## ?? Troubleshooting

### "Events Listing page not found" error

**Problem:** Dashboard can't find parent node for events

**Solution:**
1. Create an Events Listing page in Content section
2. Make sure document type alias is exactly `eventsListing`
3. Publish the page

### Events not appearing in dashboard

**Problem:** No events showing in Families ? Events tab

**Solutions:**
1. Check that Events Listing page exists
2. Create at least one Event under the Events Listing page
3. Check browser console for API errors
4. Verify document type alias is exactly `event`

### Can't create event from dashboard

**Problem:** Error when clicking "Create Event"

**Solutions:**
1. Ensure Events Listing page exists and is published
2. Check that all property aliases match exactly (case-sensitive!)
3. Check Umbraco logs: `App_Data/Logs/`
4. Verify user has permission to create content

### Events don't appear on website

**Problem:** `/events` page is blank

**Solutions:**
1. Make sure events are Published (not Draft)
2. Check that event Start Date is in the future
3. Verify templates are configured correctly
4. Check browser console for JavaScript errors

### Template errors

**Problem:** "Master template could not be found"

**Solution:**
1. Don't set a master template when creating document types
2. The template code already includes `Layout = "_Layout.cshtml";`
3. Make sure `_Layout.cshtml` exists in your Views folder

---

## ? Verification Checklist

Before testing, ensure:

- [ ] `Event` document type created with alias `event`
- [ ] `Events Listing` document type created with alias `eventsListing`
- [ ] All 13+ properties added to Event document type with correct aliases
- [ ] Event template configured with code from `Event.cshtml`
- [ ] Events Listing template configured with code from `EventsListing.cshtml`
- [ ] Events Listing page created in Content section
- [ ] Events Listing page is published
- [ ] Application restarted after code changes

---

## ?? Features

### Dashboard Features:
- ? Create events (creates content nodes)
- ? Edit events (updates content nodes)
- ? Delete events (removes content nodes)
- ? Search events
- ? Filter: All, Upcoming, Published, Draft, Featured
- ? Auto-publish when status = "Published"
- ? Visual event cards with all details

### Content Tree Features:
- ? Create events manually
- ? Edit event properties
- ? Publish/Unpublish events
- ? Organize events under Events Listing
- ? Standard Umbraco content management

### Website Features:
- ? Events listing at `/events`
- ? Individual event pages
- ? Search and filter
- ? Responsive design
- ? Featured event highlighting
- ? Capacity tracking
- ? Registration indicators

---

## ?? Additional Properties

If you want to add more fields:

1. Add property to Event document type in Umbraco
2. Update `EventsManagementController.cs`:
   - Add to `MapContentToEvent()` method
   - Add to `Create()` method
   - Add to `Update()` method
3. Update `Event.cs` model if needed
4. Update dashboard modal form in `dashboard.js`
5. Update event detail view in `Event.cshtml`

---

## ?? Permissions

Users need these permissions:
- Access to Families section (for dashboard)
- Content ? Browse
- Content ? Create (for creating events)
- Content ? Update (for editing events)
- Content ? Delete (for deleting events)
- Content ? Publish (for publishing events)

---

## ?? Next Steps

1. **Create real events** in the dashboard
2. **Add event images** (upload to Media, use URL)
3. **Set up navigation** link to `/events`
4. **Customize styling** in templates
5. **Add registration system** (integrate with Members)
6. **Email notifications** for new events

---

## ?? File Reference

- **Controller:** `Controllers/EventsManagementController.cs` (uses IContentService)
- **Model:** `Models/Event.cs`
- **Dashboard:** `App_Plugins/FamiliesManagement/dashboard.js`
- **Event Template:** `Views/Event.cshtml`
- **Listing Template:** `Views/EventsListing.cshtml`

---

## ?? Pro Tips

1. **Use meaningful names** for events (becomes URL slug)
2. **Always publish** events you want visible on website
3. **Set future dates** for Start Date (past events filtered out)
4. **Mark important events** as Featured
5. **Fill in all fields** for best display
6. **Use Tags** for better categorization
7. **Test in Dashboard** before publishing

---

**Your integrated Events Management System is ready to use!** ??

Any events you create will automatically sync between the dashboard and content tree!
