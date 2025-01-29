using Microsoft.AspNetCore.SignalR;
using StudyPalAPI.Services;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace StudyPalAPI.Hubs
{
    public class LeaderboardHub : Hub
    {
        private readonly LeaderboardService _leaderboardService;
        private static Timer _timer;
        private static bool _isTimerRunning = false;
        private static int _activeConnections = 0;

        public LeaderboardHub(LeaderboardService leaderboardService)
        {
            _leaderboardService = leaderboardService ?? throw new ArgumentNullException(nameof(leaderboardService));
        }

        public override async Task OnConnectedAsync()
        {
            _activeConnections++;
            Console.WriteLine($"✅ User connected: {Context.ConnectionId} ({_activeConnections} total)");

            // Send the leaderboard immediately
            await _leaderboardService.BroadcastLeaderboard(); // ✅ Call service method instead of hub

            // Start periodic leaderboard updates
            if (!_isTimerRunning)
            {
                _isTimerRunning = true;
                _timer = new Timer(async _ =>
                {
                    if (_activeConnections > 0)
                    {
                        await _leaderboardService.BroadcastLeaderboard(); // ✅ Use service method
                    }
                }, null, 0, 5000);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _activeConnections = Math.Max(0, _activeConnections - 1);
            Console.WriteLine($"❌ User disconnected: {Context.ConnectionId} ({_activeConnections} remaining)");

            // Stop timer if no users are connected
            if (_activeConnections == 0)
            {
                _isTimerRunning = false;
                _timer?.Dispose();
                Console.WriteLine("🛑 No active users. Stopping leaderboard updates.");
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
