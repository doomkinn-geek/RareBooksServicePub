using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using RareBooksService.Common.Models;
using System.Globalization;

namespace RareBooksService.Data
{
    public class RegularBaseBooksContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<RegularBaseBook> BooksInfo { get; set; }
        public DbSet<RegularBaseCategory> Categories { get; set; }
        public DbSet<UserSearchHistory> UserSearchHistories { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }

        public RegularBaseBooksContext(DbContextOptions<RegularBaseBooksContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // Ensure the connection string is provided through configuration or parameters
                throw new InvalidOperationException("The connection string is not configured. Please use 'UseNpgsql' with a valid connection string.");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Define relationships and constraints
            modelBuilder.Entity<RegularBaseBook>()
                .HasOne(b => b.Category)
                .WithMany(c => c.Books)
                .HasForeignKey(b => b.CategoryId);

            // Value Comparers for list and array properties
            var stringListComparer = new ValueComparer<List<string>>(
                (c1, c2) => c1.SequenceEqual(c2),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToList());

            var floatArrayComparer = new ValueComparer<float[]>(
                (c1, c2) => c1.SequenceEqual(c2),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToArray());

            modelBuilder.Entity<RegularBaseBook>()
                .Property(e => e.ImageUrls)
                .HasConversion(
                    v => string.Join(";", v),
                    v => v.Split(";", StringSplitOptions.RemoveEmptyEntries).ToList())
                .Metadata.SetValueComparer(stringListComparer);

            modelBuilder.Entity<RegularBaseBook>()
                .Property(e => e.ThumbnailUrls)
                .HasConversion(
                    v => string.Join(";", v),
                    v => v.Split(";", StringSplitOptions.RemoveEmptyEntries).ToList())
                .Metadata.SetValueComparer(stringListComparer);

            modelBuilder.Entity<RegularBaseBook>()
                .Property(e => e.Tags)
                .HasConversion(
                    v => string.Join(";", v),
                    v => v.Split(";", StringSplitOptions.RemoveEmptyEntries).ToList())
                .Metadata.SetValueComparer(stringListComparer);

            modelBuilder.Entity<RegularBaseBook>()
                .Property(e => e.PicsRatio)
                .HasConversion(
                    v => string.Join(";", v.Select(p => p.ToString(CultureInfo.InvariantCulture))),
                    v => v.Split(";", StringSplitOptions.RemoveEmptyEntries)
                          .Select(s => float.Parse(s, CultureInfo.InvariantCulture))
                          .ToArray())
                .Metadata.SetValueComparer(floatArrayComparer);

            // Configure UserSearchHistory
            modelBuilder.Entity<UserSearchHistory>()
                .HasKey(ush => ush.Id);

            modelBuilder.Entity<UserSearchHistory>()
                .HasOne(ush => ush.User)
                .WithMany(u => u.SearchHistory)
                .HasForeignKey(ush => ush.UserId);

            // Configure Subscription
            modelBuilder.Entity<Subscription>()
                .HasKey(s => s.Id);
            // Configure UserSearchHistory relationships
            modelBuilder.Entity<UserSearchHistory>()
                .HasKey(ush => ush.Id);

            modelBuilder.Entity<UserSearchHistory>()
                .HasOne(ush => ush.User)
                .WithMany(u => u.SearchHistory)
                .HasForeignKey(ush => ush.UserId);

        }
    }
}
