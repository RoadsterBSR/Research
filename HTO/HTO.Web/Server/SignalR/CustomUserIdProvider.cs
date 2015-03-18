using Microsoft.AspNet.SignalR;

namespace HTO.Web.Server.SignalR
{
    public class CustomUserIdProvider : IUserIdProvider
    {
        public string GetUserId(IRequest request)
        {
            // your logic to fetch a user identifier goes here.

            // for example:

            //var userId = MyCustomUserClass.FindUserId(request.User.Identity.Name);

            var userId = 1;
            return userId.ToString();
        }
    }
}
