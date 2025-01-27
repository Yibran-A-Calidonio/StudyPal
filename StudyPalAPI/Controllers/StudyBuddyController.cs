using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyPalAPI.Data;
using StudyPalAPI.Models;
using StudyPalAPI.Models.DTOs;

namespace StudyPalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudyBuddyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudyBuddyController(ApplicationDbContext context)
        {
            _context = context;
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
        public async Task<IActionResult> GetLeaderboard()
        {
            var leaderboard = await _context.Users
                .OrderByDescending(u => _context.StudySessions.Where(s => s.UserId == u.Id).Sum(s => s.DurationMinutes))
                .Select(u => new
                {
                    u.Id,
                    u.DisplayName,
                    TotalStudyTime = _context.StudySessions.Where(s => s.UserId == u.Id).Sum(s => s.DurationMinutes)
                })
                .Take(10) // Limit to top 10 users
                .ToListAsync();

            return Ok(leaderboard);
        }


    }
}
