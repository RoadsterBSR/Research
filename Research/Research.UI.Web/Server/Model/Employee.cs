
namespace Research.UI.Web.Server.Model
{
    using Research.UI.Web.Validation;
    using Research.UI.Web.Validation.FieldValidators;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class Employee
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLengthRange(Minimum = 1, Maximum = 20)]
        public string FirstName { get; set; }
        [Required]
        [StringLengthRange(Minimum = 1, Maximum = 30)]
        public string LastName { get; set; }
        [StringLength(maximumLength : 20, MinimumLength = 1)]
        public string PhoneNumber { get; set; }
    }
}