
namespace Research.UI.Web.Server.Controllers
{
    using Research.UI.Web.Server.Model;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Core.Metadata.Edm;
    using System.Data.Entity.Core.Objects;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    public class WebApiController : ApiController
    {
        private readonly ResearchDbContext _dbContext;

        public WebApiController() : this(null)
        {
        }

        public WebApiController(ResearchDbContext dbContext)
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

            ObjectContext objContext = ((IObjectContextAdapter)_dbContext).ObjectContext;
            MetadataWorkspace workspace = objContext.MetadataWorkspace;
            var allItems = workspace.GetItems(DataSpace.SSpace);
            IEnumerable<EntityType> cspaceInfo = workspace.GetItems<EntityType>(DataSpace.CSpace);
            IEnumerable<EntityType> csspaceInfo = workspace.GetItems<EntityType>(DataSpace.CSSpace);
            IEnumerable<EntityType> ocpaceInfo = workspace.GetItems<EntityType>(DataSpace.OCSpace);
            IEnumerable<EntityType> ospaceInfo = workspace.GetItems<EntityType>(DataSpace.OSpace);
            IEnumerable<EntityType> sspaceInfo = workspace.GetItems<EntityType>(DataSpace.SSpace);

            return _dbContext.Settings;
        }
    }
}
