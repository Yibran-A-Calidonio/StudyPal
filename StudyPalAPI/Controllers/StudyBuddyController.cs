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

            // Find an existing session for today, or create a new one
            var session = await _context.StudySessions
                .FirstOrDefaultAsync(s => s.UserId == dto.UserId && s.SessionDate.Date == dto.SessionDate.Date);

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
                    SessionDate = dto.SessionDate
                };
                _context.StudySessions.Add(session);
            }

            await _context.SaveChangesAsync();

            return Ok("Session logged successfully.");
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




    }
}
