using BrekkieBeacon.Core;
using Microsoft.EntityFrameworkCore;

namespace BrekkieBeacon.Infrastructure;

public class LogsDbContext(DbContextOptions<LogsDbContext> opts) : DbContext(opts)
{
    public DbSet<LogEntry> Logs { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<LogEntry>()
            .ToTable("Logs")
            .HasKey(l => l.Id);
    }
}