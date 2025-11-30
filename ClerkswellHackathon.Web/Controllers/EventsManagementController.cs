using Microsoft.AspNetCore.Mvc;
using ClerkswellHackathon.Web.Models;
using Umbraco.Cms.Web.Common.Controllers;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Models;

namespace ClerkswellHackathon.Web.Controllers;

[Route("umbraco/backoffice/api/events")]
public class EventsManagementController : UmbracoApiController
{
    private readonly IContentService _contentService;
    private readonly ILogger<EventsManagementController> _logger;

    public EventsManagementController(
        IContentService contentService,
        ILogger<EventsManagementController> logger)
    {
        _contentService = contentService;
        _logger = logger;
    }

    private IContent? GetEventsListingParent()
    {
        // Find the first Events Listing page in the content tree
        var rootContent = _contentService.GetRootContent();
        
        foreach (var root in rootContent)
        {
            // Check if this is an Events Listing
            if (root.ContentType.Alias == "eventsListing")
            {
                return root;
            }
            
            // Check descendants
            var descendants = _contentService.GetPagedDescendants(root.Id, 0, 1000, out var total);
            var eventsListing = descendants.FirstOrDefault(x => x.ContentType.Alias == "eventsListing");
            if (eventsListing != null)
            {
                return eventsListing;
            }
        }
        
        return null;
    }

    private Event MapContentToEvent(IContent content)
    {
        return new Event
        {
            Id = content.Id,
            Title = content.GetValue<string>("eventTitle") ?? content.Name ?? string.Empty,
            Description = content.GetValue<string>("eventDescription") ?? string.Empty,
            StartDate = content.GetValue<DateTime>("eventStartDate"),
            EndDate = content.GetValue<DateTime>("eventEndDate"),
            Location = content.GetValue<string>("eventLocation") ?? string.Empty,
            EventType = content.GetValue<string>("eventType") ?? "Community Event",
            Status = content.Published ? "Published" : "Draft",
            MaxAttendees = content.GetValue<int>("maxAttendees"),
            CurrentAttendees = content.GetValue<int>("currentAttendees"),
            RequiresRegistration = content.GetValue<bool>("requiresRegistration"),
            ContactEmail = content.GetValue<string>("contactEmail") ?? string.Empty,
            ContactPhone = content.GetValue<string>("contactPhone") ?? string.Empty,
            Tags = content.GetValue<string>("tags")?.Split(',').Select(t => t.Trim()).ToList() ?? new List<string>(),
            ImageUrl = content.GetValue<string>("imageUrl") ?? string.Empty,
            IsFeatured = content.GetValue<bool>("isFeatured"),
            CreatedDate = content.CreateDate,
            LastModifiedDate = content.UpdateDate
        };
    }

    [HttpGet]
    [Route("getall")]
    public IActionResult GetAll()
    {
        try
        {
            var eventsListing = GetEventsListingParent();
            if (eventsListing == null)
            {
                // Return empty list if no Events Listing page exists yet
                return Ok(new List<Event>());
            }

            var eventNodes = _contentService.GetPagedChildren(eventsListing.Id, 0, 1000, out var total)
                .Where(x => x.ContentType.Alias == "event");

            var events = eventNodes.Select(MapContentToEvent).OrderByDescending(e => e.StartDate);

            return Ok(events);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving events");
            return StatusCode(500, new { error = "Error retrieving events", message = ex.Message });
        }
    }

    [HttpGet]
    [Route("{id}")]
    public IActionResult GetById(int id)
    {
        try
        {
            var content = _contentService.GetById(id);
            if (content == null || content.ContentType.Alias != "event")
            {
                return NotFound();
            }

            var evt = MapContentToEvent(content);
            return Ok(evt);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving event {EventId}", id);
            return StatusCode(500, new { error = "Error retrieving event" });
        }
    }

