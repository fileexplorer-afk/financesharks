using System.ComponentModel.DataAnnotations;

namespace Financesharks.Api.DTOs.Auth;

public class RefreshRequest
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
