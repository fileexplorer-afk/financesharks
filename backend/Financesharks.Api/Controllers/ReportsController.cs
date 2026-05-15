using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Financesharks.Api.DTOs.Reports;
using Financesharks.Api.Services;

namespace Financesharks.Api.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService) => _reportService = reportService;

    private Guid UserId => Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

    [HttpGet("net-worth")]
    public async Task<ActionResult<NetWorthResponse>> GetNetWorth()
    {
        return Ok(await _reportService.GetNetWorthAsync(UserId));
    }

    [HttpGet("spending-by-category")]
    public async Task<ActionResult<List<SpendingByCategoryResponse>>> GetSpendingByCategory([FromQuery] int? month, [FromQuery] int? year)
    {
        return Ok(await _reportService.GetSpendingByCategoryAsync(UserId, month, year));
    }

    [HttpGet("income-vs-expense")]
    public async Task<ActionResult<List<IncomeVsExpenseResponse>>> GetIncomeVsExpense([FromQuery] int year)
    {
        return Ok(await _reportService.GetIncomeVsExpenseAsync(UserId, year));
    }
}
