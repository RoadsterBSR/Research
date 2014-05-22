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
            // During development the database will automatically be updated, when de application starts.
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }

        /// <summary>
        /// This method will be called after migrating to the latest version.
        /// </summary>
        protected override void Seed(Research.UI.Web.Server.Model.ResearchDbContext context)
        {
            // Add some settings.  
            context.Settings.AddOrUpdate(
              s => s.Key,
                new Setting { Key = "MySetting1_Key", Value = "MySetting1_Value" },
                new Setting { Key = "MySetting2_Key", Value = "MySetting2_Value" }
            );
        }
    }
}
