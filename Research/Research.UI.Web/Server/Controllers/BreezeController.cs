
namespace Research.UI.Web.Server.Controllers
{
    using Breeze.ContextProvider;
    using Breeze.ContextProvider.EF6;
    using Breeze.WebApi2;
    using Newtonsoft.Json.Linq;
    using Research.UI.Web.Server.Components;
    using Research.UI.Web.Server.Model;
    using System.Linq;
    using System.Web.Http;

    [BreezeController]
    public class BreezeController : ApiController
    {
        private readonly EFContextProvider<ResearchDbContext> _contextProvider;
        private static string _customMetaData;
        private readonly ICustomMetaDataBuilder _customMetaDataBuilder;

        public BreezeController(): this(null, null, null)
        {
        }

        public BreezeController(EFContextProvider<ResearchDbContext> contextProvider, string customMetaData, ICustomMetaDataBuilder customMetaDataBuilder)
        {
            _contextProvider = contextProvider ??  new EFContextProvider<ResearchDbContext>();

            if (!string.IsNullOrWhiteSpace(customMetaData))
            {
                _customMetaData = customMetaData;
            }

            _customMetaDataBuilder = customMetaDataBuilder ?? new CustomMetaDataBuilder();
        }

        [HttpGet]
        public void ResetCustomMetaData()
        {
            _customMetaData = _customMetaDataBuilder.GetCustomMetaData(new ResearchDbContext());
        }

        [HttpGet]
        public string CustomMetaData()
        {
            if (string.IsNullOrWhiteSpace(_customMetaData))
            {
                _customMetaData = _customMetaDataBuilder.GetCustomMetaData(new ResearchDbContext());
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
        public IQueryable<Employee> Employee()
        {
            return _contextProvider.Context.Employees;
        }

        [HttpGet]
        public IQueryable<Declaration> Declaration()
        {
            return _contextProvider.Context.Declarations;
        }

        [HttpGet]
        public IQueryable<Setting> Setting()
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
