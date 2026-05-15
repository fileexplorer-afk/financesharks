using Financesharks.Api.DTOs.Auth;

namespace Financesharks.Api.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken);
    Task LogoutAsync(string refreshToken);
    Task<UserResponse> GetUserByIdAsync(Guid userId);
}
