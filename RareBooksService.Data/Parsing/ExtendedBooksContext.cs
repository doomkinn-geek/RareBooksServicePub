using Microsoft.EntityFrameworkCore;
using System.Globalization;
using RareBooksService.Common.Models.Parsing;

namespace RareBooksService.Data.Parsing
{
    public class ExtendedBooksContext : DbContext
    {
        public DbSet<ExtendedBookInfo> BooksInfo { get; set; }
        public DbSet<ExtendedCategory> Categories { get; set; }
        string _dbName = "books_extended";

        public ExtendedBooksContext()
        {
            Database.EnsureCreated();
        }
        public ExtendedBooksContext(int dbNumber)
        {
            _dbName += dbNumber;
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite($"Filename=./{_dbName}.db");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ExtendedBookInfo>()
                .HasOne(b => b.Category)
                .WithMany(c => c.Books)
                .HasForeignKey(b => b.CategoryId);

            modelBuilder.Entity<ExtendedBookInfo>()
                .Property(e => e.ImageUrls)
                .HasConversion(
                    v => string.Join(";", v),
                    v => v.Split(";", StringSplitOptions.RemoveEmptyEntries).ToList());
            modelBuilder.Entity<ExtendedBookInfo>()
                .Property(e => e.ThumbnailUrls)
                .HasConversion(
                    v => string.Join(";", v),
                    v => v.Split(";", StringSplitOptions.RemoveEmptyEntries).ToList());

            modelBuilder.Entity<ExtendedBookInfo>()
                .Property(e => e.Tags)
                .HasConversion(
                    v => string.Join(";", v),
                    v => v.Split(";", StringSplitOptions.RemoveEmptyEntries).ToList());

            modelBuilder.Entity<ExtendedBookInfo>()
                .Property(e => e.PicsRatio)
                .HasConversion(
                    v => string.Join(";", v.Select(p => p.ToString(CultureInfo.InvariantCulture))),
                    v => v.Split(";", StringSplitOptions.RemoveEmptyEntries)
                          .Select(s => float.Parse(s, CultureInfo.InvariantCulture))
                          .ToArray());


            // Дополнительные настройки
        }
    }
}
