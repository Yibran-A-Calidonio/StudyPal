using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using StudyPalAPI.Data;
using StudyPalAPI.Models;
using StudyPalAPI.Models.DTOs;
using StudyPalAPI.Services;
using StudyPalAPI.Hubs;
using System.Threading.Tasks;

namespace StudyPalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudyBuddyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly LeaderboardService _leaderboardService;
        private readonly IHubContext<LeaderboardHub> _leaderboardHubContext;
        public StudyBuddyController(ApplicationDbContext context, LeaderboardService leaderboardService, IHubContext<LeaderboardHub> leaderboardHubContext)
        {
            _context = context;
            _leaderboardService = leaderboardService; // Inject LeaderboardService
            _leaderboardHubContext = leaderboardHubContext;
        }

        [HttpPost("log-session")]
        public async Task<IActionResult> LogSession([FromBody] LogSessionDto dto)
        {
            if (dto == null || dto.DurationMinutes <= 0)
            {
                return BadRequest("Invalid session data.");
            }

            // Fetch user details
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var today = DateTime.UtcNow.Date;
            var yesterday = today.AddDays(-1);

            // ✅ Check if they already checked in today (skip streak logic if true)
            if (!user.CheckedIn)
            {
                if (user.LastStudyDate.HasValue && user.LastStudyDate.Value.Date == yesterday)
                {
                    user.Streak += 1;  // ✅ Continue streak if they studied yesterday
                }
                else if (user.LastStudyDate.HasValue && user.LastStudyDate.Value.Date < yesterday)
                {
                    user.Streak = 1;  // ✅ Reset streak if they missed a day
                }
                else if (!user.LastStudyDate.HasValue)
                {
                    user.Streak = 1; // ✅ First-time user streak start
                }

                // ✅ Mark today as last study date and set CheckedIn to true
                user.LastStudyDate = today;
                user.CheckedIn = true;
            }

            // Find an existing session for today, or create a new one
            var session = await _context.StudySessions
                .FirstOrDefaultAsync(s => s.UserId == dto.UserId && s.SessionDate.Date == today);

            if (session != null)
            {
                session.DurationMinutes += dto.DurationMinutes; // ✅ Update total logged time
            }
            else
            {
                session = new StudySession
                {
                    UserId = dto.UserId,
                    DurationMinutes = dto.DurationMinutes,
                    SessionDate = today
                };
                _context.StudySessions.Add(session);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Session logged successfully.", streak = user.Streak });
        }
        [HttpPost("start-session/{userId}")]
        public async Task<IActionResult> StartSession(int userId)
        {
            _leaderboardService.StartSession(userId);
            await _leaderboardService.BroadcastLeaderboard(); // ✅ Use BroadcastLeaderboard()
            return Ok(new { message = "Session started." });
        }
        [HttpPost("pause-session/{userId}")]
        public async Task<IActionResult> PauseSession(int userId)
        {
            _leaderboardService.PauseSession(userId);
            await _leaderboardHubContext.Clients.All.SendAsync("ReceiveLeaderboard", _leaderboardService.GetLeaderboard());
            return Ok(new { message = "Session paused." });
        }
        [HttpPost("end-session/{userId}")]
        public async Task<IActionResult> EndSession(int userId)
        {
            _leaderboardService.EndSession(userId);
            await _leaderboardService.BroadcastLeaderboard(); // ✅ Use BroadcastLeaderboard()
            return Ok(new { message = "Session ended." });
        }
        [HttpGet("get-study-time/{userId}")]
        public IActionResult GetStudyTime(int userId)
        {
            double elapsedMinutes = _leaderboardService.GetUserStudyTime(userId);
            return Ok(new { elapsedMinutes });
        }
        [HttpGet("random-quotes/{count}")]
        public async Task<IActionResult> GetRandomQuotes(int count = 5)
        {
            var randomQuotes = await _context.Quotes
                .OrderBy(q => Guid.NewGuid()) // Random order
                .Take(count) // Get specified number of quotes
                .ToListAsync();

            return Ok(randomQuotes);
        }
        [HttpGet("user-study-stats/{userId}")]
        public async Task<IActionResult> GetUserStudyStats(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // ✅ Compute total study time
            int totalStudyTime = await _context.StudySessions
                .Where(s => s.UserId == userId)
                .SumAsync(s => s.DurationMinutes);

            return Ok(new
            {
                totalStudyTime,
                streak = user.Streak
            });
        }
        [HttpGet("study-goals/{userId}")]
        public async Task<IActionResult> GetStudyGoals(int userId)
        {
            var goals = await _context.StudyGoals
                .Where(g => g.UserId == userId)
                .ToListAsync();

            return Ok(goals);
        }
        [HttpPost("add-study-goal")]
        public async Task<IActionResult> AddStudyGoal([FromBody] StudyGoal newGoal)
        {
            if (string.IsNullOrWhiteSpace(newGoal.GoalName))
            {
                return BadRequest("Goal name cannot be empty.");
            }

            _context.StudyGoals.Add(newGoal);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Study goal added successfully." });
        }

        [HttpDelete("delete-study-goal/{goalId}")]
        public async Task<IActionResult> DeleteStudyGoal(int goalId)
        {
            var goal = await _context.StudyGoals.FindAsync(goalId);
            if (goal == null)
            {
                return NotFound("Goal not found.");
            }

            _context.StudyGoals.Remove(goal);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Study goal deleted successfully." });
        }






    }
}
