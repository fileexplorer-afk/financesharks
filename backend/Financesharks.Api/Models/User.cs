using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Financesharks.Api.Models;

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public string? AvatarUrl { get; set; }

    [MaxLength(20)]
    public string Tier { get; set; } = "free";

    [MaxLength(20)]
    public string Role { get; set; } = "user";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public ICollection<Account> Accounts { get; set; } = new List<Account>();
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    public ICollection<Goal> Goals { get; set; } = new List<Goal>();
    public ICollection<Holding> Holdings { get; set; } = new List<Holding>();
    public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
}
