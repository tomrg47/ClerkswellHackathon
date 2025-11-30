# Families Management - Backoffice Section

This custom Umbraco 17 backoffice section provides staff with a comprehensive interface to manage and track families seeking support.

## Features

### Custom Section in Backoffice
- **New Section**: "Families Management" appears in the Umbraco backoffice sidebar
- **Icon**: Users icon for easy identification
- **Modern UI**: Built with Lit Web Components (Umbraco 17 architecture)
- **Dashboard**: Custom dashboard with families list and filtering

### Families Table with Sortable Columns
All columns are sortable (click column headers):

1. **FAMILY** - Family name with avatar and reference code
2. **CATEGORY** - Support category (Housing, Food, Safety, Income, etc.)
3. **PRIORITY** - Priority level (Critical, High, Medium, Low) with visual indicators
4. **STATUS** - Current status (New, Active, Escalated, Monitoring)
5. **HOUSEHOLD** - Household composition (adults/children count)
6. **REGISTERED** - Date the family registered

### Search and Filtering
- **Search Box**: Full-text search across family names, reference codes, and categories
- **Filter Buttons**:
  - All Families
  - High Priority (Critical + High)
  - Medium Priority

### Tabs
- **Families Tab**: Main families management interface (active)
- **Events Tab**: Placeholder for future events management

### Actions
- **Lookup Family**: Quick lookup by reference code
- **View Details**: Click any row to view family details (currently shows an alert with key info)

## How to Access

1. **Start the Umbraco application**
2. **Login to the Backoffice** at `/umbraco`
3. **Look for "Families" section** in the left sidebar (may need to restart app if just added)
4. **Click to open** the Families Management dashboard

## Important: Umbraco 17 Setup

### After Creating the Files

1. **Restart the application** - Umbraco 17 needs to discover the new section on startup
2. **Clear browser cache** - The backoffice caches JavaScript modules
3. **Hard refresh** - Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac) in the browser
4. **Check the section appears** in the left sidebar

### If Section Doesn't Appear

1. Check the browser console (F12) for any JavaScript errors
2. Verify the files are in the correct location:
   ```
   App_Plugins/
     FamiliesManagement/
       umbraco-package.json
       dashboard.js
   ```
3. Make sure the API is accessible: `/umbraco/backoffice/api/families/getall`
4. Restart the Umbraco application

## Technical Implementation

### Files Created

#### Backend (C#)
- `Models/Family.cs` - Family data model
- `Controllers/FamiliesManagementController.cs` - API controller serving family data

#### Frontend (Umbraco Plugin) - **Updated for Umbraco 17**
- `App_Plugins/FamiliesManagement/umbraco-package.json` - Main manifest file (Umbraco 17 format)
- `App_Plugins/FamiliesManagement/dashboard.js` - Lit Web Component dashboard
- ~~`App_Plugins/FamiliesManagement/package.manifest`~~ - Legacy format (not needed)
- ~~`App_Plugins/FamiliesManagement/dashboard.html`~~ - Legacy AngularJS (not needed)
- ~~`App_Plugins/FamiliesManagement/dashboard.controller.js`~~ - Legacy AngularJS (not needed)
- ~~`App_Plugins/FamiliesManagement/dashboard.css`~~ - Styles now in dashboard.js

### Technology Stack (Umbraco 17)

- **Lit** - Web Components library
- **UUI** - Umbraco UI Library components
- **Modern JavaScript** - ES6+ modules
- **Custom Elements** - Native Web Components API

### API Endpoints

- **GET** `/umbraco/backoffice/api/families/getall` - Returns all families
- **GET** `/umbraco/backoffice/api/families/{id}` - Returns specific family by ID

### Sample Data

The system includes 7 mock families covering different scenarios:
- Sarah Johnson (Housing Crisis - Critical)
- Michael Thompson (Food Support - Critical)
- Anonymous #492 (Safety Planning - High)
- The Williams Family (Income Support - Medium)
- New Families (Community Support - Low)
- David Brown (Wellbeing - Low)

## Manifest Structure (Umbraco 17)

The `umbraco-package.json` defines:

```json
{
  "extensions": [
    {
      "type": "section",          // Registers the sidebar section
      "alias": "familiesManagement"
    },
    {
      "type": "sectionView",      // Registers the dashboard view
      "element": "/App_Plugins/FamiliesManagement/dashboard.js"
    }
  ]
}
```

## Customization

### Adding More Families
Edit `Controllers/FamiliesManagementController.cs` and add entries to the `MockFamilies` list.

### Changing Styles
Edit the `static styles` section in `dashboard.js`

### Adding New Columns
1. Add property to `Models/Family.cs`
2. Add column to table in `renderTable()` method in `dashboard.js`
3. Update sorting logic if needed

## Future Enhancements

- Database integration (replace mock data)
- Family detail pages
- Edit family information
- Add notes/timeline
- Events management tab implementation
- Export functionality
- Advanced filtering
- Dashboard analytics
- Real-time updates with SignalR

## Troubleshooting

### Section Not Appearing
1. Restart the application completely
2. Clear browser cache and hard refresh
3. Check browser console for errors
4. Verify file paths are correct

### API Not Loading
1. Check the API endpoint is accessible
2. Look for CORS errors in console
3. Verify controller route is correct

### Styling Issues
1. The component uses Umbraco's CSS variables
2. Check if UUI components are loading
3. Inspect element to see computed styles

## Notes

- Built for **Umbraco 17** (.NET 10)
- Uses **Lit Web Components** (not AngularJS)
- Uses **UUI** (Umbraco UI Library)
- Fully responsive design
- All columns are sortable
- Real-time search filtering
- Modern ES6+ JavaScript
