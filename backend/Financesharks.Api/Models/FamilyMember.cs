using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Financesharks.Api.Models;

public class FamilyMember
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid HouseholdId { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [MaxLength(20)]
    public string Role { get; set; } = "member";

    [MaxLength(20)]
    public string Status { get; set; } = "active";

    public Guid? InvitedBy { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(HouseholdId))]
    public FamilyHousehold Household { get; set; } = null!;

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;
}
