
namespace HTO.Web.Server.SignalR
{
	public interface IClient
	{
        void ShowChatMessage(ChatMessage message);
        void ShowMessageOnMobile(DesktopMessage message);
		void ShowMessageOnDekstop(MobileMessage message);
	}
}