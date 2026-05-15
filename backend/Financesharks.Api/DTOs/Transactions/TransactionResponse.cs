namespace Financesharks.Api.DTOs.Transactions;

public class TransactionResponse
{
    public Guid Id { get; set; }
    public Guid? AccountId { get; set; }
    public string? AccountName { get; set; }
    public decimal Amount { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class TransactionListResponse
{
    public List<TransactionResponse> Items { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int Limit { get; set; }
}
