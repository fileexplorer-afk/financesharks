using Financesharks.Api.DTOs.Holdings;

namespace Financesharks.Api.Services;

public interface IHoldingService
{
    Task<List<HoldingResponse>> GetAllAsync(Guid userId);
    Task<HoldingResponse> GetByIdAsync(Guid id, Guid userId);
    Task<HoldingResponse> CreateAsync(Guid userId, CreateHoldingRequest request);
    Task<HoldingResponse> UpdateAsync(Guid id, Guid userId, UpdateHoldingRequest request);
    Task DeleteAsync(Guid id, Guid userId);
    Task<PortfolioSummaryResponse> GetPortfolioSummaryAsync(Guid userId);
}
