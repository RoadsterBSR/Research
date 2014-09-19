
namespace Research.UI.Web.Server.Model
{
    using Research.UI.Web.Validation.EntityValidators;
    using Research.UI.Web.Validation.FieldValidators;
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [DeclarationValidator(MaxDeclarationTotal = 10000)]
    public class Declaration
    {
        [Key]
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        [StringLengthRange(Minimum = 1, Maximum = 30)]
        public string Description { get; set; }
        [Required]
        [Display(Name = "Value including tax")]
        public decimal ValueIncludingTax { get; set; }
        public DateTime DateTime { get; set; }
        public bool Approved { get; set; }

        [ForeignKey("EmployeeId")]
        public Employee Employee { get; set; }
    }
}