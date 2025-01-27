namespace StudyPalAPI.Models.DTOs
{
    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
    }
}
