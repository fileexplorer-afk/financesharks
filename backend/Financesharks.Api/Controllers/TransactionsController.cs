using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Financesharks.Api.DTOs.Transactions;
using Financesharks.Api.Services;

namespace Financesharks.Api.Controllers;

[ApiController]
[Route("api/transactions")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService) => _transactionService = transactionService;

    private Guid UserId => Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

    [HttpGet]
    public async Task<ActionResult<TransactionListResponse>> GetAll([FromQuery] TransactionFilterRequest filter)
    {
        return Ok(await _transactionService.GetAllAsync(UserId, filter));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TransactionResponse>> GetById(Guid id)
    {
        return Ok(await _transactionService.GetByIdAsync(id, UserId));
    }

    [HttpPost]
    public async Task<ActionResult<TransactionResponse>> Create([FromBody] CreateTransactionRequest request)
    {
        var transaction = await _transactionService.CreateAsync(UserId, request);
        return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, transaction);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TransactionResponse>> Update(Guid id, [FromBody] UpdateTransactionRequest request)
    {
        return Ok(await _transactionService.UpdateAsync(id, UserId, request));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _transactionService.DeleteAsync(id, UserId);
        return NoContent();
    }

    [HttpGet("summary")]
    public async Task<ActionResult<Dictionary<string, decimal>>> GetSummary([FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        return Ok(await _transactionService.GetSummaryAsync(UserId, from, to));
    }
}
