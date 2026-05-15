using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Financesharks.Api.Services;

namespace Financesharks.Api.Controllers;

[ApiController]
[Route("api/insights")]
[Authorize]
public class InsightsController : ControllerBase
{
    private readonly IInsightService _insightService;

    public InsightsController(IInsightService insightService) => _insightService = insightService;

    private Guid UserId => Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

    [HttpGet("tips")]
    public async Task<ActionResult<List<InsightResponse>>> GetTips()
    {
        return Ok(await _insightService.GetTipsAsync(UserId));
    }

    [HttpGet("market")]
    public async Task<ActionResult<List<InsightResponse>>> GetMarketInsights()
    {
        return Ok(await _insightService.GetMarketInsightsAsync(UserId));
    }

    [HttpGet("health")]
    public async Task<ActionResult<string>> GetPortfolioHealth()
    {
        return Ok(await _insightService.GetPortfolioHealthAsync(UserId));
    }
}
