using System.ComponentModel.DataAnnotations;

namespace datingapp.API.DTOs
{
    /// <summary>
    /// Data Transfer Object for user registration
    /// </summary>
    public class RegisterDto
    {
        [Required]
        public  string DisplayName { get; set; } = "";
        [Required]
        [EmailAddress]
        public  string Email { get; set; } = "";
        [Required]
        public  string Password { get; set; } = "";
    }
}