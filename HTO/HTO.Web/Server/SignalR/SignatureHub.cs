using Microsoft.AspNet.SignalR;
using System.Collections.Generic;

namespace HTO.Web.Server.SignalR
{
    public class SignatureHub : Hub<IClient>
    {
        private static Dictionary<string, string> _connections = new Dictionary<string, string>();

        public void RegisterConnectionId(string userName)
        {
            if (_connections.ContainsKey(userName))
            {
                _connections[userName] = Context.ConnectionId;
            }
            else
            {
                var userConnectionInfo = new UserConnectionInfo
                {
                    DesktopConnectionId = null,
                    MobileConnectionId = null
                };
                _connections.Add(userName, Context.ConnectionId);
            }
        }

        public void Send(string message)
        {
            string userId = "1";
            Clients.User(userId).ShowMessage(message);
        }
    }

    public class UserConnectionInfo
    {
        public string MobileConnectionId { get; set; }
        public string DesktopConnectionId { get; set; }
    }

    public interface IClient
    {
        void ShowMessage(string message);
    }
}
