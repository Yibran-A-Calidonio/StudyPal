namespace StudyPalAPI.Models
{
    public class StudySession
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;// Navigation property
        public int DurationMinutes { get; set; }
        public DateTime SessionDate { get; set; }
    }
}
