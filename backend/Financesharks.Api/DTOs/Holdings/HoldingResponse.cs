namespace Financesharks.Api.DTOs.Holdings;

public class HoldingResponse
{
    public Guid Id { get; set; }
    public string Symbol { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal BuyPrice { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal CurrentValue { get; set; }
    public decimal InvestedValue { get; set; }
    public decimal GainLoss { get; set; }
    public decimal GainLossPercent { get; set; }
    public string? Sector { get; set; }
    public string Type { get; set; } = string.Empty;
}

public class CreateHoldingRequest
{
    public string Symbol { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal BuyPrice { get; set; }
    public decimal CurrentPrice { get; set; }
    public string? Sector { get; set; }
    public string Type { get; set; } = "stock";
}

public class UpdateHoldingRequest
{
    public decimal Quantity { get; set; }
    public decimal CurrentPrice { get; set; }
}

public class PortfolioSummaryResponse
{
    public decimal TotalValue { get; set; }
    public decimal TotalInvested { get; set; }
    public decimal TotalGainLoss { get; set; }
    public decimal TotalGainLossPercent { get; set; }
    public List<SectorAllocation> SectorAllocation { get; set; } = new();
    public List<HoldingResponse> Holdings { get; set; } = new();
}

public class SectorAllocation
{
    public string Sector { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public decimal Percent { get; set; }
}
