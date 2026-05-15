using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Financesharks.Api.Models;

public class Goal
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required, MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TargetAmount { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal CurrentAmount { get; set; }

    public DateTime Deadline { get; set; }

    [MaxLength(10)]
    public string Priority { get; set; } = "medium";

    [MaxLength(50)]
    public string? Category { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal MonthlyContribution { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;
}
