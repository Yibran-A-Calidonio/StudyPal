namespace StudyPalAPI.Models
{
    public class LogSessionDto
    {
        public int UserId { get; set; }
        public int DurationMinutes { get; set; }
        public DateTime SessionDate { get; set; }
    }
}
