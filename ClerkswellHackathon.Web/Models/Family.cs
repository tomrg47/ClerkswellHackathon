namespace ClerkswellHackathon.Web.Models;

public class Family
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ReferenceCode { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Household { get; set; } = string.Empty;
    public DateTime RegisteredDate { get; set; }
    public DateTime LastContact { get; set; }
    public List<string> Flags { get; set; } = new();
    public List<string> Engagement { get; set; } = new();
}
