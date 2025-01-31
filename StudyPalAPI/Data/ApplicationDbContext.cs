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
        public DbSet<Quote> Quotes { get; set; }

        public DbSet<StudyGoal> StudyGoals { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ✅ Tell EF Core to use the existing table without trying to create it
            modelBuilder.Entity<Quote>().ToTable("Quotes", t => t.ExcludeFromMigrations());
        }
    }
}
