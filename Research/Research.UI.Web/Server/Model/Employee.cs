
namespace Research.UI.Web.Server.Model
{
    using Research.Core.Validators;
    using System.ComponentModel.DataAnnotations;

    public class Employee
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [StringLengthRange(Minimum = 5, Maximum = 10, ErrorMessage = "Must be between 5 and 10 characters.")]
        public string PhoneNumber { get; set; }
        public int ProductId { get; set; }
    }
}