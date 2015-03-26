using HTO.Web.Server.Enums;
using HTO.Web.Server.Models;
using log4net;
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
        /// When a user is not authorized, this exception will be thrown.
        /// </summary>
        private static ApplicationException _unauthorizedException = new ApplicationException("Unauthorized, see server side logging for more details.");
		/// <summary>
		/// Users are stored based on "UserName".
		/// </summary>
		private static Dictionary<string, User> _users = new Dictionary<string, User>();

        private readonly ILog _logger = null;

		public SignatureHub() : this(null)
		{
			
		}

        public SignatureHub(ILog logger)
        {
            _logger = logger ?? LogManager.GetLogger(typeof(SignatureHub));
            
            if (_users.Count == 0)
            {
                var user = new User
                {
                    // Wachtwoord is ook "admin".
                    Password = "ALrZWfTWjsnapwBigDAs6XiWLf3VW9g25liTVXTRYVjfP29zcMl7p1X4CMeqIftIxw==",
                    UserName = "admin"
                };
                _users.Add(user.UserName, user);
            }
        }


        /// <summary>
        /// Authenticates the user.
        /// When authentication succeeds, this connection is registered and an authorization token is returned.
        /// When authentication fails, null is returned.
        /// 
        /// Notes
        /// - Convert username to lowercase before checking.
        /// </summary>
        /// <param name="userName">When "userName" is not supplied, return null.</param>
        /// <param name="password">
        /// When "password" is supplied, the password is used to authenticate the user.
        /// When "password" is not supplied, return null.
        /// </param>
        /// <param name="token">When "token" is supplied and "password" is not supplied, the "token" is used to authenticate the user.</param>
        /// <param name="appType"></param>
        /// <returns>
        /// Acccess token, when authenticated.
        /// Null, when not authenticated.
        /// </returns>
        public string Authenticate(string userName, string password, string token, AppTypes appType)
		{
			if (string.IsNullOrWhiteSpace(userName))
			{
                _logger.Error("[userName] was null, empty or whitespace.");
                return null;
            }

			if (string.IsNullOrWhiteSpace(password) && string.IsNullOrWhiteSpace(token))
			{
                _logger.Error("Both [password] as [token] were null, empty or whitespace.");
                return null;
			}
			
			userName = userName.ToLower();
			if (!_users.ContainsKey(userName))
			{
                _logger.Error(string.Format("User [{0}] could not be found.", userName));
                return null;
			}

			User user = _users[userName];
			if (!string.IsNullOrWhiteSpace(password) && !Crypto.VerifyHashedPassword(user.Password, password))
			{
                _logger.Error(string.Format("Crypto.VerifyHashedPassword failed on current password [{0}] and supplied password [{1}]", user.Password, password));
                return null;
			}

			// TODO: generate real new token.
			token = user.Password + appType.ToString();

			var connection = new Connection
			{
				AppType = appType,
				Id = Context.ConnectionId,
				User = user
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
        /// Every public hub function should use this methode to authenticate the user.
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        private Connection Authenticate(string token)
        {
            if (!_connections.ContainsKey(token)) { throw _unauthorizedException; }

            Connection connection = _connections[token];
            return connection;
        }

        /// <summary>
        /// Sends a chat message.
        /// </summary>
        public void SendChat(ChatMessage message)
        {
            if (message == null) { throw new ArgumentNullException("message"); }
            Connection connection = Authenticate(message.Token);
            
			Connection toConnection = null;
            switch (message.AppType)
            {
                case Enums.AppTypes.Desktop:
					toConnection = _connections[connection.User.MobileConnectionId];
                    break;
                case Enums.AppTypes.Mobile:
					toConnection = _connections[connection.User.DesktopConnectionId];
					break;
            }

			Clients.Client(toConnection.Id).ShowChat(message);
        }
		
        /// <summary>
        /// Send a signature message from mobile to desktop.
        /// </summary>
        public void SendSignature(SignatureMessage message)
        {
            if (message == null) { throw new ArgumentNullException("message"); }
            Connection connection = Authenticate(message.Token);
            
			Connection toConnection = _connections[connection.User.DesktopConnectionId];
			Clients.Client(toConnection.Id).ShowSignature(message);
		}
	}
}
