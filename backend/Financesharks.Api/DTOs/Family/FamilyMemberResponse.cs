namespace Financesharks.Api.DTOs.Family;

public class FamilyMemberResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class InviteMemberRequest
{
    public string Email { get; set; } = string.Empty;
}

public class UpdateMemberRoleRequest
{
    public string Role { get; set; } = string.Empty;
}
