using Microsoft.EntityFrameworkCore;
using Financesharks.Api.Data;
using Financesharks.Api.DTOs.Family;
using Financesharks.Api.Models;

namespace Financesharks.Api.Services;

public class FamilyService : IFamilyService
{
    private readonly AppDbContext _db;

    public FamilyService(AppDbContext db) => _db = db;

    public async Task<List<FamilyMemberResponse>> GetMembersAsync(Guid userId)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        var householdId = await _db.FamilyMembers
            .Where(fm => fm.UserId == userId)
            .Select(fm => fm.HouseholdId)
            .FirstOrDefaultAsync();

        if (householdId == Guid.Empty)
            return new List<FamilyMemberResponse>();

        return await _db.FamilyMembers
            .Include(fm => fm.User)
            .Where(fm => fm.HouseholdId == householdId && fm.Status == "active")
            .Select(fm => new FamilyMemberResponse
            {
                Id = fm.Id,
                UserId = fm.UserId,
                Name = fm.User.Name,
                Email = fm.User.Email,
                AvatarUrl = fm.User.AvatarUrl,
                Role = fm.Role,
                Status = fm.Status,
                CreatedAt = fm.CreatedAt,
            })
            .ToListAsync();
    }

    public async Task<FamilyMemberResponse> InviteMemberAsync(Guid userId, InviteMemberRequest request)
    {
        var inviter = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        var invitedUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email)
            ?? throw new KeyNotFoundException("User with this email not found.");

        if (invitedUser.Id == userId)
            throw new InvalidOperationException("Cannot invite yourself.");

        var householdId = await _db.FamilyMembers
            .Where(fm => fm.UserId == userId)
            .Select(fm => fm.HouseholdId)
            .FirstOrDefaultAsync();

        if (householdId == Guid.Empty)
        {
            var household = new FamilyHousehold { Name = $"{inviter.Name}'s Family" };
            _db.FamilyHouseholds.Add(household);
            await _db.SaveChangesAsync();
            householdId = household.Id;

            _db.FamilyMembers.Add(new FamilyMember
            {
                HouseholdId = householdId,
                UserId = userId,
                Role = "owner",
                Status = "active",
            });
            await _db.SaveChangesAsync();
        }

        var existing = await _db.FamilyMembers
            .FirstOrDefaultAsync(fm => fm.HouseholdId == householdId && fm.UserId == invitedUser.Id);

        if (existing != null)
        {
            if (existing.Status == "active")
                throw new InvalidOperationException("User is already a member.");
            existing.Status = "active";
            existing.Role = "member";
        }
        else
        {
            var member = new FamilyMember
            {
                HouseholdId = householdId,
                UserId = invitedUser.Id,
                Role = "member",
                Status = "invited",
                InvitedBy = userId,
            };
            _db.FamilyMembers.Add(member);
        }

        await _db.SaveChangesAsync();

        return new FamilyMemberResponse
        {
            Id = existing?.Id ?? Guid.Empty,
            UserId = invitedUser.Id,
            Name = invitedUser.Name,
            Email = invitedUser.Email,
            AvatarUrl = invitedUser.AvatarUrl,
            Role = "member",
            Status = "invited",
        };
    }

    public async Task RemoveMemberAsync(Guid memberId, Guid userId)
    {
        var member = await _db.FamilyMembers
            .Include(fm => fm.Household)
            .FirstOrDefaultAsync(fm => fm.Id == memberId)
            ?? throw new KeyNotFoundException("Member not found.");

        var isOwner = await _db.FamilyMembers
            .AnyAsync(fm => fm.HouseholdId == member.HouseholdId && fm.UserId == userId && fm.Role == "owner");

        if (!isOwner)
            throw new UnauthorizedAccessException("Only the household owner can remove members.");

        _db.FamilyMembers.Remove(member);
        await _db.SaveChangesAsync();
    }

    public async Task<FamilyMemberResponse> UpdateMemberRoleAsync(Guid memberId, Guid userId, UpdateMemberRoleRequest request)
    {
        var isOwner = await _db.FamilyMembers
            .AnyAsync(fm => fm.UserId == userId && fm.Role == "owner");

        if (!isOwner)
            throw new UnauthorizedAccessException("Only the household owner can change roles.");

        var member = await _db.FamilyMembers
            .Include(fm => fm.User)
            .FirstOrDefaultAsync(fm => fm.Id == memberId)
            ?? throw new KeyNotFoundException("Member not found.");

        member.Role = request.Role;
        await _db.SaveChangesAsync();

        return new FamilyMemberResponse
        {
            Id = member.Id,
            UserId = member.UserId,
            Name = member.User.Name,
            Email = member.User.Email,
            AvatarUrl = member.User.AvatarUrl,
            Role = member.Role,
            Status = member.Status,
            CreatedAt = member.CreatedAt,
        };
    }
}
