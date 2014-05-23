
namespace Research.UI.Web.Server.Model
{
    using Research.UI.Web.Validation.Rules;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [DeclarationValidator(MaxDeclarationTotal = 10000)]
    public class Declaration
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public decimal ValueIncludingTax { get; set; }
        public int EmployeeId { get; set; }
    }
}