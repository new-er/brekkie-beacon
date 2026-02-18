using BrekkieBeacon.Core;
using Microsoft.EntityFrameworkCore;

namespace BrekkieBeacon.Infrastructure;

public class LogsDbContext : DbContext
{
    public LogsDbContext(DbContextOptions<LogsDbContext> opts) : base(opts) { }

    public DbSet<LogEntry> Logs { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<LogEntry>()
            .ToTable("Logs")        // match the Serilog table name
            .HasKey(l => l.Id);     // primary key
    }
}