using Financesharks.Api.DTOs.Dashboard;

namespace Financesharks.Api.Services;

public interface IDashboardService
{
    Task<DashboardSummaryResponse> GetSummaryAsync(Guid userId);
}
