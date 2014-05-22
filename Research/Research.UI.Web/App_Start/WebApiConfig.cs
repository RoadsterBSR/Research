
namespace Research.UI.Web
{
    using System.Web.Http;

    public static class WebApiConfig
    {
        /// <summary>
        /// Register ASP .NET Web Api routs.
        /// </summary>
        public static void Register(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
