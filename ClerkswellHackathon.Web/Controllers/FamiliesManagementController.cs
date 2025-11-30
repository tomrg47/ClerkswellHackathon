using Microsoft.AspNetCore.Mvc;
using ClerkswellHackathon.Web.Models;
using Umbraco.Cms.Web.Common.Controllers;

namespace ClerkswellHackathon.Web.Controllers;

[Route("umbraco/backoffice/api/families")]
public class FamiliesManagementController : UmbracoApiController
{
    private static readonly List<Family> MockFamilies = new()
    {
        new Family
        {
            Id = 1,
            Name = "Sarah Johnson",
            ReferenceCode = "sunny-garden",
            Category = "Housing",
            Priority = "Critical",
            Status = "New",
            Household = "2 adults, 3 children",
            RegisteredDate = new DateTime(2025, 11, 28),
            LastContact = DateTime.Now.AddMinutes(-2),
            Flags = new List<string> { "risk_homeless" },
            Engagement = new List<string> { "Housing Support", "Dignity Supermarket" }
        },
        new Family
        {
            Id = 2,
            Name = "Michael Thompson",
            ReferenceCode = "blue-river",
            Category = "Food",
            Priority = "Critical",
            Status = "Active",
            Household = "1 adult, 0 children",
            RegisteredDate = new DateTime(2025, 11, 27),
            LastContact = DateTime.Now.AddMinutes(-15),
            Flags = new List<string>(),
            Engagement = new List<string> { "Emergency Food" }
        },
        new Family
        {
            Id = 3,
            Name = "Anonymous #492",
            ReferenceCode = "safe-space",
            Category = "Safety",
            Priority = "High",
            Status = "Active",
            Household = "1 adult, 2 children",
            RegisteredDate = new DateTime(2025, 11, 23),
            LastContact = DateTime.Now.AddDays(-2),
            Flags = new List<string> { "domestic_violence_risk" },
            Engagement = new List<string> { "Safety Planning" }
        },
        new Family
        {
            Id = 4,
            Name = "The Williams Family",
            ReferenceCode = "green-valley",
            Category = "Income",
            Priority = "Medium",
            Status = "Active",
            Household = "2 adults, 4 children",
            RegisteredDate = new DateTime(2025, 11, 25),
            LastContact = DateTime.Now.AddDays(-1),
            Flags = new List<string> { "children_in_household" },
            Engagement = new List<string> { "Benefits Advice", "Kids Club" }
        },
        new Family
        {
            Id = 5,
            Name = "New Family",
            ReferenceCode = "bright-river",
            Category = "Community",
            Priority = "Low",
            Status = "New",
            Household = "2 adults, 1 child",
            RegisteredDate = new DateTime(2025, 11, 28),
            LastContact = DateTime.Now.AddHours(-3),
            Flags = new List<string>(),
            Engagement = new List<string> { "Community Support" }
        },
        new Family
        {
            Id = 6,
            Name = "New Family",
            ReferenceCode = "warm-mountain",
            Category = "Community",
            Priority = "Low",
            Status = "New",
            Household = "1 adult, 0 children",
            RegisteredDate = new DateTime(2025, 11, 28),
            LastContact = DateTime.Now.AddHours(-2),
            Flags = new List<string>(),
            Engagement = new List<string>()
        },
        new Family
        {
            Id = 7,
            Name = "David Brown",
            ReferenceCode = "peaceful-coast",
            Category = "Wellbeing",
            Priority = "Low",
            Status = "Active",
            Household = "1 adult, 0 children",
            RegisteredDate = new DateTime(2025, 11, 21),
            LastContact = DateTime.Now.AddDays(-5),
            Flags = new List<string> { "elderly_vulnerable" },
            Engagement = new List<string> { "Silver Coffee Morning" }
        }
    };

    [HttpGet]
    [Route("getall")]
    public IActionResult GetAll()
    {
        return Ok(MockFamilies);
    }

    [HttpGet]
    [Route("{id}")]
    public IActionResult GetById(int id)
    {
        var family = MockFamilies.FirstOrDefault(f => f.Id == id);
        if (family == null)
        {
            return NotFound();
        }
        return Ok(family);
    }
}
