namespace Research.UI.Web.Migrations
{
    using Research.UI.Web.Server.Model;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Research.UI.Web.Server.Model.ResearchDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(Research.UI.Web.Server.Model.ResearchDbContext context)
        {
            //  This method will be called after migrating to the latest version.
            //  You can use the DbSet<T>.AddOrUpdate() helper extension method to avoid creating duplicate seed data. E.g.
            context.Employees.AddOrUpdate(
              e => e.Id,
              new Employee { Id = 1, FirstName = "John", LastName = "Do", PhoneNumber = "00316548521564" },
              new Employee { Id = 2, FirstName = "Harry", LastName = "Stone", PhoneNumber = "00316548521564" },
              new Employee { Id = 3, FirstName = "Marc", LastName = "Polo", PhoneNumber = "00316548521564" },
              new Employee { Id = 4, FirstName = "Barbara", LastName = "Shine", PhoneNumber = "00316548521564" },
              new Employee { Id = 5, FirstName = "Kick", LastName = "Starter", PhoneNumber = "00316548521564" },
              new Employee { Id = 6, FirstName = "No", LastName = "Comment", PhoneNumber = "00316548521564" },
              new Employee { Id = 7, FirstName = "Be", LastName = "Aware", PhoneNumber = "00316548521564" }
            );

            context.Declarations.AddOrUpdate(
              d => d.Id,
              new Declaration { Id = 1, Approved = true, DateTime = new DateTime(2014, 5, 5, 10, 0, 0), Description = "Laptop", EmployeeId = 1, ValueIncludingTax = 2000 },
              new Declaration { Id = 2, Approved = false, DateTime = new DateTime(2014, 6, 25, 10, 0, 0), Description = "Phone", EmployeeId = 1, ValueIncludingTax = 700 },
              new Declaration { Id = 3, Approved = true, DateTime = new DateTime(2014, 6, 25, 10, 0, 0), Description = "Mouse", EmployeeId = 2, ValueIncludingTax = 30 }
            );


            context.Settings.AddOrUpdate(
              s => s.Id,
              new Setting { Id = 1, Key = "Research.Web.UI.RefreshRate", Value = "1000" }
            );
            
        }
    }
}
