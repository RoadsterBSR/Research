using HTO.Web.Server.Models;

namespace HTO.Web.Server.SignalR
{
	public interface IClient
	{
        void ShowChat(ChatMessage message);
		void ShowSignature(SignatureMessage message);
	}
}