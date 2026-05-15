using Financesharks.Api.DTOs.Family;

namespace Financesharks.Api.Services;

public interface IFamilyService
{
    Task<List<FamilyMemberResponse>> GetMembersAsync(Guid userId);
    Task<FamilyMemberResponse> InviteMemberAsync(Guid userId, InviteMemberRequest request);
    Task RemoveMemberAsync(Guid memberId, Guid userId);
    Task<FamilyMemberResponse> UpdateMemberRoleAsync(Guid memberId, Guid userId, UpdateMemberRoleRequest request);
}
