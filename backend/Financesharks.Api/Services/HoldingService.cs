using Microsoft.EntityFrameworkCore;
using Financesharks.Api.Data;
using Financesharks.Api.DTOs.Holdings;
using Financesharks.Api.Models;

namespace Financesharks.Api.Services;

public class HoldingService : IHoldingService
{
    private readonly AppDbContext _db;

    public HoldingService(AppDbContext db) => _db = db;

    public async Task<List<HoldingResponse>> GetAllAsync(Guid userId)
    {
        var holdings = await _db.Holdings
            .Where(h => h.UserId == userId)
            .ToListAsync();

        return holdings.Select(MapToResponse).ToList();
    }

    public async Task<HoldingResponse> GetByIdAsync(Guid id, Guid userId)
    {
        var holding = await _db.Holdings
            .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId)
            ?? throw new KeyNotFoundException("Holding not found.");

        return MapToResponse(holding);
    }

    public async Task<HoldingResponse> CreateAsync(Guid userId, CreateHoldingRequest request)
    {
        var holding = new Holding
        {
            UserId = userId,
            Symbol = request.Symbol,
            Name = request.Name,
            Quantity = request.Quantity,
            BuyPrice = request.BuyPrice,
            CurrentPrice = request.CurrentPrice,
            Sector = request.Sector,
            Type = request.Type,
        };

        _db.Holdings.Add(holding);
        await _db.SaveChangesAsync();

        return MapToResponse(holding);
    }

    public async Task<HoldingResponse> UpdateAsync(Guid id, Guid userId, UpdateHoldingRequest request)
    {
        var holding = await _db.Holdings
            .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId)
            ?? throw new KeyNotFoundException("Holding not found.");

        holding.Quantity = request.Quantity;
        holding.CurrentPrice = request.CurrentPrice;
        holding.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return MapToResponse(holding);
    }

    public async Task DeleteAsync(Guid id, Guid userId)
    {
        var holding = await _db.Holdings
            .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId)
            ?? throw new KeyNotFoundException("Holding not found.");

        _db.Holdings.Remove(holding);
        await _db.SaveChangesAsync();
    }

    public async Task<PortfolioSummaryResponse> GetPortfolioSummaryAsync(Guid userId)
    {
        var holdings = await _db.Holdings
            .Where(h => h.UserId == userId)
            .ToListAsync();

        var responses = holdings.Select(MapToResponse).ToList();

        var totalValue = responses.Sum(h => h.CurrentValue);
        var totalInvested = responses.Sum(h => h.InvestedValue);
        var totalGainLoss = responses.Sum(h => h.GainLoss);
        var totalGainLossPercent = totalInvested > 0
            ? Math.Round(totalGainLoss / totalInvested * 100, 1)
            : 0;

        var sectorAllocation = responses
            .GroupBy(h => h.Sector ?? "Other")
            .Select(g => new SectorAllocation
            {
                Sector = g.Key,
                Value = g.Sum(h => h.CurrentValue),
                Percent = totalValue > 0
                    ? Math.Round(g.Sum(h => h.CurrentValue) / totalValue * 100, 1)
                    : 0,
            })
            .ToList();

        return new PortfolioSummaryResponse
        {
            TotalValue = totalValue,
            TotalInvested = totalInvested,
            TotalGainLoss = totalGainLoss,
            TotalGainLossPercent = totalGainLossPercent,
            SectorAllocation = sectorAllocation,
            Holdings = responses,
        };
    }

    private static HoldingResponse MapToResponse(Holding h)
    {
        var currentValue = h.Quantity * h.CurrentPrice;
        var investedValue = h.Quantity * h.BuyPrice;
        var gainLoss = currentValue - investedValue;
        var gainLossPercent = investedValue > 0
            ? Math.Round(gainLoss / investedValue * 100, 1)
            : 0;

        return new HoldingResponse
        {
            Id = h.Id,
            Symbol = h.Symbol,
            Name = h.Name,
            Quantity = h.Quantity,
            BuyPrice = h.BuyPrice,
            CurrentPrice = h.CurrentPrice,
            CurrentValue = currentValue,
            InvestedValue = investedValue,
            GainLoss = gainLoss,
            GainLossPercent = gainLossPercent,
            Sector = h.Sector,
            Type = h.Type,
        };
    }
}
