
namespace Research.UI.Web.Server.Model
{
    using Research.UI.Web.Validation.FieldValidators;
    using Research.UI.Web.Validation.EntityValidators;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [DeclarationValidator(MaxDeclarationTotal = 10000)]
    public class Declaration
    {
        [Key]
        public int Id { get; set; }
        [StringLengthRange(Minimum = 1, Maximum = 30)]
        public string Description { get; set; }
        [Required]
        public decimal ValueIncludingTax { get; set; }
        public int EmployeeId { get; set; }
    }
}