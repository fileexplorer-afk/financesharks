using Financesharks.Api.DTOs.Profile;

namespace Financesharks.Api.Services;

public interface IProfileService
{
    Task<ProfileResponse> GetProfileAsync(Guid userId);
    Task<ProfileResponse> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
    Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request);
}
