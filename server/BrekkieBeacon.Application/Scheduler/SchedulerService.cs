using System.Text.Json;
using System.Text.Json.Nodes;
using BrekkieBeacon.Application.Feeder;
using BrekkieBeacon.Application.LEDs;
using BrekkieBeacon.Core;
using Microsoft.Extensions.Logging;
using Quartz;
using Quartz.Impl;

namespace BrekkieBeacon.Application;

public class SchedulerService(ISchedulerFactory schedulerFactory, ILogger<SchedulerService> _logger)
{
    public async Task InitializeAsync(IEnumerable<FeedingTime> allFeedingTimes)
    {
        var scheduler = await schedulerFactory.GetScheduler();
        foreach (var ft in allFeedingTimes)
        {
            await ScheduleJobsAsync(scheduler, ft);
        }
        
        _logger.LogInformationVisibleForClient("Initialized scheduler");
    }
    
    public async Task OnAddedAsync(FeedingTime ft) =>
        await ScheduleJobsAsync(await schedulerFactory.GetScheduler(), ft);

    public async Task OnUpdatedAsync(FeedingTime ft)
    {
        var scheduler = await schedulerFactory.GetScheduler();
        await RemoveJobsAsync(scheduler, ft.Id);
        await ScheduleJobsAsync(scheduler, ft);
    }

    public async Task OnRemovedAsync(Guid id)
    {
        var scheduler = await schedulerFactory.GetScheduler();
        await RemoveJobsAsync(scheduler, id);
    }

    private static async Task RemoveJobsAsync(IScheduler scheduler, Guid id)
    {
        var triggerKeys = new TriggerKey[]
        {
            new(MotorJobId(id)),
            new(DimmedLedJobId(id)),
            new(FlashingLedJobId(id)),
            new(StopLedJobId(id))
        };
        await scheduler.UnscheduleJobs(triggerKeys);
        await scheduler.DeleteJob(new JobKey(MotorJobId(id)));
        await scheduler.DeleteJob(new JobKey(DimmedLedJobId(id)));
        await scheduler.DeleteJob(new JobKey(FlashingLedJobId(id)));
        await scheduler.DeleteJob(new JobKey(StopLedJobId(id)));
    }
    
    private async Task ScheduleJobsAsync(IScheduler scheduler, FeedingTime ft)
    {
        var feedTrigger = TriggerBuilder
            .Create()
            .WithIdentity(MotorJobId(ft.Id))
            .DailyAt(ft.Time)
            .Build();
        var feedJob = JobBuilder
            .Create<FeedJob>()
            .WithIdentity(MotorJobId(ft.Id))
            .UsingJobData("MotorInstructions", JsonSerializer.Serialize(ft.MotorInstructions))
            .Build();
        
        var dimmedLedTrigger = TriggerBuilder
            .Create()
            .WithIdentity(DimmedLedJobId(ft.Id))
            .DailyAt(ft.Time.Add(-TimeSpan.FromHours(1)))
            .Build();
        var dimmedLedJob = JobBuilder.Create<StartDimmedLedCountdownJob>()
            .WithIdentity(DimmedLedJobId(ft.Id))
            .UsingJobData("NextFeedingTime", ft.Time.ToString())
            .UsingJobData("LedInstructions", JsonSerializer.Serialize(ft.LEDInstructions))
            .Build();

        var flashingLedTrigger = TriggerBuilder
            .Create()
            .WithIdentity(FlashingLedJobId(ft.Id))
            .DailyAt(ft.Time.Add(-TimeSpan.FromSeconds(15)))
            .Build();
        var flashingLedJob = JobBuilder
            .Create<StartFlashingLedCountdownJob>()
            .WithIdentity(FlashingLedJobId(ft.Id))
            .UsingJobData("LedInstructions", JsonSerializer.Serialize(ft.LEDInstructions))
            .Build();
        
        var stopLedTrigger = TriggerBuilder
            .Create()
            .WithIdentity(StopLedJobId(ft.Id))
            .DailyAt(ft.Time.Add(TimeSpan.FromSeconds(15)))
            .Build();
        var stopLedJob = JobBuilder
            .Create<StopFlashingJob>()
            .WithIdentity(StopLedJobId(ft.Id))
            .UsingJobData("LedInstructions", JsonSerializer.Serialize(ft.LEDInstructions))
            .Build();
        
        await scheduler.ScheduleJob(feedJob, feedTrigger);
        await scheduler.ScheduleJob(dimmedLedJob, dimmedLedTrigger);
        await scheduler.ScheduleJob(flashingLedJob, flashingLedTrigger);
        await scheduler.ScheduleJob(stopLedJob, stopLedTrigger);
        
        var nextFireUtc = feedTrigger.GetNextFireTimeUtc();

        if (nextFireUtc.HasValue)
        {
            var timeUntil = nextFireUtc.Value - DateTimeOffset.UtcNow;
            _logger.LogInformationVisibleForClient($"Feeding {ft.Name} starts in: {timeUntil.Hours}h {timeUntil.Minutes}m {timeUntil.Seconds}s (at {nextFireUtc}, current {DateTimeOffset.UtcNow}");
        }
    }
    
    
    private static string MotorJobId(Guid id) => $"{id}_motor";
    private static string DimmedLedJobId(Guid id) => $"{id}_dimmed_led";
    private static string FlashingLedJobId(Guid id) => $"{id}_flashing";
    private static string StopLedJobId(Guid id) => $"{id}_stop_led";
}
