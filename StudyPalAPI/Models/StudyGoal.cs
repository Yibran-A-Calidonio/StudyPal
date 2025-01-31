namespace StudyPalAPI.Models
{
    public class StudyGoal
    {
        public int Id { get; set; }
        public int UserId { get; set; } // Foreign key to User
        public string GoalName { get; set; } = null!; // Goal title
    }
}
