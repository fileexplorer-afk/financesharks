using System.ComponentModel.DataAnnotations;

namespace Financesharks.Api.DTOs.Auth;

public class RegisterRequest
{
    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Name is required.")]
    [MinLength(2, ErrorMessage = "Name must be at least 2 characters.")]
    [MaxLength(100)]
    [RegularExpression(@"^[a-zA-Z\s\-']+$", ErrorMessage = "Name contains invalid characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
    [MaxLength(128, ErrorMessage = "Password must be at most 128 characters.")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,128}$",
        ErrorMessage = "Password must contain uppercase, lowercase, number, and special character.")]
    public string Password { get; set; } = string.Empty;
}
