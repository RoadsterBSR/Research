
namespace Research.UI.Web.Server.Model
{
    using System.Data.Entity;

    public class ResearchDbContext : DbContext
    {
        public DbSet<Setting> Settings { get; set; } 
    }    
}