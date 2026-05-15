namespace Financesharks.Api.DTOs.Reports;

public class NetWorthResponse
{
    public decimal TotalBalance { get; set; }
    public decimal PortfolioValue { get; set; }
    public decimal NetWorth { get; set; }
}

public class SpendingByCategoryResponse
{
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal Percent { get; set; }
}

public class IncomeVsExpenseResponse
{
    public int Month { get; set; }
    public decimal Income { get; set; }
    public decimal Expense { get; set; }
}
