using System.Web.Http;

namespace HTO.Web.Server.Desktop
{
    public class StubController : ApiController
    {
        /// <summary>
        /// We only use POST ajax calls for security reasons.
        /// 
        /// Route: Server/Stub/HandleRequest
        /// </summary>
        /// <param name="value"></param>
        [Route("Server/Stub/HandleRequest")]
        [HttpPost]
        public void Post(string value)
        {
        }
    }
}