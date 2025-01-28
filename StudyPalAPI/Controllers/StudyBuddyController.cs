using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyPalAPI.Data;
using StudyPalAPI.Models;
using StudyPalAPI.Models.DTOs;
using StudyPalAPI.Services;

namespace StudyPalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudyBuddyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly LeaderboardService _leaderboardService;

        public StudyBuddyController(ApplicationDbContext context, LeaderboardService leaderboardService)
        {
            _context = context;
            _leaderboardService = leaderboardService; // Inject LeaderboardService
        }

        [HttpPost("log-session")]
        public async Task<IActionResult> LogSession([FromBody] LogSessionDto dto)
        {
            if (dto == null || dto.DurationMinutes <= 0)
            {
                return BadRequest("Invalid session data.");
            }

            // Create a new StudySession entity
            var session = new StudySession
            {
                UserId = dto.UserId,
                DurationMinutes = dto.DurationMinutes,
                SessionDate = dto.SessionDate
            };

            // Save the session to the database
            _context.StudySessions.Add(session);
            await _context.SaveChangesAsync();

            return Ok("Session logged successfully.");
        }

        [HttpGet("leaderboard")]
        public IActionResult GetLeaderboard()
        {
            var leaderboard = _leaderboardService.GetLeaderboard(); // Fetch real-time leaderboard
            return Ok(leaderboard);
        }
    }
}
