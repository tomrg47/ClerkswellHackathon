# Events Management System Setup Guide

## Overview

This guide will help you set up a complete Events Management System with:
- ? **Backoffice Dashboard** - Manage events in the Families section (Events tab)
- ? **Event Detail Pages** - Individual event pages on the website
- ? **Events Listing Page** - Browse all upcoming events

---

## Part 1: Backoffice Events Management (Already Done!)

The Events tab in your Families Management section is now fully functional with:
- Create, edit, and delete events
- Search and filter events
- Featured events
- Event status management (Draft, Published, Cancelled, Completed)
- Full event details including dates, location, attendees, contact info

**To Access:**
1. Go to Umbraco backoffice
2. Navigate to the **Families** section
3. Click on the **Events** tab
4. Click **+ Create Event** to add your first event

---

## Part 2: Create Umbraco Document Types

To display events on the public website, you need to create two Document Types:

### Document Type 1: Event (Single Event Page)

1. **Go to Settings ? Document Types**
2. **Click "Create" ? Document Type**
3. **Name:** `Event`
4. **Alias:** `event`
5. **Icon:** Choose `icon-calendar`
6. **Template:** Create new template (auto-generates)

#### Add Properties:

| Property Name | Alias | Editor | Required |
|--------------|-------|---------|----------|
| Event Title | eventTitle | Textstring | Yes |
| Event Description | eventDescription | Rich Text Editor | Yes |
| Event Start Date | eventStartDate | Date/Time Picker | Yes |
| Event End Date | eventEndDate | Date/Time Picker | Yes |
| Location | eventLocation | Textstring | Yes |
| Event Type | eventType | Dropdown | No |
| Max Attendees | maxAttendees | Numeric | No |
| Requires Registration | requiresRegistration | True/False | No |
| Contact Email | contactEmail | Textstring | No |
| Contact Phone | contactPhone | Textstring | No |
| Event Image | eventImage | Media Picker | No |
| Tags | tags | Tags | No |

**For Event Type Dropdown:**
- Community Event
- Workshop
- Advice Session
- Social
- Job Fair
- Food Service
- Training
- Support Group

#### Template Configuration:

1. After creating the document type, go to **Settings ? Templates**
2. Find the `Event` template
3. Replace its content with the code from: `Views/Event.cshtml`

---

### Document Type 2: Events Listing (Events Page)

1. **Go to Settings ? Document Types**
2. **Click "Create" ? Document Type**
3. **Name:** `Events Listing`
4. **Alias:** `eventsListing`
5. **Icon:** Choose `icon-calendar-alt`
6. **Template:** Create new template (auto-generates)

#### Add Properties:

| Property Name | Alias | Editor | Required |
|--------------|-------|---------|----------|
| Page Title | pageTitle | Textstring | No |
| Introduction | introduction | Textarea | No |

#### Template Configuration:

1. Go to **Settings ? Templates**
2. Find the `Events Listing` template
3. Replace its content with the code from: `Views/EventsListing.cshtml`

#### Configure Child Nodes:

1. Go back to **Settings ? Document Types ? Events Listing**
2. Click on **Structure** tab
3. Under "Allowed child node types", add: `Event`

---

## Part 3: Create Content Pages

### Create the Events Listing Page:

1. Go to **Content**
2. Right-click on your home page
3. Select **Create**
4. Choose **Events Listing**
5. Name it: `Events`
6. Fill in:
   - **Page Title:** "Upcoming Events"
   - **Introduction:** "Join us for community events, workshops, and support sessions"
7. Click **Save and Publish**

### Create Individual Event Pages:

1. Right-click on the **Events** page you just created
2. Select **Create**
3. Choose **Event**
4. Fill in all the event details
5. Click **Save and Publish**

**Repeat for each event you want to display publicly**

---

## Part 4: Navigation (Optional)

Add the Events page to your site navigation:

1. Open your header/navigation partial: `Views/Partials/components/Header.cshtml`
2. Add a link to `/events`:

```html
<a href="/events">Events</a>
```

---

## How It All Works Together

### Data Flow:

