using Microsoft.EntityFrameworkCore;
using Financesharks.Api.Data;
using Financesharks.Api.DTOs.Accounts;
using Financesharks.Api.Models;

namespace Financesharks.Api.Services;

public class AccountService : IAccountService
{
    private readonly AppDbContext _db;

    public AccountService(AppDbContext db) => _db = db;

    public async Task<List<AccountResponse>> GetAllAsync(Guid userId)
    {
        return await _db.Accounts
            .Where(a => a.UserId == userId)
            .Select(a => new AccountResponse
            {
                Id = a.Id,
                Name = a.Name,
                Type = a.Type,
                Balance = a.Balance,
                Currency = a.Currency,
                CreatedAt = a.CreatedAt,
                TransactionCount = a.Transactions.Count,
            })
            .ToListAsync();
    }

    public async Task<AccountResponse> GetByIdAsync(Guid id, Guid userId)
    {
        var account = await _db.Accounts
            .Include(a => a.Transactions)
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId)
            ?? throw new KeyNotFoundException("Account not found.");

        return new AccountResponse
        {
            Id = account.Id,
            Name = account.Name,
            Type = account.Type,
            Balance = account.Balance,
            Currency = account.Currency,
            CreatedAt = account.CreatedAt,
            TransactionCount = account.Transactions.Count,
        };
    }

    public async Task<AccountResponse> CreateAsync(Guid userId, CreateAccountRequest request)
    {
        var account = new Account
        {
            UserId = userId,
            Name = request.Name,
            Type = request.Type,
            Balance = request.Balance,
            Currency = request.Currency,
        };

        _db.Accounts.Add(account);
        await _db.SaveChangesAsync();

        return new AccountResponse
        {
            Id = account.Id,
            Name = account.Name,
            Type = account.Type,
            Balance = account.Balance,
            Currency = account.Currency,
            CreatedAt = account.CreatedAt,
        };
    }

    public async Task<AccountResponse> UpdateAsync(Guid id, Guid userId, UpdateAccountRequest request)
    {
        var account = await _db.Accounts
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId)
            ?? throw new KeyNotFoundException("Account not found.");

        account.Name = request.Name;
        account.Type = request.Type;
        account.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return new AccountResponse
        {
            Id = account.Id,
            Name = account.Name,
            Type = account.Type,
            Balance = account.Balance,
            Currency = account.Currency,
            CreatedAt = account.CreatedAt,
        };
    }

    public async Task DeleteAsync(Guid id, Guid userId)
    {
        var account = await _db.Accounts
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId)
            ?? throw new KeyNotFoundException("Account not found.");

        _db.Accounts.Remove(account);
        await _db.SaveChangesAsync();
    }
}
