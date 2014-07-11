
namespace Research.UI.Web.Server.Controllers
{
    using Breeze.ContextProvider;
    using Breeze.ContextProvider.EF6;
    using Breeze.WebApi2;
    using Newtonsoft.Json.Linq;
    using Research.UI.Web.Server.Model;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using System.Web.Http;

    [BreezeController]
    public class BreezeController : ApiController
    {
        private readonly EFContextProvider<ResearchDbContext> _contextProvider;

        public BreezeController(): this(null)
        {
        }

        public BreezeController(EFContextProvider<ResearchDbContext> contextProvider)
        {
            _contextProvider = contextProvider ??  new EFContextProvider<ResearchDbContext>();
        }

        [HttpGet]
        public IQueryable<Employee> Employee()
        {
            return _contextProvider.Context.Employees;
        }

        [HttpGet]
        public string Metadata()
        {
            string result = _contextProvider.Metadata();
            return result;
        }
                        
        [HttpGet]
        public void ReSeed()
        {
            var configuration = new Research.UI.Web.Migrations.Configuration();
            configuration.ContextType = typeof(ResearchDbContext);
            var migrator = new DbMigrator(configuration);

            // This will run the migration update script and will run the migrations Seed() method.
            migrator.Update();
        }        

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _contextProvider.SaveChanges(saveBundle);
        }
    }
}
