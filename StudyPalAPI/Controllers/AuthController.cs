using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyPalAPI.Data;
using StudyPalAPI.Models;
using StudyPalAPI.Models.DTOs;


namespace StudyPalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                return BadRequest("User already exists.");
            }

            // TODO: Hash the password before storing
            user.PasswordHash = user.PasswordHash; // Placeholder
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok("Registration successful.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            // Validate input
            if (string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.PasswordHash))
            {
                return BadRequest("Email and password are required.");
            }

            // Find the user by email
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginRequest.Email);
            if (existingUser == null || existingUser.PasswordHash != loginRequest.PasswordHash)
            {
                return Unauthorized("Invalid credentials.");
            }

            // Return the user details (or a token in production)
            return Ok(new
            {
                existingUser.Id,
                existingUser.DisplayName,
                existingUser.Email
            });
        }

    }
}
