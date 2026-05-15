using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Financesharks.Api.DTOs.Goals;
using Financesharks.Api.Services;

namespace Financesharks.Api.Controllers;

[ApiController]
[Route("api/goals")]
[Authorize]
public class GoalsController : ControllerBase
{
    private readonly IGoalService _goalService;

    public GoalsController(IGoalService goalService) => _goalService = goalService;

    private Guid UserId => Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

    [HttpGet]
    public async Task<ActionResult<List<GoalResponse>>> GetAll()
    {
        return Ok(await _goalService.GetAllAsync(UserId));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GoalResponse>> GetById(Guid id)
    {
        return Ok(await _goalService.GetByIdAsync(id, UserId));
    }

    [HttpPost]
    public async Task<ActionResult<GoalResponse>> Create([FromBody] CreateGoalRequest request)
    {
        var goal = await _goalService.CreateAsync(UserId, request);
        return CreatedAtAction(nameof(GetById), new { id = goal.Id }, goal);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<GoalResponse>> Update(Guid id, [FromBody] UpdateGoalRequest request)
    {
        return Ok(await _goalService.UpdateAsync(id, UserId, request));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _goalService.DeleteAsync(id, UserId);
        return NoContent();
    }

    [HttpPost("{id}/contribute")]
    public async Task<ActionResult<GoalResponse>> Contribute(Guid id, [FromBody] ContributeRequest request)
    {
        return Ok(await _goalService.ContributeAsync(id, UserId, request));
    }
}
