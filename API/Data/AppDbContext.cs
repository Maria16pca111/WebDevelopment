using datingapp.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace datingapp.API.Data
{
    public class AppDbContext(DbContextOptions options) : DbContext (options)
    {
        public DbSet<AppUser> Users { get; set; } // Users table
        public DbSet<Member> Members { get; set; }
        public DbSet<Photo> Photos { get; set; }

        public DbSet<MemberLike> Likes {get; set; }

        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Message>()
            .HasOne(x=> x.Recipient)
            .WithMany(m=> m.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
            .HasOne(x=>x.Sender)
            .WithMany(m=> m.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MemberLike>()
            .HasKey(x=> new {x.SourceMemberId, x.TargetMemberId});

            modelBuilder.Entity<MemberLike>()
            .HasOne(s=>s.SourceMember)
            .WithMany(t=> t.LikedMembers)
            .HasForeignKey(s => s.SourceMemberId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MemberLike>()
            .HasOne(s=> s. TargetMember)
            .WithMany (t=> t.LikedByMembers)
            .HasForeignKey(s => s.TargetMemberId)
            .OnDelete(DeleteBehavior.NoAction);

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

            var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
                v => v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
            );

            var nullableDateTimeConverter = new ValueConverter<DateTime?, DateTime?>(
                v => v.HasValue ? v.Value.ToUniversalTime() : null,
                v =>  v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : null
            );


            foreach(var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach(var property in entityType.GetProperties())
                {
                    if(property.ClrType == typeof(DateTime))
                    {
                        property.SetValueConverter(dateTimeConverter);
                    }

                    else if (property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(nullableDateTimeConverter);
                    }
                }
            }
        }
    }
}