
namespace Research.UI.Web.Validation.Rules
{
    using Research.UI.Web.Server.Model;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    
    public class DeclarationValidator : System.Attribute, IEntityRule
    {
        public int MaxDeclarationTotal { get; set; }

        public async Task<bool> IsValid(DbEntityEntry entityEntry, DbContext dbContext)
        {
            bool result = true;

            if (ValidParameters(entityEntry, dbContext))
            {
                Declaration declaration = entityEntry.Entity as Declaration;

                List<Declaration> declarations = await ((ResearchDbContext)dbContext).Declarations
                    .Where(d => d.EmployeeId.Equals(declaration.EmployeeId))
                    .ToListAsync();

                decimal total = declarations.Sum(d => d.ValueIncludingTax);

                if (total > MaxDeclarationTotal)
                {
                    result = false;
                }
            }

            return result;
        }

        public bool ValidParameters(DbEntityEntry entityEntry, DbContext dbContext)
        {
            return (dbContext != null && dbContext is ResearchDbContext && entityEntry != null && entityEntry.Entity != null && entityEntry.Entity is Declaration);
        }
    }
}
