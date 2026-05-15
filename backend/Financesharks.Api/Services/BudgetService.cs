using Microsoft.EntityFrameworkCore;
using Financesharks.Api.Data;
using Financesharks.Api.Models;

namespace Financesharks.Api.Services;

public class BudgetService : IBudgetService
{
    private readonly AppDbContext _db;

    public BudgetService(AppDbContext db) => _db = db;

    public async Task<List<Budget>> GetAllAsync(Guid userId, int? month, int? year)
    {
        var query = _db.Budgets.Where(b => b.UserId == userId);

        if (month.HasValue) query = query.Where(b => b.Month == month.Value);
        if (year.HasValue) query = query.Where(b => b.Year == year.Value);

        return await query.ToListAsync();
    }

    public async Task<Budget> CreateAsync(Guid userId, Budget budget)
    {
        budget.UserId = userId;
        _db.Budgets.Add(budget);
        await _db.SaveChangesAsync();
        return budget;
    }

    public async Task<Budget> UpdateAsync(Guid id, Guid userId, Budget budget)
    {
        var existing = await _db.Budgets
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId)
            ?? throw new KeyNotFoundException("Budget not found.");

        existing.Category = budget.Category;
        existing.Amount = budget.Amount;
        existing.Spent = budget.Spent;
        existing.Month = budget.Month;
        existing.Year = budget.Year;
        existing.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return existing;
    }

    public async Task DeleteAsync(Guid id, Guid userId)
    {
        var budget = await _db.Budgets
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId)
            ?? throw new KeyNotFoundException("Budget not found.");

        _db.Budgets.Remove(budget);
        await _db.SaveChangesAsync();
    }
}
