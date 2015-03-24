using HTO.Web.Server.Enums;

namespace HTO.Web.Server.Models
{
	public class SignatureMessage
	{
		public AppTypes From { get; set; }
		
		public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string LocationImageUrl { get; set; }
		public string Message { get; set; }
        public string SignatureImageDataUrl { get; set; }
		public AppTypes To { get; set; }
		public string Token { get; set; }
		public string UserName { get; set; }
	}
}
