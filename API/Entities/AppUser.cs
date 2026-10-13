using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace datingapp.API.Entities
{
    public class AppUser : IdentityUser
    {
        //public string Id { get; set; } = Guid.NewGuid().ToString();
        public required string DisplayName { get; set; }
        //public required string Email { get; set; }
        
        public string? ImageUrl { get; set; }
        //public required byte[] PasswordHash { get; set; }
        //public required byte[] PasswordSalt { get; set; }

        public string? RefreshToken {get; set;}

        public DateTime? RefreshTokenExpiry {get; set; }
        
        // Navigation property for the one-to-one profile relationship.
        public Member Member { get; set; } = null!;
    }
}