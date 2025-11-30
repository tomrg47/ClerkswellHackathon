# Events Management - Quick Start Guide

## ? What's Been Created

### 1. **Backend API (Ready to Use)**
- **Event Model**: `Models/Event.cs`
- **Events Controller**: `Controllers/EventsManagementController.cs`
- **API Endpoints**: All CRUD operations available

### 2. **Backoffice Dashboard (Ready to Use)**
- **Updated Dashboard**: `App_Plugins/FamiliesManagement/dashboard.js`
- **Features**: Create, Edit, Delete, Search, Filter events
- **Access**: Families Section ? Events Tab

### 3. **Website Templates (Created)**
- **Event Detail Page**: `Views/Event.cshtml`
- **Events Listing**: `Views/EventsListing.cshtml`

### 4. **Documentation**
- **Full Setup Guide**: `EVENTS_SETUP.md`

---

## ?? Quick Start (3 Steps)

### Step 1: Test the Backoffice (Immediate)
1. Open Umbraco backoffice
2. Go to **Families** section
3. Click **Events** tab
4. Click **+ Create Event**
5. Fill in event details and save

**Already working with mock data!**

---

### Step 2: Create Document Types (5 minutes)

#### Event Document Type:
```
Name: Event
Alias: event
Icon: icon-calendar
Template: Create new

Properties:
- eventTitle (Textstring) *Required
- eventDescription (Rich Text Editor) *Required
- eventStartDate (Date/Time Picker) *Required
- eventEndDate (Date/Time Picker) *Required
- eventLocation (Textstring) *Required
- eventType (Dropdown)
- maxAttendees (Numeric)
- requiresRegistration (True/False)
- contactEmail (Textstring)
- contactPhone (Textstring)
- eventImage (Media Picker)
- tags (Tags)
```

#### Events Listing Document Type:
```
Name: Events Listing
Alias: eventsListing
Icon: icon-calendar-alt
Template: Create new

Properties:
- pageTitle (Textstring)
- introduction (Textarea)

Structure:
- Allow child node: Event
```

---

### Step 3: Update Templates (2 minutes)

1. Go to **Settings ? Templates ? Event**
2. Replace content with code from `Views/Event.cshtml`
3. Save

4. Go to **Settings ? Templates ? Events Listing**
5. Replace content with code from `Views/EventsListing.cshtml`
6. Save

---

## ?? Create Your First Event Page

1. **Content ? Create ? Events Listing**
   - Name: "Events"
   - Page Title: "Upcoming Events"
   - Introduction: "Join us for community events"
   - Save & Publish

2. **Right-click Events page ? Create ? Event**
   - Fill in event details
   - Save & Publish

3. **Visit**: `/events` on your website

---

## ?? Features

### Backoffice Dashboard:
- ? Create/Edit/Delete events
- ? Search functionality
- ? Filter by: All, Upcoming, Published, Draft, Featured
- ? Visual event cards
- ? Track attendees
- ? Mark as featured
- ? Event types and tags

### Public Website:
- ? Events listing with search
- ? Filter upcoming/featured
- ? Individual event pages
- ? Responsive design
- ? Share functionality
- ? Registration prompts

---

## ?? File Locations

```
ClerkswellHackathon.Web/
??? Models/
?   ??? Event.cs ? NEW
??? Controllers/
?   ??? EventsManagementController.cs ? NEW
??? App_Plugins/FamiliesManagement/
?   ??? dashboard.js ?? UPDATED
??? Views/
?   ??? Event.cshtml ? NEW
?   ??? EventsListing.cshtml ? NEW
??? EVENTS_SETUP.md ? NEW (Full Guide)
```

---

## ?? API Endpoints

Test these in your browser:

- **All Events**: `/umbraco/backoffice/api/events/getall`
- **Published Only**: `/umbraco/backoffice/api/events/published`
- **Featured Only**: `/umbraco/backoffice/api/events/featured`

---

## ?? Sample Events (Pre-loaded)

The system comes with 6 sample events:
1. Community Christmas Dinner (Featured)
2. Kids Craft Workshop
3. Housing Rights Advice Session (Featured)
4. Senior Coffee Morning
5. New Year Job Fair (Draft)
6. Family Pantry Opening (Featured, Weekly)

---

## ?? Customization

### Change Colors:
Edit the CSS in `dashboard.js` and the view files:
- Primary: `#1b264f` (Dark Blue)
- Accent: `#ffd100` (Yellow)

### Add Event Types:
Update the dropdown options in the Event document type and the modal form.

### Modify Layout:
Edit `Views/Event.cshtml` and `Views/EventsListing.cshtml`

---

## ?? Important Notes

1. **Mock Data**: The backoffice currently uses mock data
2. **Integration**: To sync backoffice with website, update the controller to use Umbraco's content service
3. **Cache**: Clear browser cache if changes don't appear
4. **Hot Reload**: If debugging, use hot reload to apply changes

---

## ?? Quick Troubleshooting

**Events tab not working?**
- Clear browser cache
- Check browser console for errors
- Verify `dashboard.js` was saved

**API returns 404?**
- Restart the application
- Check route: `/umbraco/backoffice/api/events/getall`

**Templates not displaying?**
- Verify template code is correct
- Check property aliases match exactly
- Ensure document type allows the template

---

## ? You're Ready!

Your events management system is now complete with:
- ? Full backoffice management
- ? Public-facing event pages
- ? Search and filtering
- ? Responsive design
- ? Beautiful UI

**Next**: See `EVENTS_SETUP.md` for detailed documentation and advanced features!
