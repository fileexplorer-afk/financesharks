using Microsoft.EntityFrameworkCore;
using Financesharks.Api.Data;
using Financesharks.Api.DTOs.Goals;
using Financesharks.Api.Models;

namespace Financesharks.Api.Services;

public class GoalService : IGoalService
{
    private readonly AppDbContext _db;

    public GoalService(AppDbContext db) => _db = db;

    public async Task<List<GoalResponse>> GetAllAsync(Guid userId)
    {
        return await _db.Goals
            .Where(g => g.UserId == userId)
            .OrderBy(g => g.Deadline)
            .Select(g => MapToResponse(g))
            .ToListAsync();
    }

    public async Task<GoalResponse> GetByIdAsync(Guid id, Guid userId)
    {
        var goal = await _db.Goals
            .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId)
            ?? throw new KeyNotFoundException("Goal not found.");

        return MapToResponse(goal);
    }

    public async Task<GoalResponse> CreateAsync(Guid userId, CreateGoalRequest request)
    {
        var goal = new Goal
        {
            UserId = userId,
            Title = request.Title,
            Description = request.Description,
            TargetAmount = request.TargetAmount,
            CurrentAmount = request.CurrentAmount,
            Deadline = request.Deadline,
            Priority = request.Priority,
            Category = request.Category,
            MonthlyContribution = request.MonthlyContribution,
        };

        _db.Goals.Add(goal);
        await _db.SaveChangesAsync();

        return MapToResponse(goal);
    }

    public async Task<GoalResponse> UpdateAsync(Guid id, Guid userId, UpdateGoalRequest request)
    {
        var goal = await _db.Goals
            .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId)
            ?? throw new KeyNotFoundException("Goal not found.");

        if (request.Title != null) goal.Title = request.Title;
        if (request.Description != null) goal.Description = request.Description;
        if (request.TargetAmount.HasValue) goal.TargetAmount = request.TargetAmount.Value;
        if (request.CurrentAmount.HasValue) goal.CurrentAmount = request.CurrentAmount.Value;
        if (request.Deadline.HasValue) goal.Deadline = request.Deadline.Value;
        if (request.Priority != null) goal.Priority = request.Priority;
        if (request.Category != null) goal.Category = request.Category;
        if (request.MonthlyContribution.HasValue) goal.MonthlyContribution = request.MonthlyContribution.Value;

        goal.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return MapToResponse(goal);
    }

    public async Task DeleteAsync(Guid id, Guid userId)
    {
        var goal = await _db.Goals
            .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId)
            ?? throw new KeyNotFoundException("Goal not found.");

        _db.Goals.Remove(goal);
        await _db.SaveChangesAsync();
    }

    public async Task<GoalResponse> ContributeAsync(Guid id, Guid userId, ContributeRequest request)
    {
        var goal = await _db.Goals
            .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId)
            ?? throw new KeyNotFoundException("Goal not found.");

        goal.CurrentAmount += request.Amount;
        goal.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return MapToResponse(goal);
    }

    private static GoalResponse MapToResponse(Goal goal)
    {
        var monthsRemaining = Math.Max(0, (goal.Deadline.Year - DateTime.UtcNow.Year) * 12
            + goal.Deadline.Month - DateTime.UtcNow.Month);
        var progress = goal.TargetAmount > 0
            ? Math.Round(goal.CurrentAmount / goal.TargetAmount * 100, 1)
            : 0;

        return new GoalResponse
        {
            Id = goal.Id,
            Title = goal.Title,
            Description = goal.Description,
            TargetAmount = goal.TargetAmount,
            CurrentAmount = goal.CurrentAmount,
            Deadline = goal.Deadline,
            Priority = goal.Priority,
            Category = goal.Category,
            MonthlyContribution = goal.MonthlyContribution,
            ProgressPercent = progress,
            MonthsRemaining = monthsRemaining,
            CreatedAt = goal.CreatedAt,
        };
    }
}
