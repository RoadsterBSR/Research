
namespace Research.UI.Web.Server.Model
{
    using System.Collections.Generic;
    using System.Data.Entity;

    public class ResearchDbContext : DbContext
    {
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Setting> Settings { get; set; }
    }    
}