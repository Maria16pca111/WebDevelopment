using datingapp.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace datingapp.API.Data
{
    public class AppDbContext(DbContextOptions options) : DbContext (options)
    {
        public DbSet<AppUser> Users { get; set; } // Users table
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Add your model configurations here
        }
    }
}