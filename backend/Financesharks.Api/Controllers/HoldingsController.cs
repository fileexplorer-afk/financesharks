using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Financesharks.Api.DTOs.Holdings;
using Financesharks.Api.Services;

namespace Financesharks.Api.Controllers;

[ApiController]
[Route("api/holdings")]
[Authorize]
public class HoldingsController : ControllerBase
{
    private readonly IHoldingService _holdingService;

    public HoldingsController(IHoldingService holdingService) => _holdingService = holdingService;

    private Guid UserId => Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

    [HttpGet]
    public async Task<ActionResult<List<HoldingResponse>>> GetAll()
    {
        return Ok(await _holdingService.GetAllAsync(UserId));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HoldingResponse>> GetById(Guid id)
    {
        return Ok(await _holdingService.GetByIdAsync(id, UserId));
    }

    [HttpPost]
    public async Task<ActionResult<HoldingResponse>> Create([FromBody] CreateHoldingRequest request)
    {
        var holding = await _holdingService.CreateAsync(UserId, request);
        return CreatedAtAction(nameof(GetById), new { id = holding.Id }, holding);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<HoldingResponse>> Update(Guid id, [FromBody] UpdateHoldingRequest request)
    {
        return Ok(await _holdingService.UpdateAsync(id, UserId, request));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _holdingService.DeleteAsync(id, UserId);
        return NoContent();
    }
}
