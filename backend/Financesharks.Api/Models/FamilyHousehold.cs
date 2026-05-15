using System.ComponentModel.DataAnnotations;

namespace Financesharks.Api.Models;

public class FamilyHousehold
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(100)]
    public string? Name { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<FamilyMember> Members { get; set; } = new List<FamilyMember>();
}
