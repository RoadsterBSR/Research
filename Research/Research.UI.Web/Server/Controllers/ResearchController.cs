
namespace Research.UI.Web.Server.Controllers
{
    using Research.UI.Web.Server.Model;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    public class ResearchController : ApiController
    {
        private readonly ResearchDbContext _dbContext;

        public ResearchController() : this(null)
        {
        }

        public ResearchController(ResearchDbContext dbContext)
        {
            _dbContext = dbContext ?? new ResearchDbContext();

            // Don't load navigation properties automatically.
            _dbContext.Configuration.ProxyCreationEnabled = false;

            // Because ProxyCreation is disabled, lazyloading is of no use, so we disable it.            
            _dbContext.Configuration.LazyLoadingEnabled = false;
        }

        [HttpGet]
        public IQueryable<Setting> Settings()
        {
            return _dbContext.Settings;
        }
    }
}
