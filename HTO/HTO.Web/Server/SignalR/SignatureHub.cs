using Microsoft.AspNet.SignalR;
using System.Collections.Generic;

namespace HTO.Web.Server.SignalR
{
    public class SignatureHub : Hub<IClient>
    {
		private static Dictionary<string, string> _desktopConnections = new Dictionary<string, string>();
		private static Dictionary<string, string> _mobileConnections = new Dictionary<string, string>();

		/// <summary>
		/// Register the current connection as the desktop connection for the given user.
		/// When "userName" is null or empty or only whitespace, ignore registration.
		/// </summary>
		/// <param name="userName"></param>
		public void RegisterDesktopConnectionId(string userName)
		{
			if (!string.IsNullOrWhiteSpace(userName))
			{
				if (_desktopConnections.ContainsKey(userName))
				{
					_desktopConnections[userName] = Context.ConnectionId;
				}
				else
				{
					_desktopConnections.Add(userName, Context.ConnectionId);
				}
			}
		}

		/// <summary>
		/// Register the current connection as the mobile connection for the given user.
		/// When "userName" is null or empty or only whitespace, ignore registration.
		/// </summary>
		/// <param name="userName"></param>
		public void RegisterMobileConnectionId(string userName)
        {
			if (!string.IsNullOrWhiteSpace(userName))
			{
				if (_mobileConnections.ContainsKey(userName))
				{
					_mobileConnections[userName] = Context.ConnectionId;
				}
				else
				{
					_mobileConnections.Add(userName, Context.ConnectionId);
				}
			}
        }
		
		/// <summary>
		/// When the desktop connection for this user exists, send the message to the desktop application.
		/// </summary>
        public void SendToDesktop(string message, string userName)
        {
			if (!string.IsNullOrWhiteSpace(userName))
			{
				if (_desktopConnections.ContainsKey(userName))
				{
					var connectionId = _desktopConnections[userName];
					Clients.Client(connectionId).ShowMessageOnDekstop(message);
				}
			}
		}

		/// <summary>
		/// When the mobile connection for this user exists, send the message to the mobile application.
		/// </summary>
		public void SendToMobile(string message, string userName)
		{
			if (!string.IsNullOrWhiteSpace(userName))
			{
				if (_mobileConnections.ContainsKey(userName))
				{
					var connectionId = _mobileConnections[userName];
					Clients.Client(connectionId).ShowMessageOnMobile(message);
				}
			}
		}
	}

    public class UserConnectionInfo
    {
        public string DesktopConnectionId { get; set; }
        public string MobileConnectionId { get; set; }
    }

    public interface IClient
    {
        void ShowMessageOnMobile(string message);
		void ShowMessageOnDekstop(string message);
	}
}
