using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace RockPaperScissors.Hubs
{
    public class GameHub : Hub
    {
        public async Task SendChosenShape(string user, string shape)
        {
            await Clients.All.SendAsync("ReceiveShape", user, shape);
        }
    }
}
