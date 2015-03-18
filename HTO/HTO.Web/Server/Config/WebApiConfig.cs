using System.Web.Http;

namespace HTO.Web.Server.Config
{
    public static class WebApiConfig
    {
        public static HttpConfiguration Register()
        {
            HttpConfiguration config = new HttpConfiguration();
            config.MapHttpAttributeRoutes();

            return config;
        }
    }
}