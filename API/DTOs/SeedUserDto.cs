using System;

namespace API.DTOs
{
    public class SeedUserDto
    {
        public required string Id { get; set; } = string.Empty;
        public required string Email { get; set; } = string.Empty;
        public required string Gender { get; set; } = string.Empty;
        public required DateOnly DateOfBirth { get; set; }
        public required string DisplayName { get; set; } = string.Empty;
        public DateTime? Created { get; set; }
        public DateTime? LastActive { get; set; }
        public string? Description { get; set; } = string.Empty;
        public required string City { get; set; } = string.Empty;
        public required string Country { get; set; } = string.Empty;
        public required string ImageUrl { get; set; } = string.Empty;
    }
}