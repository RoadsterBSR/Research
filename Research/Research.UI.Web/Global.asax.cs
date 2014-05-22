
namespace Research.UI.Web
{
    using Research.UI.Web.Server.Model;
    using System.Data.Entity;
    using System.Web.Http;

    public class WebApiApplication : System.Web.HttpApplication
    {
        /// <summary>
        /// Fires when application is started
        /// </summary>
        protected void Application_Start()
        {
            // Configure the ASP .NET Web Api routes, found in [App_Start\WebApiConfig.cs].
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}