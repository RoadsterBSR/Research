
namespace Research.UI.Web.Server.Model
{
    using System.Collections.Generic;
    using System.Data.Entity;

    public class ResearchDbContext : DbContext
    {
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Declaration> Declarations { get; set; }
        public DbSet<Setting> Settings { get; set; }
    }    
}