using System.ComponentModel.DataAnnotations;

namespace Financesharks.Api.DTOs.Accounts;

public class CreateAccountRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Type { get; set; } = string.Empty;

    public decimal Balance { get; set; }

    [MaxLength(3)]
    public string Currency { get; set; } = "INR";
}

public class UpdateAccountRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Type { get; set; } = string.Empty;
}
