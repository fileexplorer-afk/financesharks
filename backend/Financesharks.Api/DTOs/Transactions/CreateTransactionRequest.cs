using System.ComponentModel.DataAnnotations;

namespace Financesharks.Api.DTOs.Transactions;

public class CreateTransactionRequest
{
    public Guid? AccountId { get; set; }

    [Required, Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required, MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required, MaxLength(10)]
    public string Type { get; set; } = string.Empty;

    [Required]
    public DateTime Date { get; set; }
}

public class UpdateTransactionRequest
{
    public Guid? AccountId { get; set; }

    [Required, Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required, MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required, MaxLength(10)]
    public string Type { get; set; } = string.Empty;

    [Required]
    public DateTime Date { get; set; }
}

public class TransactionFilterRequest
{
    public Guid? AccountId { get; set; }
    public string? Category { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 20;
}
