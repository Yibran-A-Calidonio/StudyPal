using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StudyPalAPI.Hubs;

namespace StudyPalAPI.Services
{
    public class LeaderboardService
    {
        private readonly IHubContext<LeaderboardHub> _hubContext;
        private readonly ConcurrentDictionary<int, DateTime> _activeSessions = new();

        public LeaderboardService(IHubContext<LeaderboardHub> hubContext)
        {
            _hubContext = hubContext ?? throw new ArgumentNullException(nameof(hubContext));
        }

        public void StartSession(int userId)
        {
            _activeSessions[userId] = DateTime.UtcNow;
            Console.WriteLine($"✅ User {userId} started a study session at {DateTime.UtcNow}");
        }

        public void EndSession(int userId)
        {
            if (_activeSessions.TryRemove(userId, out _))
            {
                Console.WriteLine($"❌ User {userId} ended their study session.");
            }
        }

        public List<object> GetLeaderboard()
        {
            var leaderboard = _activeSessions
                .Select(session => new
                {
                    UserId = session.Key,
                    ElapsedMinutes = (DateTime.UtcNow - session.Value).TotalMinutes
                })
                .OrderByDescending(entry => entry.ElapsedMinutes)
                .Cast<object>()
                .ToList();

            Console.WriteLine($"📊 Leaderboard Data Sent: {leaderboard.Count} users");
            return leaderboard;
        }

        public async Task BroadcastLeaderboard()
        {
            var leaderboard = GetLeaderboard();
            Console.WriteLine($"📡 Sending leaderboard update: {leaderboard.Count} users");

            await _hubContext.Clients.All.SendAsync("ReceiveLeaderboard", leaderboard);
        }
    }
}
