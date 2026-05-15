using Financesharks.Api.DTOs.Accounts;

namespace Financesharks.Api.Services;

public interface IAccountService
{
    Task<List<AccountResponse>> GetAllAsync(Guid userId);
    Task<AccountResponse> GetByIdAsync(Guid id, Guid userId);
    Task<AccountResponse> CreateAsync(Guid userId, CreateAccountRequest request);
    Task<AccountResponse> UpdateAsync(Guid id, Guid userId, UpdateAccountRequest request);
    Task DeleteAsync(Guid id, Guid userId);
}
