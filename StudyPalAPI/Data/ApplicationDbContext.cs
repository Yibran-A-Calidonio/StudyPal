using Microsoft.EntityFrameworkCore;
using StudyPalAPI.Models;

namespace StudyPalAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Define tables for your models
        public DbSet<User> Users { get; set; }
        public DbSet<StudySession> StudySessions { get; set; }

    }
}
