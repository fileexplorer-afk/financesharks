namespace Financesharks.Api.Services;

public class InsightResponse
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}

public interface IInsightService
{
    Task<List<InsightResponse>> GetTipsAsync(Guid userId);
    Task<List<InsightResponse>> GetMarketInsightsAsync(Guid userId);
    Task<string> GetPortfolioHealthAsync(Guid userId);
}
