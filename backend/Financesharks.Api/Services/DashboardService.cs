using Microsoft.EntityFrameworkCore;
using Financesharks.Api.Data;
using Financesharks.Api.DTOs.Accounts;
using Financesharks.Api.DTOs.Dashboard;
using Financesharks.Api.DTOs.Transactions;

namespace Financesharks.Api.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _db;

    public DashboardService(AppDbContext db) => _db = db;

    public async Task<DashboardSummaryResponse> GetSummaryAsync(Guid userId)
    {
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var nextMonth = monthStart.AddMonths(1);

        var accounts = await _db.Accounts
            .Where(a => a.UserId == userId)
            .ToListAsync();

        var totalBalance = accounts.Sum(a => a.Balance);

        var monthlySpending = await _db.Transactions
            .Where(t => t.UserId == userId && t.Type == "debit"
                && t.Date >= monthStart && t.Date < nextMonth)
            .SumAsync(t => t.Amount);

        var monthlyIncome = await _db.Transactions
            .Where(t => t.UserId == userId && t.Type == "credit"
                && t.Date >= monthStart && t.Date < nextMonth)
            .SumAsync(t => t.Amount);

        var activeGoals = await _db.Goals
            .CountAsync(g => g.UserId == userId && g.CurrentAmount < g.TargetAmount);

        var holdings = await _db.Holdings
            .Where(h => h.UserId == userId)
            .ToListAsync();

        var portfolioValue = holdings.Sum(h => h.Quantity * h.CurrentPrice);
        var portfolioInvested = holdings.Sum(h => h.Quantity * h.BuyPrice);
        var portfolioGainLoss = portfolioValue - portfolioInvested;
        var portfolioGainLossPercent = portfolioInvested > 0
            ? Math.Round(portfolioGainLoss / portfolioInvested * 100, 1)
            : 0;

        var recentTransactions = await _db.Transactions
            .Include(t => t.Account)
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.Date)
            .Take(5)
            .Select(t => new TransactionResponse
            {
                Id = t.Id,
                AccountId = t.AccountId,
                AccountName = t.Account != null ? t.Account.Name : null,
                Amount = t.Amount,
                Category = t.Category,
                Description = t.Description,
                Type = t.Type,
                Date = t.Date,
                CreatedAt = t.CreatedAt,
            })
            .ToListAsync();

        return new DashboardSummaryResponse
        {
            TotalBalance = totalBalance,
            MonthlySpending = monthlySpending,
            MonthlyIncome = monthlyIncome,
            ActiveGoals = activeGoals,
            PortfolioValue = portfolioValue,
            PortfolioGainLoss = portfolioGainLoss,
            PortfolioGainLossPercent = portfolioGainLossPercent,
            Accounts = accounts.Select(a => new AccountResponse
            {
                Id = a.Id,
                Name = a.Name,
                Type = a.Type,
                Balance = a.Balance,
                Currency = a.Currency,
                CreatedAt = a.CreatedAt,
            }).ToList(),
            RecentTransactions = recentTransactions,
        };
    }
}
