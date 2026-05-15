namespace Financesharks.Api.DTOs.Goals;

public class GoalResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal TargetAmount { get; set; }
    public decimal CurrentAmount { get; set; }
    public DateTime Deadline { get; set; }
    public string Priority { get; set; } = string.Empty;
    public string? Category { get; set; }
    public decimal MonthlyContribution { get; set; }
    public decimal ProgressPercent { get; set; }
    public int MonthsRemaining { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateGoalRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal TargetAmount { get; set; }
    public decimal CurrentAmount { get; set; }
    public DateTime Deadline { get; set; }
    public string Priority { get; set; } = "medium";
    public string? Category { get; set; }
    public decimal MonthlyContribution { get; set; }
}

public class UpdateGoalRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public decimal? TargetAmount { get; set; }
    public decimal? CurrentAmount { get; set; }
    public DateTime? Deadline { get; set; }
    public string? Priority { get; set; }
    public string? Category { get; set; }
    public decimal? MonthlyContribution { get; set; }
}

public class ContributeRequest
{
    public decimal Amount { get; set; }
}
