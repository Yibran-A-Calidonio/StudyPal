using Microsoft.AspNetCore.SignalR;
using StudyPalAPI.Services;

namespace StudyPalAPI.Hubs
{
    public class LeaderboardHub : Hub
    {
        private readonly LeaderboardService _leaderboardService;

        public LeaderboardHub(LeaderboardService leaderboardService)
        {
            _leaderboardService = leaderboardService;
        }

        public async Task SendRealTimeLeaderboard()
        {
            var leaderboard = _leaderboardService.GetLeaderboard(); // Get active users
            await Clients.All.SendAsync("ReceiveLeaderboard", leaderboard);
        }
    }
}
