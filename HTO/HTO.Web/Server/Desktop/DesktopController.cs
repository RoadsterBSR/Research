﻿using System.Web.Http;

namespace HTO.Web.Server.Desktop
{
    public class DesktopController : ApiController
    {
        /// <summary>
        /// We only use POST ajax calls for security reasons.
        /// 
        /// Route: Server/Desktop/GetData
        /// </summary>
        /// <param name="value"></param>
        [Route("Server/Desktop/GetData")]
        [HttpPost]
        public void Post(string value)
        {
        }
    }
}