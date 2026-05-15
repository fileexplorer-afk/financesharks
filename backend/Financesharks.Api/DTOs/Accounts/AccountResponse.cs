namespace Financesharks.Api.DTOs.Accounts;

public class AccountResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal Balance { get; set; }
    public string Currency { get; set; } = "INR";
    public DateTime CreatedAt { get; set; }
    public int TransactionCount { get; set; }
}
