using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Financesharks.Api.DTOs.Accounts;
using Financesharks.Api.Services;

namespace Financesharks.Api.Controllers;

[ApiController]
[Route("api/accounts")]
[Authorize]
public class AccountsController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountsController(IAccountService accountService) => _accountService = accountService;

    private Guid UserId => Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

    [HttpGet]
    public async Task<ActionResult<List<AccountResponse>>> GetAll()
    {
        return Ok(await _accountService.GetAllAsync(UserId));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AccountResponse>> GetById(Guid id)
    {
        return Ok(await _accountService.GetByIdAsync(id, UserId));
    }

    [HttpPost]
    public async Task<ActionResult<AccountResponse>> Create([FromBody] CreateAccountRequest request)
    {
        var account = await _accountService.CreateAsync(UserId, request);
        return CreatedAtAction(nameof(GetById), new { id = account.Id }, account);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AccountResponse>> Update(Guid id, [FromBody] UpdateAccountRequest request)
    {
        return Ok(await _accountService.UpdateAsync(id, UserId, request));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _accountService.DeleteAsync(id, UserId);
        return NoContent();
    }
}
