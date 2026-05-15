using Microsoft.EntityFrameworkCore;
using Financesharks.Api.Auth;
using Financesharks.Api.Data;
using Financesharks.Api.DTOs.Profile;

namespace Financesharks.Api.Services;

public class ProfileService : IProfileService
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher _hasher;

    public ProfileService(AppDbContext db, IPasswordHasher hasher)
    {
        _db = db;
        _hasher = hasher;
    }

    public async Task<ProfileResponse> GetProfileAsync(Guid userId)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        return MapToResponse(user);
    }

    public async Task<ProfileResponse> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        if (!string.IsNullOrEmpty(request.Name))
            user.Name = request.Name;

        if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
        {
            if (await _db.Users.AnyAsync(u => u.Email == request.Email))
                throw new InvalidOperationException("Email is already in use.");
            user.Email = request.Email;
        }

        user.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return MapToResponse(user);
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        if (!_hasher.Verify(request.CurrentPassword, user.PasswordHash))
            throw new InvalidOperationException("Current password is incorrect.");

        user.PasswordHash = _hasher.Hash(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }

    private static ProfileResponse MapToResponse(Models.User user) => new()
    {
        Id = user.Id,
        Name = user.Name,
        Email = user.Email,
        AvatarUrl = user.AvatarUrl,
        Tier = user.Tier,
        CreatedAt = user.CreatedAt,
    };
}
