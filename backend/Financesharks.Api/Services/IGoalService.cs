using Financesharks.Api.DTOs.Goals;

namespace Financesharks.Api.Services;

public interface IGoalService
{
    Task<List<GoalResponse>> GetAllAsync(Guid userId);
    Task<GoalResponse> GetByIdAsync(Guid id, Guid userId);
    Task<GoalResponse> CreateAsync(Guid userId, CreateGoalRequest request);
    Task<GoalResponse> UpdateAsync(Guid id, Guid userId, UpdateGoalRequest request);
    Task DeleteAsync(Guid id, Guid userId);
    Task<GoalResponse> ContributeAsync(Guid id, Guid userId, ContributeRequest request);
}
