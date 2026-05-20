namespace Financesharks.Api.Services;

public class AdminUserResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Tier { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class AdminStatsResponse
{
    public int TotalUsers { get; set; }
    public int TotalAccounts { get; set; }
    public int TotalTransactions { get; set; }
    public int TotalGoals { get; set; }
    public int ActiveUsersToday { get; set; }
}

public class UpdateRoleRequest
{
    public string Role { get; set; } = string.Empty;
}

public interface IAdminService
{
    Task<List<AdminUserResponse>> GetAllUsersAsync();
    Task<AdminStatsResponse> GetStatsAsync();
    Task<AdminUserResponse> UpdateUserRoleAsync(Guid userId, string newRole);
    Task DeleteUserAsync(Guid userId);
}
