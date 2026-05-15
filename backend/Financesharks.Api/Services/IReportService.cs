using Financesharks.Api.DTOs.Reports;

namespace Financesharks.Api.Services;

public interface IReportService
{
    Task<NetWorthResponse> GetNetWorthAsync(Guid userId);
    Task<List<SpendingByCategoryResponse>> GetSpendingByCategoryAsync(Guid userId, int? month, int? year);
    Task<List<IncomeVsExpenseResponse>> GetIncomeVsExpenseAsync(Guid userId, int year);
}
