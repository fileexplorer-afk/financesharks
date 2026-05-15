using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Financesharks.Api.DTOs.Family;
using Financesharks.Api.Services;

namespace Financesharks.Api.Controllers;

[ApiController]
[Route("api/family")]
[Authorize]
public class FamilyController : ControllerBase
{
    private readonly IFamilyService _familyService;

    public FamilyController(IFamilyService familyService) => _familyService = familyService;

    private Guid UserId => Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

    [HttpGet("members")]
    public async Task<ActionResult<List<FamilyMemberResponse>>> GetMembers()
    {
        return Ok(await _familyService.GetMembersAsync(UserId));
    }

    [HttpPost("invite")]
    public async Task<ActionResult<FamilyMemberResponse>> InviteMember([FromBody] InviteMemberRequest request)
    {
        return Ok(await _familyService.InviteMemberAsync(UserId, request));
    }

    [HttpDelete("members/{id}")]
    public async Task<ActionResult> RemoveMember(Guid id)
    {
        await _familyService.RemoveMemberAsync(id, UserId);
        return NoContent();
    }

    [HttpPut("members/{id}/role")]
    public async Task<ActionResult<FamilyMemberResponse>> UpdateMemberRole(Guid id, [FromBody] UpdateMemberRoleRequest request)
    {
        return Ok(await _familyService.UpdateMemberRoleAsync(id, UserId, request));
    }
}
