using Financesharks.Api.Models;

namespace Financesharks.Api.Services;

public interface IBudgetService
{
    Task<List<Budget>> GetAllAsync(Guid userId, int? month, int? year);
    Task<Budget> CreateAsync(Guid userId, Budget budget);
    Task<Budget> UpdateAsync(Guid id, Guid userId, Budget budget);
    Task DeleteAsync(Guid id, Guid userId);
}
