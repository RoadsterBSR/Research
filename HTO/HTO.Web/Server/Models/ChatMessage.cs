using HTO.Web.Server.Enums;
using System;

namespace HTO.Web.Server.Models
{
    public class ChatMessage
    {
        public AppTypes From { get; set; }
        public string Message { get; set; }
        public DateTime? ReceivedDateTime { get; set; }
        public DateTime SendDateTime { get; set; }
        public AppTypes To { get; set; }
        public string UserName { get; set; }
		public string Token { get; set; }
	}
}
