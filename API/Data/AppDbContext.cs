using datingapp.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace datingapp.API.Data
{
    public class AppDbContext(DbContextOptions options) : DbContext (options)
    {
        public DbSet<AppUser> Users { get; set; } // Users table
        public DbSet<Member> Members { get; set; }
        public DbSet<Photo> Photos { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.HasOne(u => u.Member)
                      .WithOne(m => m.User)
                      .HasForeignKey<Member>(m => m.Id)
                      .IsRequired();
            });

            modelBuilder.Entity<Member>(entity =>
            {
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Id).ValueGeneratedNever();
            });
        }
    }
}