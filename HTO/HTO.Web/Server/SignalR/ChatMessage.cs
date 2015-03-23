using HTO.Web.Server.Enums;
using System;

namespace HTO.Web.Server.SignalR
{
    public class ChatMessage
    {
        public ApplicationTypes From { get; set; }
        public string Message { get; set; }
        public DateTime? ReceivedDateTime { get; set; }
        public DateTime SendDateTime { get; set; }
        public ApplicationTypes To { get; set; }
        public string UserName { get; set; }
    }
}
