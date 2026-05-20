using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Financesharks.Api.Services;

namespace Financesharks.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService) => _adminService = adminService;

    [HttpGet("users")]
    public async Task<ActionResult<List<AdminUserResponse>>> GetAllUsers()
    {
        return Ok(await _adminService.GetAllUsersAsync());
    }

    [HttpGet("stats")]
    public async Task<ActionResult<AdminStatsResponse>> GetStats()
    {
        return Ok(await _adminService.GetStatsAsync());
    }

    [HttpPut("users/{userId:guid}/role")]
    public async Task<ActionResult<AdminUserResponse>> UpdateUserRole(Guid userId, [FromBody] UpdateRoleRequest request)
    {
        return Ok(await _adminService.UpdateUserRoleAsync(userId, request.Role));
    }

    [HttpDelete("users/{userId:guid}")]
    public async Task<ActionResult> DeleteUser(Guid userId)
    {
        await _adminService.DeleteUserAsync(userId);
        return NoContent();
    }
}
