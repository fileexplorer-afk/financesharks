using Financesharks.Api.DTOs.Transactions;

namespace Financesharks.Api.Services;

public interface ITransactionService
{
    Task<TransactionListResponse> GetAllAsync(Guid userId, TransactionFilterRequest filter);
    Task<TransactionResponse> GetByIdAsync(Guid id, Guid userId);
    Task<TransactionResponse> CreateAsync(Guid userId, CreateTransactionRequest request);
    Task<TransactionResponse> UpdateAsync(Guid id, Guid userId, UpdateTransactionRequest request);
    Task DeleteAsync(Guid id, Guid userId);
    Task<Dictionary<string, decimal>> GetSummaryAsync(Guid userId, DateTime? from, DateTime? to);
}
