using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Financesharks.Api.DTOs.Holdings;
using Financesharks.Api.Services;

namespace Financesharks.Api.Controllers;

[ApiController]
[Route("api/portfolio")]
[Authorize]
public class PortfolioController : ControllerBase
{
    private readonly IHoldingService _holdingService;

    public PortfolioController(IHoldingService holdingService) => _holdingService = holdingService;

    private Guid UserId => Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

    [HttpGet("summary")]
    public async Task<ActionResult<PortfolioSummaryResponse>> GetSummary()
    {
        return Ok(await _holdingService.GetPortfolioSummaryAsync(UserId));
    }
}
