using HTO.Web.Server.Config;
using Microsoft.Owin;
using Owin;
using System;

namespace HTO.Web
{
	public class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			app.MapSignalR();
            app.
            app.UseWebApi(WebApiConfig.Register());
        }
	}
}
