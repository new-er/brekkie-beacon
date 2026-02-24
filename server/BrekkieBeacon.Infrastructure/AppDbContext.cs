using BrekkieBeacon.Core;
using Microsoft.EntityFrameworkCore;

namespace BrekkieBeacon.Infrastructure;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<FeedingTime> FeedingTimes { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var feedingTimes = new FeedingTime[]
        { 
            new()
            { 
                Id = Guid.Parse("79809983-9993-4B93-941E-32363198084B"), 
                Name = "🌅 Morning Morsel", 
                Time = new TimeOnly(5, 0),
                IsEnabled = true,
                MotorInstructions = new MotorInstructions
                {
                    Steps = 1450,
                    WaitBetweenSteps = TimeSpan.FromMilliseconds(5)
                },
                LEDInstructions = new LEDInstructions
                {
                    Brightness = 1
                }
            },
            new()
            { 
                Id = Guid.Parse("79809983-9993-4B93-941E-32363198084E"), 
                Name = "☀️ Breakfast Banquet", 
                Time = new TimeOnly(5, 15),
                IsEnabled = true,
                MotorInstructions = new MotorInstructions
                {
                    Steps = 1450,
                    WaitBetweenSteps = TimeSpan.FromMilliseconds(5)
                },
                LEDInstructions = new LEDInstructions
                {
                    Brightness = 1
                }
            },
            new()
            { 
                Id = Guid.Parse("A392764B-D291-4940-9E11-22964177013C"), 
                Name = "🌇 Sunset Snack", 
                Time = new TimeOnly(17, 0),
                IsEnabled = true,
                MotorInstructions = new MotorInstructions
                {
                    Steps = 1450,
                    WaitBetweenSteps = TimeSpan.FromMilliseconds(5)
                },
                LEDInstructions = new LEDInstructions
                {
                    Brightness = 1
                }
            },
            new()
            { 
                Id = Guid.Parse("A392764B-D291-4940-9E11-22964177013D"), 
                Name = "🌙 Dinner Delight", 
                Time = new TimeOnly(17, 15),
                IsEnabled = true,
                MotorInstructions = new MotorInstructions
                {
                    Steps = 1450,
                    WaitBetweenSteps = TimeSpan.FromMilliseconds(5)
                },
                LEDInstructions = new LEDInstructions
                {
                    Brightness = 1
                }
            }
        };
        
        modelBuilder.Entity<FeedingTime>().HasData(feedingTimes.Select(f => new {
            f.Id,
            f.Name,
            f.Time,
            f.IsEnabled
        }));
        modelBuilder.Entity<FeedingTime>().OwnsOne(f => f.MotorInstructions).HasData(feedingTimes.Select(f => new {
            FeedingTimeId = f.Id, 
            Steps = f.MotorInstructions.Steps,
            WaitBetweenSteps = f.MotorInstructions.WaitBetweenSteps,
            NegateDirection = f.MotorInstructions.NegateDirection
        }));
        modelBuilder.Entity<FeedingTime>().OwnsOne(f => f.LEDInstructions).HasData(feedingTimes.Select(f => new {
            FeedingTimeId = f.Id, 
            Brightness = f.LEDInstructions.Brightness
        }));
    }
}