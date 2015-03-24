using HTO.Web.Server.Enums;
using HTO.Web.Server.Models;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;

namespace HTO.Web.Server.SignalR
{
    public class SignatureHub : Hub<IClient>
    {
		private static Dictionary<string, User> _users = new Dictionary<string, User>();

		public SignatureHub()
		{
			if (_users.Count == 0)
			{
				var user = new User
				{
					Token = "ALrZWfTWjsnapwBigDAs6XiWLf3VW9g25liTVXTRYVjfP29zcMl7p1X4CMeqIftIxw==",
					UserName = "admin"
				};
				_users.Add(user.UserName, user);
            }
		}

		/// <summary>
		/// Gets an authorization token and register the connection, when authentication succeeds.
		/// Convert username to lowercase before checking.
		/// 
		/// Notes
		/// - Throws an exception, when username is null, empty or contains only whitespaces.
		/// - Throws an exception, when password is null, empty or contains only whitespaces.
		/// </summary>
		/// <param name="userName"></param>
		/// <param name="password"></param>
		/// <param name="appType"></param>
		/// <returns>
		/// Acccess token, when authenticated.
		/// Null, when not authenticated.
		/// </returns>
		public string GetToken(string userName, string password, AppTypes appType)
		{
			if (string.IsNullOrWhiteSpace(userName))
			{
				throw new ApplicationException("UserName can't be null, empty or contain only whitespaces.");
			}

			if (string.IsNullOrWhiteSpace(password))
			{
				throw new ApplicationException("Password can't be null, empty or contain only whitespaces.");
			}
			
			userName = userName.ToLower();
			if (!_users.ContainsKey(userName))
			{
				return null;
			}

			User user = _users[userName];
			if (!Crypto.VerifyHashedPassword(user.Token, password))
			{
				return null;
			}

			switch (appType)
			{
				case AppTypes.Desktop:
					user.DesktopConnectionId = Context.ConnectionId;
					break;
				case AppTypes.Mobile:
					user.MobileConnectionId = Context.ConnectionId;
					break;
				default:
					throw new ApplicationException("Unknown apptype");
			}
            

			return user.Token;
		}

        /// <summary>
        /// Sends a chat message.
        /// Based on the "To" field in the message, the message will be sent to the desktop or mobile.
        /// </summary>
        public void SendChat(ChatMessage message)
        {
            if (message != null && !string.IsNullOrWhiteSpace(message.UserName) && _users.ContainsKey(message.UserName.ToLower()))
            {
				User user = _users[message.UserName.ToLower()];
                switch (message.To)
                {
                    case Enums.AppTypes.Desktop:
						Clients.Client(user.DesktopConnectionId).ShowChat(message);
                        break;
                    case Enums.AppTypes.Mobile:
						Clients.Client(user.MobileConnectionId).ShowChat(message);
						break;
                }
            }
        }
		
        /// <summary>
        /// Send a signature message from mobile to desktop.
        /// </summary>
        public void SendSignature(SignatureMessage message)
        {
			if (message != null && !string.IsNullOrWhiteSpace(message.UserName) && _users.ContainsKey(message.UserName.ToLower()))
			{
				User user = _users[message.UserName.ToLower()];
				Clients.Client(user.DesktopConnectionId).ShowSignature(message);
			}
		}
		
	}
}
