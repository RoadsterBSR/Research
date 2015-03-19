
namespace HTO.Web.Server.SignalR
{
	public interface IClient
	{
		void ShowMessageOnMobile(DesktopMessage message);
		void ShowMessageOnDekstop(MobileMessage message);
	}
}