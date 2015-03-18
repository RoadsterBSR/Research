using System.Web.Http;

namespace HTO.Web.Server.Desktop
{
    public class AuthenticationController : ApiController
    {
        /// <summary>
        /// We only use POST ajax calls for security reasons.
        /// 
        /// Route: Server/Desktop/GetData
        /// </summary>
        /// <param name="value"></param>
        [Route("Server/Authentication/Authenticate")]
        [HttpPost]
        public void Post(string value)
        {
        }
    }
}