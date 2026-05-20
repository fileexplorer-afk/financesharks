using Microsoft.EntityFrameworkCore;
using Financesharks.Api.Data;

namespace Financesharks.Api.Services;

public class AdminService : IAdminService
{
    private readonly AppDbContext _db;

    public AdminService(AppDbContext db) => _db = db;

    public async Task<List<AdminUserResponse>> GetAllUsersAsync()
    {
        return await _db.Users
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new AdminUserResponse
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Tier = u.Tier,
                Role = u.Role,
                AvatarUrl = u.AvatarUrl,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt,
            })
            .ToListAsync();
    }

    public async Task<AdminStatsResponse> GetStatsAsync()
    {
        var now = DateTime.UtcNow;
        var todayStart = now.Date;

        var totalUsers = await _db.Users.CountAsync();
        var totalAccounts = await _db.Accounts.CountAsync();
        var totalTransactions = await _db.Transactions.CountAsync();
        var totalGoals = await _db.Goals.CountAsync();
        var activeToday = await _db.Users.CountAsync(u => u.UpdatedAt >= todayStart);

        return new AdminStatsResponse
        {
            TotalUsers = totalUsers,
            TotalAccounts = totalAccounts,
            TotalTransactions = totalTransactions,
            TotalGoals = totalGoals,
            ActiveUsersToday = activeToday,
        };
    }

    public async Task<AdminUserResponse> UpdateUserRoleAsync(Guid userId, string newRole)
    {
        if (newRole != "admin" && newRole != "user")
            throw new InvalidOperationException("Role must be 'admin' or 'user'.");

        var user = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        user.Role = newRole;
        user.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return new AdminUserResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Tier = user.Tier,
            Role = user.Role,
            AvatarUrl = user.AvatarUrl,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
        };
    }

    public async Task DeleteUserAsync(Guid userId)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
    }
}
