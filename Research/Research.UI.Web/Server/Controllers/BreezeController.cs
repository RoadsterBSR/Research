
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
        public IQueryable<Declaration> Declaration()
        {
            return _contextProvider.Context.Declarations;
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
            // Remove all data from database.
            _contextProvider.Context.Database.ExecuteSqlCommand("truncate table Declarations");
            _contextProvider.Context.Database.ExecuteSqlCommand("delete from Employees; DBCC CHECKIDENT ('Employees', RESEED, 0)");
            _contextProvider.Context.Database.ExecuteSqlCommand("truncate table Settings");

            // Run an "Update-Database" EF migrations command, this will update the database schema to the latest state and run the Seed() method.
            var configuration = new Research.UI.Web.Migrations.Configuration();
            configuration.ContextType = typeof(ResearchDbContext);
            var migrator = new DbMigrator(configuration);
            migrator.Update();
        }        

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _contextProvider.SaveChanges(saveBundle);
        }

        [HttpGet]
        public IQueryable<Setting> Setting()
        {
            return _contextProvider.Context.Settings;
        }
    }
}
