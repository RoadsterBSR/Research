
namespace Research.UI.Web.Validation.EntityValidators
{
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Threading.Tasks;

    public interface IEntityValidator
    {
        Task<bool> IsValid(DbEntityEntry entityEntry, DbContext dbContext);
        bool ValidParameters(DbEntityEntry entityEntry, DbContext dbContext);
    }
}
