namespace Financesharks.Api.DTOs.Profile;

public class ProfileResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Tier { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class UpdateProfileRequest
{
    public string? Name { get; set; }
    public string? Email { get; set; }
}

public class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
