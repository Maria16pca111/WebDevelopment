using System.Text;
using System.Text.Json;
using API.DTOs;
using datingapp.API.Data;
using datingapp.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public Seed()
        {
            // Static initialization logic goes here.
        }

        public static async Task SeedUsers(AppDbContext context)
        {
            if(await context.Users.AnyAsync())
            {
                return; // Database has already been seeded with users, so we can exit early.
            }
            var memberData = await File.ReadAllTextAsync("Data/UserSeedData.json");
            var members = JsonSerializer.Deserialize<List<SeedUserDto>>(memberData);

            if (members == null)
            {
                Console.WriteLine("No valid user data found in the JSON file.");
                return; // No valid user data found in the JSON file, so we can exit early.
            }

            foreach(var member in members)
            {
                using var hmac = new System.Security.Cryptography.HMACSHA512();
                var user = new AppUser
                {
                    Id = member.Id,
                    Email = member.Email,
                    DisplayName = member.DisplayName,
                    ImageUrl = member.ImageUrl,
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd")), 
                    PasswordSalt = hmac.Key,
                    Member = new Member
                    {
                        Id = member.Id,
                        DisplayName = member.DisplayName,
                        Description = member.Description,
                        DateOfBrith = member.DateOfBirth,
                        ImageUrl = member.ImageUrl,
                        Gender = member.Gender,
                        City = member.City,
                        Country = member.Country,
                        Created = member.Created ?? DateTime.UtcNow,
                        LastActive = member.LastActive ?? DateTime.UtcNow,
                        Email = member.Email
                    }
                };
                
                user.Member.Photos.Add(new Photo
                {
                    Url = member.ImageUrl!,
                    MemberId = member.Id
                });

                context.Users.Add(user);
            }

            await context.SaveChangesAsync(); // Save all changes to the database after processing all users.
            // Call this method to trigger any seed logic if needed.
        }
    }
}