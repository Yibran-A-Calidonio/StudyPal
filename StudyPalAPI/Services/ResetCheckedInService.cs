using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using StudyPalAPI.Data;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class ResetCheckedInService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public ResetCheckedInService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var now = DateTime.UtcNow;
            var nextReset = now.Date.AddDays(1); // Midnight next day
            var delay = nextReset - now;

            await Task.Delay(delay, stoppingToken); // Wait until midnight

            using (var scope = _serviceProvider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var users = dbContext.Users.ToList();

                foreach (var user in users)
                {
                    user.CheckedIn = false; // ✅ Reset CheckedIn for all users
                }

                await dbContext.SaveChangesAsync();
            }
        }
    }
}
