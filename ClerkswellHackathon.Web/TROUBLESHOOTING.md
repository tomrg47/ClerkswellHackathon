# Quick Troubleshooting - Families Management Section

## Can't See the Section in Umbraco Backoffice?

### ? Checklist

1. **Files in Correct Location?**
   ```
   ClerkswellHackathon.Web/
     App_Plugins/
       FamiliesManagement/
         ? umbraco-package.json
         ? dashboard.js
   ```

2. **Restart the Application**
   - Stop debugging (Shift+F5)
   - Rebuild solution (Ctrl+Shift+B)
   - Start again (F5)

3. **Clear Browser Cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open in Incognito/Private window

4. **Check Browser Console (F12)**
   - Look for JavaScript errors
   - Look for 404 errors loading files

5. **Verify API Works**
   - Navigate to: `https://localhost:YOUR_PORT/umbraco/backoffice/api/families/getall`
   - Should return JSON array of families

### ?? Common Issues

#### Issue: Section doesn't appear in sidebar
**Solution:**
- Umbraco 17 needs to discover extensions on startup
- Make sure `umbraco-package.json` is in the correct folder
- Check the JSON is valid (no syntax errors)
- Restart the application completely

#### Issue: "Module not found" error in console
**Solution:**
- The path to `dashboard.js` must be absolute from wwwroot
- Check the path in `umbraco-package.json`: `/App_Plugins/FamiliesManagement/dashboard.js`
- Make sure the file exists

#### Issue: API returns 404
**Solution:**
- Controller should inherit from `UmbracoApiController`
- Route should be: `[Route("umbraco/backoffice/api/families")]`
- Method route: `[Route("getall")]`

### ?? Quick Test

1. Open browser DevTools (F12)
2. Navigate to: `/umbraco`
3. Login to backoffice
4. Check Console tab for errors
5. Check Network tab for failed requests

### ?? Manual Verification

**1. Check umbraco-package.json is being loaded:**
   - Look in browser DevTools > Network tab
   - Filter by "umbraco-package"
   - Should see the file loaded

**2. Check the section registration:**
   - In browser console, type: `window.Umbraco`
   - Should see Umbraco context object
   - Extensions should be registered

**3. Check API endpoint:**
   - Open in new tab: `/umbraco/backoffice/api/families/getall`
   - Should return JSON like:
     ```json
     [
       {
         "id": 1,
         "name": "Sarah Johnson",
         "referenceCode": "sunny-garden",
         ...
       }
     ]
     ```

### ?? Still Not Working?

1. **Delete old files:**
   ```
   App_Plugins/FamiliesManagement/
     ? DELETE: package.manifest (old format)
     ? DELETE: dashboard.html (not needed)
     ? DELETE: dashboard.controller.js (not needed)
     ? DELETE: dashboard.css (not needed)
   ```

2. **Keep only these files:**
   ```
   App_Plugins/FamiliesManagement/
     ? umbraco-package.json
     ? dashboard.js
   ```

3. **Verify .csproj includes the files:**
   - Open `ClerkswellHackathon.Web.csproj`
   - Add if missing:
     ```xml
     <ItemGroup>
       <Content Include="App_Plugins\FamiliesManagement\**\*.*" />
     </ItemGroup>
     ```

4. **Check Umbraco version:**
   - Open `ClerkswellHackathon.Web.csproj`
   - Should be: `<PackageReference Include="Umbraco.Cms" Version="17.0.0" />`

### ?? Alternative: Check Section Manually

If the section still doesn't appear, you can test the dashboard directly:

1. **Test the API first:**
   ```
   https://localhost:YOUR_PORT/umbraco/backoffice/api/families/getall
   ```

2. **Check if Web Components are supported:**
   - Modern browsers should all support it
   - Chrome 67+, Edge 79+, Firefox 63+, Safari 10.1+

3. **Verify Umbraco backoffice loads:**
   - Can you access `/umbraco` normally?
   - Do other sections work?

### ?? Need Help?

Include this info when asking for help:
- Umbraco version (should be 17.0.0)
- .NET version (should be .NET 10)
- Browser and version
- Any console errors (screenshot)
- Network tab errors (screenshot)
- Steps you've already tried
