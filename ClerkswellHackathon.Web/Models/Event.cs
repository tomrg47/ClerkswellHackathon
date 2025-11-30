namespace ClerkswellHackathon.Web.Models;

public class Event
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public string EventType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int MaxAttendees { get; set; }
    public int CurrentAttendees { get; set; }
    public bool RequiresRegistration { get; set; }
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public DateTime CreatedDate { get; set; }
    public DateTime LastModifiedDate { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }
}
