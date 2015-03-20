using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HTO.Web.Server.SignalR
{
	public class MobileMessage
	{
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string LocationImageUrl { get; set; }
		public string Message { get; set; }
        public string SignatureImageDataUrl { get; set; }
		public string UserName { get; set; }
	}
}
