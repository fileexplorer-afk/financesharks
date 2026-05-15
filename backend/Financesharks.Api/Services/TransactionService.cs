using Microsoft.EntityFrameworkCore;
using Financesharks.Api.Data;
using Financesharks.Api.DTOs.Transactions;
using Financesharks.Api.Models;

namespace Financesharks.Api.Services;

public class TransactionService : ITransactionService
{
    private readonly AppDbContext _db;

    public TransactionService(AppDbContext db) => _db = db;

    public async Task<TransactionListResponse> GetAllAsync(Guid userId, TransactionFilterRequest filter)
    {
        var query = _db.Transactions
            .Include(t => t.Account)
            .Where(t => t.UserId == userId);

        if (filter.AccountId.HasValue)
            query = query.Where(t => t.AccountId == filter.AccountId);

        if (!string.IsNullOrEmpty(filter.Category))
            query = query.Where(t => t.Category == filter.Category);

        if (filter.From.HasValue)
            query = query.Where(t => t.Date >= filter.From.Value);

        if (filter.To.HasValue)
            query = query.Where(t => t.Date <= filter.To.Value);

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(t => t.Date)
            .Skip((filter.Page - 1) * filter.Limit)
            .Take(filter.Limit)
            .Select(t => new TransactionResponse
            {
                Id = t.Id,
                AccountId = t.AccountId,
                AccountName = t.Account != null ? t.Account.Name : null,
                Amount = t.Amount,
                Category = t.Category,
                Description = t.Description,
                Type = t.Type,
                Date = t.Date,
                CreatedAt = t.CreatedAt,
            })
            .ToListAsync();

        return new TransactionListResponse
        {
            Items = items,
            Total = total,
            Page = filter.Page,
            Limit = filter.Limit,
        };
    }

    public async Task<TransactionResponse> GetByIdAsync(Guid id, Guid userId)
    {
        var transaction = await _db.Transactions
            .Include(t => t.Account)
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId)
            ?? throw new KeyNotFoundException("Transaction not found.");

        return MapToResponse(transaction);
    }

    public async Task<TransactionResponse> CreateAsync(Guid userId, CreateTransactionRequest request)
    {
        var transaction = new Transaction
        {
            UserId = userId,
            AccountId = request.AccountId,
            Amount = request.Amount,
            Category = request.Category,
            Description = request.Description,
            Type = request.Type,
            Date = request.Date,
        };

        if (request.AccountId.HasValue)
        {
            var account = await _db.Accounts.FindAsync(request.AccountId.Value)
                ?? throw new KeyNotFoundException("Account not found.");

            if (request.Type == "credit")
                account.Balance += request.Amount;
            else
                account.Balance -= request.Amount;

            account.UpdatedAt = DateTime.UtcNow;
        }

        _db.Transactions.Add(transaction);
        await _db.SaveChangesAsync();

        await _db.Entry(transaction).Reference(t => t.Account).LoadAsync();
        return MapToResponse(transaction);
    }

    public async Task<TransactionResponse> UpdateAsync(Guid id, Guid userId, UpdateTransactionRequest request)
    {
        var transaction = await _db.Transactions
            .Include(t => t.Account)
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId)
            ?? throw new KeyNotFoundException("Transaction not found.");

        if (transaction.AccountId.HasValue)
        {
            var account = await _db.Accounts.FindAsync(transaction.AccountId.Value);
            if (account != null)
            {
                if (transaction.Type == "credit")
                    account.Balance -= transaction.Amount;
                else
                    account.Balance += transaction.Amount;
            }
        }

        transaction.AccountId = request.AccountId;
        transaction.Amount = request.Amount;
        transaction.Category = request.Category;
        transaction.Description = request.Description;
        transaction.Type = request.Type;
        transaction.Date = request.Date;

        if (request.AccountId.HasValue)
        {
            var account = await _db.Accounts.FindAsync(request.AccountId.Value);
            if (account != null)
            {
                if (request.Type == "credit")
                    account.Balance += request.Amount;
                else
                    account.Balance -= request.Amount;

                account.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _db.SaveChangesAsync();
        return MapToResponse(transaction);
    }

    public async Task DeleteAsync(Guid id, Guid userId)
    {
        var transaction = await _db.Transactions
            .Include(t => t.Account)
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId)
            ?? throw new KeyNotFoundException("Transaction not found.");

        if (transaction.AccountId.HasValue && transaction.Account != null)
        {
            if (transaction.Type == "credit")
                transaction.Account.Balance -= transaction.Amount;
            else
                transaction.Account.Balance += transaction.Amount;

            transaction.Account.UpdatedAt = DateTime.UtcNow;
        }

        _db.Transactions.Remove(transaction);
        await _db.SaveChangesAsync();
    }

    public async Task<Dictionary<string, decimal>> GetSummaryAsync(Guid userId, DateTime? from, DateTime? to)
    {
        var query = _db.Transactions.Where(t => t.UserId == userId && t.Type == "debit");

        if (from.HasValue) query = query.Where(t => t.Date >= from.Value);
        if (to.HasValue) query = query.Where(t => t.Date <= to.Value);

        return await query
            .GroupBy(t => t.Category)
            .Select(g => new { Category = g.Key, Total = g.Sum(t => t.Amount) })
            .ToDictionaryAsync(g => g.Category, g => g.Total);
    }

    private static TransactionResponse MapToResponse(Transaction transaction) => new()
    {
        Id = transaction.Id,
        AccountId = transaction.AccountId,
        AccountName = transaction.Account?.Name,
        Amount = transaction.Amount,
        Category = transaction.Category,
        Description = transaction.Description,
        Type = transaction.Type,
        Date = transaction.Date,
        CreatedAt = transaction.CreatedAt,
    };
}
