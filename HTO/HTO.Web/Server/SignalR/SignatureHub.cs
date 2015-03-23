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
        /// Sends a chat message.
        /// Based on the "To" fiel in the message, the message will be sent to the desktop or mobile.
        /// </summary>
        public void SendChatMessage(ChatMessage message)
        {
            if (message != null && !string.IsNullOrWhiteSpace(message.UserName))
            {
                string connectionId = null;
                switch (message.To)
                {
                    case Enums.ApplicationTypes.Destkop:
                        if (_desktopConnections.ContainsKey(message.UserName))
                        {
                            connectionId = _desktopConnections[message.UserName];
                            Clients.Client(connectionId).ShowChatMessage(message);
                        }
                        break;
                    case Enums.ApplicationTypes.Mobile:
                        if (_mobileConnections.ContainsKey(message.UserName))
                        {
                            connectionId = _mobileConnections[message.UserName];
                            Clients.Client(connectionId).ShowChatMessage(message);
                        }
                        break;
                }
            }
        }


        /// <summary>
        /// When the desktop connection for this user exists, send the message to the desktop application.
        /// </summary>
        public void SendToDesktop(MobileMessage message)
        {
			if (message != null && !string.IsNullOrWhiteSpace(message.UserName))
			{
				if (_desktopConnections.ContainsKey(message.UserName))
				{
					var connectionId = _desktopConnections[message.UserName];
					Clients.Client(connectionId).ShowMessageOnDekstop(message);
				}
			}
		}

		/// <summary>
		/// When the mobile connection for this user exists, send the message to the mobile application.
		/// </summary>
		public void SendToMobile(DesktopMessage message)
		{
			if (message != null && !string.IsNullOrWhiteSpace(message.UserName))
			{
				if (_mobileConnections.ContainsKey(message.UserName))
				{
					var connectionId = _mobileConnections[message.UserName];
					Clients.Client(connectionId).ShowMessageOnMobile(message);
				}
			}
		}
	}
}
