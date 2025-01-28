using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace StudyPalAPI.Services
{
    public class LeaderboardService
    {
        // Track active study sessions: UserId -> SessionStartTime
        private readonly ConcurrentDictionary<int, DateTime> _activeSessions = new();

        // Start a session for a user
        public void StartSession(int userId)
        {
            _activeSessions[userId] = DateTime.UtcNow; // Record the session start time
        }

        // End a session for a user
        public void EndSession(int userId)
        {
            _activeSessions.TryRemove(userId, out _); // Remove the user from active sessions
        }

        // Get current leaderboard with elapsed time for active sessions
        public List<object> GetLeaderboard()
        {
            return _activeSessions
                .Select(session => new
                {
                    UserId = session.Key,
                    ElapsedMinutes = (DateTime.UtcNow - session.Value).TotalMinutes // Calculate current study time
                })
                .OrderByDescending(entry => entry.ElapsedMinutes) // Sort by elapsed time (descending)
                .Cast<object>()
                .ToList();
        }
    }
}