    [HttpPost]
    [Route("create")]
    public IActionResult Create([FromBody] Event newEvent)
    {
        try
        {
            if (newEvent == null || string.IsNullOrWhiteSpace(newEvent.Title))
            {
                return BadRequest("Event title is required");
            }

            var eventsListing = GetEventsListingParent();
            if (eventsListing == null)
            {
                return BadRequest(new { 
                    error = "Events Listing page not found", 
                    message = "Please create an 'Events Listing' page in the Content section first" 
                });
            }

            // Create new event content node
            var eventContent = _contentService.Create(newEvent.Title, eventsListing.Id, "event");

            // Set properties
            eventContent.SetValue("eventTitle", newEvent.Title);
            eventContent.SetValue("eventDescription", newEvent.Description);
            eventContent.SetValue("eventStartDate", newEvent.StartDate);
            eventContent.SetValue("eventEndDate", newEvent.EndDate);
            eventContent.SetValue("eventLocation", newEvent.Location);
            eventContent.SetValue("eventType", newEvent.EventType);
            eventContent.SetValue("maxAttendees", newEvent.MaxAttendees);
            eventContent.SetValue("currentAttendees", newEvent.CurrentAttendees);
            eventContent.SetValue("requiresRegistration", newEvent.RequiresRegistration);
            eventContent.SetValue("contactEmail", newEvent.ContactEmail);
            eventContent.SetValue("contactPhone", newEvent.ContactPhone);
            eventContent.SetValue("tags", string.Join(",", newEvent.Tags));
            eventContent.SetValue("imageUrl", newEvent.ImageUrl);
            eventContent.SetValue("isFeatured", newEvent.IsFeatured);

            // Save first
            var saveResult = _contentService.Save(eventContent);
            
            // Then publish if status is Published
            if (newEvent.Status == "Published")
            {
                var publishResult = _contentService.Publish(eventContent, new string[] { });
            }

            var createdEvent = MapContentToEvent(eventContent);
            return Ok(createdEvent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating event");
            return StatusCode(500, new { error = "Error creating event", message = ex.Message });
        }
    }

    [HttpPut]
    [Route("update/{id}")]
    public IActionResult Update(int id, [FromBody] Event updatedEvent)
    {
        try
        {
            var eventContent = _contentService.GetById(id);
            if (eventContent == null || eventContent.ContentType.Alias != "event")
            {
                return NotFound();
            }

            // Update properties
            eventContent.SetValue("eventTitle", updatedEvent.Title);
            eventContent.SetValue("eventDescription", updatedEvent.Description);
            eventContent.SetValue("eventStartDate", updatedEvent.StartDate);
            eventContent.SetValue("eventEndDate", updatedEvent.EndDate);
            eventContent.SetValue("eventLocation", updatedEvent.Location);
            eventContent.SetValue("eventType", updatedEvent.EventType);
            eventContent.SetValue("maxAttendees", updatedEvent.MaxAttendees);
            eventContent.SetValue("currentAttendees", updatedEvent.CurrentAttendees);
            eventContent.SetValue("requiresRegistration", updatedEvent.RequiresRegistration);
            eventContent.SetValue("contactEmail", updatedEvent.ContactEmail);
            eventContent.SetValue("contactPhone", updatedEvent.ContactPhone);
            eventContent.SetValue("tags", string.Join(",", updatedEvent.Tags));
            eventContent.SetValue("imageUrl", updatedEvent.ImageUrl);
            eventContent.SetValue("isFeatured", updatedEvent.IsFeatured);

            // Update name if title changed
            eventContent.Name = updatedEvent.Title;

            // Save
            _contentService.Save(eventContent);
            
            // Handle publish/unpublish
            if (updatedEvent.Status == "Published")
            {
                _contentService.Publish(eventContent, new string[] { });
            }
            else
            {
                if (eventContent.Published)
                {
                    _contentService.Unpublish(eventContent);
                }
            }

            var result = MapContentToEvent(eventContent);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating event {EventId}", id);
            return StatusCode(500, new { error = "Error updating event", message = ex.Message });
        }
    }

    [HttpDelete]
    [Route("delete/{id}")]
    public IActionResult Delete(int id)
    {
        try
        {
            var eventContent = _contentService.GetById(id);
            if (eventContent == null || eventContent.ContentType.Alias != "event")
            {
                return NotFound();
            }

            _contentService.Delete(eventContent);
            return Ok(new { message = "Event deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting event {EventId}", id);
            return StatusCode(500, new { error = "Error deleting event" });
        }
    }

    [HttpGet]
    [Route("published")]
    public IActionResult GetPublished()
    {
        try
        {
            var eventsListing = GetEventsListingParent();
            if (eventsListing == null)
            {
                return Ok(new List<Event>());
            }

            var eventNodes = _contentService.GetPagedChildren(eventsListing.Id, 0, 1000, out var total)
                .Where(x => x.ContentType.Alias == "event" && x.Published);

            var events = eventNodes
                .Select(MapContentToEvent)
                .Where(e => e.StartDate >= DateTime.Now)
                .OrderBy(e => e.StartDate);

            return Ok(events);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving published events");
            return Ok(new List<Event>());
        }
    }

    [HttpGet]
    [Route("featured")]
    public IActionResult GetFeatured()
    {
        try
        {
            var eventsListing = GetEventsListingParent();
            if (eventsListing == null)
            {
                return Ok(new List<Event>());
            }

            var eventNodes = _contentService.GetPagedChildren(eventsListing.Id, 0, 1000, out var total)
                .Where(x => x.ContentType.Alias == "event" && x.Published);

            var events = eventNodes
                .Select(MapContentToEvent)
                .Where(e => e.IsFeatured && e.StartDate >= DateTime.Now)
                .OrderBy(e => e.StartDate);

            return Ok(events);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving featured events");
            return Ok(new List<Event>());
        }
    }
}
