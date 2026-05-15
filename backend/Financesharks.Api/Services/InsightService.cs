using Microsoft.EntityFrameworkCore;
using Financesharks.Api.Data;

namespace Financesharks.Api.Services;

public class InsightService : IInsightService
{
    private readonly AppDbContext _db;

    public InsightService(AppDbContext db) => _db = db;

    public async Task<List<InsightResponse>> GetTipsAsync(Guid userId)
    {
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var nextMonth = monthStart.AddMonths(1);

        var spending = await _db.Transactions
            .Where(t => t.UserId == userId && t.Type == "debit" && t.Date >= monthStart && t.Date < nextMonth)
            .SumAsync(t => t.Amount);

        var tips = new List<InsightResponse>();

        if (spending > 50000)
            tips.Add(new InsightResponse
            {
                Title = "High Spending Alert",
                Description = $"Your spending this month (₹{spending:N0}) is significantly high. Consider reviewing your budget.",
                Type = "warning",
            });
        else if (spending < 10000)
            tips.Add(new InsightResponse
            {
                Title = "Great Saving!",
                Description = $"You've only spent ₹{spending:N0} this month. Keep up the good work!",
                Type = "success",
            });

        tips.Add(new InsightResponse
        {
            Title = "Emergency Fund",
            Description = "Aim to save 3-6 months of expenses in your emergency fund for financial security.",
            Type = "info",
        });

        tips.Add(new InsightResponse
        {
            Title = "Investment Diversification",
            Description = "Diversify your portfolio across different sectors to reduce risk.",
            Type = "info",
        });

        return tips;
    }

    public async Task<List<InsightResponse>> GetMarketInsightsAsync(Guid userId)
    {
        var holdings = await _db.Holdings.Where(h => h.UserId == userId).ToListAsync();

        var insights = new List<InsightResponse>();

        if (holdings.Any(h => h.CurrentPrice > h.BuyPrice * 1.2m))
            insights.Add(new InsightResponse
            {
                Title = "Top Performer",
                Description = "Some holdings have gained over 20%! Consider taking partial profits.",
                Type = "success",
            });

        if (holdings.Any(h => h.CurrentPrice < h.BuyPrice * 0.9m))
            insights.Add(new InsightResponse
            {
                Title = "Underperformers",
                Description = "Some holdings are down over 10%. Review if they still fit your strategy.",
                Type = "warning",
            });

        insights.Add(new InsightResponse
        {
            Title = "Market Outlook",
            Description = "Markets are showing mixed signals. Maintain a balanced approach to investing.",
            Type = "info",
        });

        return insights;
    }

    public async Task<string> GetPortfolioHealthAsync(Guid userId)
    {
        var holdings = await _db.Holdings.Where(h => h.UserId == userId).ToListAsync();

        if (!holdings.Any()) return "No investments yet. Start building your portfolio.";

        var gainers = holdings.Count(h => h.CurrentPrice >= h.BuyPrice);
        var total = holdings.Count;
        var ratio = (double)gainers / total;

        if (ratio >= 0.7) return "Healthy";
        if (ratio >= 0.4) return "Fair";
        return "Needs Attention";
    }
}
