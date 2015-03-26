using HTO.Web.Server.SignalR;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(HTO.Web.Startup))]
[assembly: log4net.Config.XmlConfigurator(ConfigFile = "Web.config", Watch = true)]
namespace HTO.Web
{
    public class Startup
    {
        /// <summary>
        /// Initialize SignalR.
        /// Initialize Web API.
        /// </summary>
        /// <param name="app"></param>
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
            app.UseWebApi(HTO.Web.Server.Config.WebApiConfig.Register());
        }
    }
}