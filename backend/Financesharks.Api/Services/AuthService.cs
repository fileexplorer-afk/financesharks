using Microsoft.EntityFrameworkCore;
using Financesharks.Api.Auth;
using Financesharks.Api.Data;
using Financesharks.Api.DTOs.Auth;
using Financesharks.Api.Models;

namespace Financesharks.Api.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IJwtTokenGenerator _jwt;
    private readonly IPasswordHasher _hasher;

    public AuthService(AppDbContext db, IJwtTokenGenerator jwt, IPasswordHasher hasher)
    {
        _db = db;
        _jwt = jwt;
        _hasher = hasher;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (await _db.Users.AnyAsync(u => u.Email == request.Email))
            throw new InvalidOperationException("Email is already registered.");

        var user = new User
        {
            Email = request.Email,
            Name = request.Name,
            PasswordHash = _hasher.Hash(request.Password),
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return await GenerateAuthResponseAsync(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        if (!_hasher.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        return await GenerateAuthResponseAsync(user);
    }

    public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
    {
        var storedToken = await _db.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken)
            ?? throw new UnauthorizedAccessException("Invalid refresh token.");

        if (!storedToken.IsActive)
            throw new UnauthorizedAccessException("Refresh token is expired or revoked.");

        storedToken.RevokedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return await GenerateAuthResponseAsync(storedToken.User);
    }

    public async Task LogoutAsync(string refreshToken)
    {
        var storedToken = await _db.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

        if (storedToken != null)
        {
            storedToken.RevokedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }

    public async Task<UserResponse> GetUserByIdAsync(Guid userId)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        return new UserResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Tier = user.Tier,
            AvatarUrl = user.AvatarUrl,
            CreatedAt = user.CreatedAt,
        };
    }

    private async Task<AuthResponse> GenerateAuthResponseAsync(User user)
    {
        var (accessToken, expiresAt) = _jwt.GenerateAccessToken(user.Id, user.Email, user.Name);
        var refreshTokenValue = _jwt.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
        };

        _db.RefreshTokens.Add(refreshToken);
        await _db.SaveChangesAsync();

        return new AuthResponse
        {
            UserId = user.Id,
            Name = user.Name,
            Email = user.Email,
            Tier = user.Tier,
            AvatarUrl = user.AvatarUrl,
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue,
            ExpiresAt = expiresAt,
        };
    }
}
