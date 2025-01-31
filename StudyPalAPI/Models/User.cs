namespace StudyPalAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!; // Store hashed passwords

        // ✅ Streak tracking
        public int Streak { get; set; } = 0;
        public DateTime? LastStudyDate { get; set; }
        public bool CheckedIn { get; set; } = false; // ✅ Prevent duplicate streak updates
    }
}
