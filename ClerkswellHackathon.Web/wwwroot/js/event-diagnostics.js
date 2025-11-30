// Event Dashboard Diagnostic Script
// Copy and paste this into browser console (F12) when on the dashboard

console.log('?? Starting Event Dashboard Diagnostics...\n');

// Test 1: Check if API endpoint is accessible
async function test1_CheckAPI() {
    console.log('Test 1: Checking API endpoint...');
    try {
        const response = await fetch('/umbraco/backoffice/api/events/getall');
        if (response.ok) {
            const data = await response.json();
            console.log('? API is accessible');
            console.log(`   Found ${data.length} events`);
            if (data.length > 0) {
                console.log('   Sample event:', data[0]);
            }
            return true;
        } else {
            console.error('? API returned error:', response.status, response.statusText);
            const text = await response.text();
            console.error('   Response:', text);
            return false;
        }
    } catch (error) {
        console.error('? API request failed:', error);
        return false;
    }
}

// Test 2: Try to create a test event
async function test2_CreateEvent() {
    console.log('\nTest 2: Attempting to create test event...');
    
    const testEvent = {
        title: "Diagnostic Test Event",
        description: "This is a test event created by the diagnostic script",
        startDate: "2025-12-31T10:00",
        endDate: "2025-12-31T12:00",
        location: "Test Location",
        eventType: "Community Event",
        status: "Draft",
        maxAttendees: 10,
        currentAttendees: 0,
        requiresRegistration: false,
        contactEmail: "test@test.com",
        contactPhone: "",
        tags: ["Test"],
        imageUrl: "",
        isFeatured: false
    };
    
    try {
        const response = await fetch('/umbraco/backoffice/api/events/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testEvent)
        });
        
        console.log('   Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('? Test event created successfully!');
            console.log('   Event ID:', data.id);
            console.log('   Event:', data);
            return data;
        } else {
            console.error('? Failed to create event');
            try {
                const errorData = await response.json();
                console.error('   Error:', errorData);
                
                if (errorData.message && errorData.message.includes('Events Listing page not found')) {
                    console.error('\n??  PROBLEM IDENTIFIED:');
                    console.error('   You need to create an Events Listing page!');
                    console.error('   Steps:');
                    console.error('   1. Go to Content section');
                    console.error('   2. Create new page with "Events Listing" document type');
                    console.error('   3. Name it "Events"');
                    console.error('   4. Save and Publish');
                }
                
            } catch (e) {
                const errorText = await response.text();
                console.error('   Error text:', errorText);
            }
            return null;
        }
    } catch (error) {
        console.error('? Request failed:', error);
        return null;
    }
}

// Test 3: Check if dashboard element exists
function test3_CheckDashboard() {
    console.log('\nTest 3: Checking dashboard element...');
    const dashboard = document.querySelector('families-management-dashboard');
    if (dashboard) {
        console.log('? Dashboard element found');
        console.log('   Active tab:', dashboard.activeTab);
        console.log('   Events loaded:', dashboard.events?.length || 0);
        console.log('   Families loaded:', dashboard.families?.length || 0);
        return true;
    } else {
        console.error('? Dashboard element not found');
        console.error('   The dashboard may not have loaded correctly');
        return false;
    }
}

// Test 4: Cleanup test event
async function test4_Cleanup(eventId) {
    if (!eventId) {
        console.log('\nTest 4: No test event to cleanup');
        return;
    }
    
    console.log('\nTest 4: Cleaning up test event...');
    try {
        const response = await fetch(`/umbraco/backoffice/api/events/delete/${eventId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            console.log('? Test event deleted successfully');
        } else {
            console.warn('??  Could not delete test event (ID:', eventId, ')');
            console.warn('   You may need to delete it manually from Content section');
        }
    } catch (error) {
        console.error('? Cleanup failed:', error);
    }
}

// Run all tests
async function runDiagnostics() {
    console.log('?'.repeat(60));
    console.log('EVENT DASHBOARD DIAGNOSTICS');
    console.log('?'.repeat(60));
    
    const apiWorking = await test1_CheckAPI();
    const dashboardWorking = test3_CheckDashboard();
    
    if (apiWorking) {
        const createdEvent = await test2_CreateEvent();
        
        if (createdEvent) {
            // Ask user if they want to cleanup
            console.log('\n? Test event was created. Delete it?');
            console.log('   Run: cleanupTestEvent(' + createdEvent.id + ')');
            window.cleanupTestEvent = async (id) => {
                await test4_Cleanup(id);
            };
        }
    }
    
    // Summary
    console.log('\n' + '?'.repeat(60));
    console.log('SUMMARY');
    console.log('?'.repeat(60));
    
    if (apiWorking && dashboardWorking) {
        console.log('? System appears to be working');
        console.log('   If you still have issues creating events:');
        console.log('   1. Check that Events Listing page exists and is published');
        console.log('   2. Check that Event document type has all properties');
        console.log('   3. Clear browser cache and refresh');
    } else {
        console.log('? Issues detected:');
        if (!apiWorking) {
            console.log('   - API is not responding correctly');
            console.log('     ? Check application is running');
            console.log('     ? Check for errors in application logs');
        }
        if (!dashboardWorking) {
            console.log('   - Dashboard is not loaded');
            console.log('     ? Refresh the page');
            console.log('     ? Check browser console for errors');
        }
    }
    
    console.log('\n' + '?'.repeat(60));
    console.log('For detailed troubleshooting, see:');
    console.log('EVENT_SAVING_TROUBLESHOOTING.md');
    console.log('?'.repeat(60));
}

// Run diagnostics
runDiagnostics();
