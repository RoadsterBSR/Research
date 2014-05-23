
namespace Research.UI.Web.Server.Model
{
    using Research.UI.Web.Validation;
    using Research.UI.Web.Validation.Rules;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public class Employee
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        List<Declaration> Declarations { get; set; }
    }
}