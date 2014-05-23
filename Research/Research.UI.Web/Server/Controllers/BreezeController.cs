
namespace Research.UI.Web.Server.Controllers
{
    using Breeze.ContextProvider;
    using Breeze.ContextProvider.EF6;
    using Breeze.WebApi2;
    using Newtonsoft.Json.Linq;
    using Research.UI.Web.Server.Model;
    using System.Linq;
    using System.Web.Http;

    [BreezeController]
    public class BreezeController : ApiController
    {
        private readonly EFContextProvider<ResearchDbContext> _contextProvider;
        private static string _customMetaData;
       
        public BreezeController(): this(null, null)
        {
        }

        public BreezeController(EFContextProvider<ResearchDbContext> contextProvider, string customMetaData)
        {
            _contextProvider = contextProvider ??  new EFContextProvider<ResearchDbContext>();

            if (!string.IsNullOrWhiteSpace(customMetaData))
            {
                _customMetaData = customMetaData;
            }
        }

        [HttpGet]
        public string CustomMetaData()
        {
            if (string.IsNullOrWhiteSpace(_customMetaData))
            {

            }
            return _customMetaData;
        }

        [HttpGet]
        public string Metadata()
        {
            string result = _contextProvider.Metadata();
            return result;
        }

        [HttpGet]
        public IQueryable<Employee> Employees()
        {
            return _contextProvider.Context.Employees;
        }

        [HttpGet]
        public IQueryable<Declaration> Declarations()
        {
            return _contextProvider.Context.Declarations;
        }

        [HttpGet]
        public IQueryable<Setting> Settings()
        {
            return _contextProvider.Context.Settings;
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _contextProvider.SaveChanges(saveBundle);
        }
    }
}
