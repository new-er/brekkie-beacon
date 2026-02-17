using FelineFeeder.Core;
using Microsoft.EntityFrameworkCore;

namespace FelineFeeder.Infrastructure;

public class AppDbContext : DbContext
{
    public DbSet<FeedingTime> FeedingTimes { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }
}