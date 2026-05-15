using Financesharks.Api.DTOs.Accounts;
using Financesharks.Api.DTOs.Transactions;

namespace Financesharks.Api.DTOs.Dashboard;

public class DashboardSummaryResponse
{
    public decimal TotalBalance { get; set; }
    public decimal MonthlySpending { get; set; }
    public decimal MonthlyIncome { get; set; }
    public int ActiveGoals { get; set; }
    public decimal PortfolioValue { get; set; }
    public decimal PortfolioGainLoss { get; set; }
    public decimal PortfolioGainLossPercent { get; set; }
    public List<AccountResponse> Accounts { get; set; } = new();
    public List<TransactionResponse> RecentTransactions { get; set; } = new();
}
