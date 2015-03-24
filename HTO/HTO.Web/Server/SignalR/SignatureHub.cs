using HTO.Web.Server.Enums;
using HTO.Web.Server.Models;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;

namespace HTO.Web.Server.SignalR
{
    public class SignatureHub : Hub<IClient>
    {
		/// <summary>
		/// Connections are stored based on a "token".
		/// </summary>
		private static Dictionary<string, Connection> _connections = new Dictionary<string, Connection>();
		/// <summary>
		/// Users are stored based on "UserName".
		/// </summary>
		private static Dictionary<string, User> _users = new Dictionary<string, User>();


		public SignatureHub()
		{
			if (_users.Count == 0)
			{
				var user = new User
				{
					Password = "ALrZWfTWjsnapwBigDAs6XiWLf3VW9g25liTVXTRYVjfP29zcMl7p1X4CMeqIftIxw==",
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
		/// <param name="password">When password is supplied, the password is used to authenticate the user.</param>
		/// <param name="token">When token is supplied and password is not supplied, the token is used to authenticate the user.</param>
		/// <param name="appType"></param>
		/// <returns>
		/// Acccess token, when authenticated.
		/// Null, when not authenticated.
		/// </returns>
		public string Authenticate(string userName, string password, string token, AppTypes appType)
		{
			if (string.IsNullOrWhiteSpace(userName))
			{
				throw new ApplicationException("UserName must be supplied.");
			}

			if (string.IsNullOrWhiteSpace(password) && string.IsNullOrWhiteSpace(token))
			{
				throw new ApplicationException("Password or token should be supplied.");
			}
			
			userName = userName.ToLower();
			if (!_users.ContainsKey(userName))
			{
				return null;
			}

			User user = _users[userName];
			if (!string.IsNullOrWhiteSpace(password) && !Crypto.VerifyHashedPassword(user.Password, password))
			{
				return null;
			}

			// TODO: generate real new token.
			token = user.Password + appType.ToString();

			var connection = new Connection
			{
				AppType = appType,
				Id = Context.ConnectionId,
				UserName = userName
			};

			if (!_connections.ContainsKey(token))
			{
				_connections.Add(token, connection);
			}

			switch (appType)
			{
				case AppTypes.Desktop:
					user.DesktopConnectionId = token;
					break;
				case AppTypes.Mobile:
					user.MobileConnectionId = token;
					break;
				default:
					throw new ApplicationException("Unknown apptype");
			}
            

			return token;
		}

        /// <summary>
        /// Sends a chat message.
        /// </summary>
        public void SendChat(ChatMessage message)
        {
            if (message != null && !string.IsNullOrWhiteSpace(message.Token) && _connections.ContainsKey(message.Token))
            {
				Connection fromConnection = _connections[message.Token];
				User user = _users[fromConnection.UserName.ToLower()];

				Connection toConnection = null;
                switch (message.AppType)
                {
                    case Enums.AppTypes.Desktop:
						toConnection = _connections[user.MobileConnectionId];
                        
                        break;
                    case Enums.AppTypes.Mobile:
						toConnection = _connections[user.DesktopConnectionId];
						break;
                }

				Clients.Client(toConnection.Id).ShowChat(message);
			}
        }
		
        /// <summary>
        /// Send a signature message from mobile to desktop.
        /// </summary>
        public void SendSignature(SignatureMessage message)
        {
			if (message != null && !string.IsNullOrWhiteSpace(message.Token) && _connections.ContainsKey(message.Token))
			{
				Connection fromConnection = _connections[message.Token];
				User user = _users[fromConnection.UserName.ToLower()];
				Connection toConnection = _connections[user.DesktopConnectionId];

				Clients.Client(toConnection.Id).ShowSignature(message);
			}
		}
		
	}
}
