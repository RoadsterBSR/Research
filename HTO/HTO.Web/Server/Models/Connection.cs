
using HTO.Web.Server.Enums;

namespace HTO.Web.Server.Models
{
	public class Connection
	{
		public AppTypes AppType { get; set; }

		/// <summary>
		/// De Signal-R connection id.
		/// </summary>
		public string Id { get; set; }

        public User User { get; set; }
    }
}
