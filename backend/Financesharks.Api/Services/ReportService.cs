using Microsoft.EntityFrameworkCore;
using Financesharks.Api.Data;
using Financesharks.Api.DTOs.Reports;

namespace Financesharks.Api.Services;

public class ReportService : IReportService
{
    private readonly AppDbContext _db;

    public ReportService(AppDbContext db) => _db = db;

    public async Task<NetWorthResponse> GetNetWorthAsync(Guid userId)
    {
        var totalBalance = await _db.Accounts
            .Where(a => a.UserId == userId)
            .SumAsync(a => a.Balance);

        var portfolioValue = await _db.Holdings
            .Where(h => h.UserId == userId)
            .SumAsync(h => h.Quantity * h.CurrentPrice);

        return new NetWorthResponse
        {
            TotalBalance = totalBalance,
            PortfolioValue = portfolioValue,
            NetWorth = totalBalance + portfolioValue,
        };
    }

    public async Task<List<SpendingByCategoryResponse>> GetSpendingByCategoryAsync(Guid userId, int? month, int? year)
    {
        var now = DateTime.UtcNow;
        var targetMonth = month ?? now.Month;
        var targetYear = year ?? now.Year;

        var monthStart = new DateTime(targetYear, targetMonth, 1, 0, 0, 0, DateTimeKind.Utc);
        var nextMonth = monthStart.AddMonths(1);

        var spending = await _db.Transactions
            .Where(t => t.UserId == userId && t.Type == "debit"
                && t.Date >= monthStart && t.Date < nextMonth)
            .GroupBy(t => t.Category)
            .Select(g => new { Category = g.Key, Amount = g.Sum(t => t.Amount) })
            .ToListAsync();

        var totalSpending = spending.Sum(s => s.Amount);

        return spending.Select(s => new SpendingByCategoryResponse
        {
            Category = s.Category,
            Amount = s.Amount,
            Percent = totalSpending > 0 ? Math.Round(s.Amount / totalSpending * 100, 1) : 0,
        }).ToList();
    }

    public async Task<List<IncomeVsExpenseResponse>> GetIncomeVsExpenseAsync(Guid userId, int year)
    {
        var yearStart = new DateTime(year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var nextYear = yearStart.AddYears(1);

        var monthlyData = await _db.Transactions
            .Where(t => t.UserId == userId && t.Date >= yearStart && t.Date < nextYear)
            .GroupBy(t => t.Date.Month)
            .Select(g => new
            {
                Month = g.Key,
                Income = g.Where(t => t.Type == "credit").Sum(t => t.Amount),
                Expense = g.Where(t => t.Type == "debit").Sum(t => t.Amount),
            })
            .ToListAsync();

        return Enumerable.Range(1, 12).Select(m => new IncomeVsExpenseResponse
        {
            Month = m,
            Income = monthlyData.FirstOrDefault(d => d.Month == m)?.Income ?? 0,
            Expense = monthlyData.FirstOrDefault(d => d.Month == m)?.Expense ?? 0,
        }).ToList();
    }
}
