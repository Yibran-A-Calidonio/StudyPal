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

        // Track active sessions: UserId -> (StartTime, AccumulatedMinutes, IsPaused)
        private readonly ConcurrentDictionary<int, (DateTime StartTime, double AccumulatedMinutes, bool IsPaused)> _activeSessions = new();

        // Define time scale factor (how many times faster than real-time)
        private const double TimeScaleFactor = 10.0; // 6 seconds = 1 minute

        public LeaderboardService(IHubContext<LeaderboardHub> hubContext)
        {
            _hubContext = hubContext ?? throw new ArgumentNullException(nameof(hubContext));
        }

        // ✅ Start a session or resume it if paused
        public void StartSession(int userId)
        {
            if (_activeSessions.TryGetValue(userId, out var session) && session.IsPaused)
            {
                // Resume the session, keep accumulated time
                _activeSessions[userId] = (DateTime.UtcNow, session.AccumulatedMinutes, false);
                Console.WriteLine($"⏳ User {userId} resumed their study session.");
            }
            else
            {
                // Start a new session
                _activeSessions[userId] = (DateTime.UtcNow, 0, false);
                Console.WriteLine($"✅ User {userId} started a study session.");
            }
        }

        // ✅ Pause the session (saves elapsed time)
        public void PauseSession(int userId)
        {
            if (_activeSessions.TryGetValue(userId, out var session) && !session.IsPaused)
            {
                // Calculate elapsed time before pausing
                double elapsedMinutes = (DateTime.UtcNow - session.StartTime).TotalMinutes * TimeScaleFactor;
                _activeSessions[userId] = (session.StartTime, session.AccumulatedMinutes + elapsedMinutes, true);
                Console.WriteLine($"⏸️ User {userId} paused their session.");
            }
        }
        public double GetUserStudyTime(int userId)
        {
            if (_activeSessions.TryGetValue(userId, out var session))
            {
                return session.IsPaused
                    ? session.AccumulatedMinutes  // Return stored time if paused
                    : session.AccumulatedMinutes + (DateTime.UtcNow - session.StartTime).TotalMinutes;
            }
            return 0;
        }

        // ✅ End a session (removes user from leaderboard)
        public void EndSession(int userId)
        {
            if (_activeSessions.TryRemove(userId, out _))
            {
                Console.WriteLine($"❌ User {userId} ended their study session.");
            }
        }

        // ✅ Get current leaderboard
        public List<object> GetLeaderboard()
        {
            var leaderboard = _activeSessions
                .Select(session => new
                {
                    UserId = session.Key,
                    // Apply time scale factor for faster updates
                    ElapsedMinutes = session.Value.IsPaused
                        ? session.Value.AccumulatedMinutes
                        : session.Value.AccumulatedMinutes + (DateTime.UtcNow - session.Value.StartTime).TotalMinutes * TimeScaleFactor
                })
                .OrderByDescending(entry => entry.ElapsedMinutes)
                .Cast<object>()
                .ToList();

            Console.WriteLine($"📊 Leaderboard Data Sent: {leaderboard.Count} users");
            return leaderboard;
        }

        // ✅ Broadcast the leaderboard update
        public async Task BroadcastLeaderboard()
        {
            var leaderboard = GetLeaderboard();
            Console.WriteLine($"📡 Sending leaderboard update: {leaderboard.Count} users");
            await _hubContext.Clients.All.SendAsync("ReceiveLeaderboard", leaderboard);
        }
    }
}