```
Backoffice Dashboard (Mock Data)
    ?
Staff manages events in Events tab
    ?
Events API provides data
    ?
Public website shows events via Umbraco Content
```

### Current Setup:

1. **Backoffice Management**: Uses mock data from `EventsManagementController.cs`
2. **Public Website**: Uses Umbraco content (Document Types)

### Future Enhancement:

To sync the two systems, you would:
1. Create an Umbraco service to read/write Event document types
2. Update `EventsManagementController.cs` to use real Umbraco content instead of mock data
3. This creates a seamless connection between backoffice management and public display

---

## API Endpoints

The Events API is accessible at:

- `GET /umbraco/backoffice/api/events/getall` - Get all events
- `GET /umbraco/backoffice/api/events/{id}` - Get single event
- `GET /umbraco/backoffice/api/events/published` - Get published events only
- `GET /umbraco/backoffice/api/events/featured` - Get featured events only
- `POST /umbraco/backoffice/api/events/create` - Create new event
- `PUT /umbraco/backoffice/api/events/update/{id}` - Update event
- `DELETE /umbraco/backoffice/api/events/delete/{id}` - Delete event

---

## Features Available

### Backoffice Dashboard:
- ? Create events with full details
- ? Edit existing events
- ? Delete events
- ? Search events
- ? Filter by status (All, Upcoming, Published, Draft, Featured)
- ? Visual cards with event details
- ? Track attendee numbers
- ? Mark events as featured
- ? Event types and tags

### Public Website:
- ? Events listing page with search
- ? Filter by upcoming/featured events
- ? Individual event detail pages
- ? Event registration prompts
- ? Share event functionality
- ? Responsive design
- ? Beautiful event cards with images

---

## Testing Checklist

- [ ] Can access Events tab in Families section
- [ ] Can create a new event in the dashboard
- [ ] Can edit an existing event
- [ ] Can delete an event
- [ ] Event filters work (Upcoming, Published, Draft, Featured)
- [ ] Search functionality works
- [ ] Document Types are created (Event, Events Listing)
- [ ] Templates are configured correctly
- [ ] Events Listing page is published
- [ ] Individual Event pages can be created
- [ ] Events display correctly on the website
- [ ] Navigation to /events works
- [ ] Mobile responsive design works

---

## Troubleshooting

### Events tab shows "Events coming soon..."
- Make sure you've saved the updated `dashboard.js` file
- Clear browser cache
- Restart Umbraco

### Events API returns 404
- Check that `EventsManagementController.cs` exists
- Verify the route: `/umbraco/backoffice/api/events/getall`
- Restart the application

### Event pages don't display correctly
- Verify templates are using the correct code
- Check that all property aliases match exactly
- Ensure Event document type allows the template

### Events don't appear on listing page
- Check that events are marked as "Published" status
- Verify the start date is in the future
- Check browser console for JavaScript errors

---

## Next Steps

1. **Sync Backend with Frontend**: Update the controller to use Umbraco's content service instead of mock data
2. **Add Registration System**: Integrate with member system for event registrations
3. **Email Notifications**: Send confirmations when users register
4. **Calendar Integration**: Add .ics file download capability
5. **Recurring Events**: Add support for weekly/monthly recurring events
6. **Event Categories**: Create taxonomy for better organization
7. **Past Events Archive**: Show history of completed events

---

## File Reference

### Backend Files:
- `Models/Event.cs` - Event data model
- `Controllers/EventsManagementController.cs` - Events API controller
- `App_Plugins/FamiliesManagement/dashboard.js` - Dashboard UI with Events tab
- `App_Plugins/FamiliesManagement/umbraco-package.json` - Package manifest

### Frontend Files:
- `Views/Event.cshtml` - Single event detail page template
- `Views/EventsListing.cshtml` - Events listing page template

### Documentation:
- `EVENTS_SETUP.md` - This file

---

## Support

If you encounter any issues:
1. Check the Umbraco logs: `App_Data/Logs/`
2. Check browser console for JavaScript errors
3. Verify all files are in the correct locations
4. Ensure Umbraco cache is cleared

Enjoy your new Events Management System! ??
