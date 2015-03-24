using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HTO.Web.Server.Models
{
	public class User
	{
		public string DesktopConnectionId { get; set; }
		public string MobileConnectionId { get; set; }
		public string Token { get; set; }
		public string UserName { get; set; }
	}
}
