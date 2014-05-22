
namespace Research.UI.Web.Server.Controllers
{
    using Breeze.ContextProvider;
    using Breeze.ContextProvider.EF6;
    using Breeze.WebApi2;
    using Newtonsoft.Json.Linq;
    using Research.UI.Web.Server.Model;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    [BreezeController]
    public class ModelController : ApiController
    {
        private readonly EFContextProvider<ResearchDbContext> _contextProvider = new EFContextProvider<ResearchDbContext>();

        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        [HttpGet]
        public IQueryable<Employee> Employees()
        {
            return _contextProvider.Context.Employees;
        }

        [HttpGet]
        public IQueryable<Product> Products()
        {
            return _contextProvider.Context.Products;
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
