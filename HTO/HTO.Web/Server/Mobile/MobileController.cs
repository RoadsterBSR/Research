using System.Web.Http;

namespace HTO.Web.Server.Desktop
{
    public class MobileController : ApiController
    {
        /// <summary>
        /// We only use POST ajax calls for security reasons.
        /// 
        /// Route: Mobile/Desktop/GetData
        /// </summary>
        /// <param name="value"></param>
        [Route("Servier/Mobile/GetData")]
        [HttpPost]
        public void Post(string value)
        {
        }
    }
}