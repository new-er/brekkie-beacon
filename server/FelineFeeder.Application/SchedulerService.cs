using FelineFeeder.Application.LEDs;
using FelineFeeder.Core;
using Microsoft.Extensions.Logging;
using Quartz;
using Quartz.Impl;

namespace FelineFeeder.Application;

public class SchedulerService(ILogger<SchedulerService> _logger)
{
    private readonly ISchedulerFactory _schedulerFactory = new StdSchedulerFactory();

    public async Task InitializeAsync(IEnumerable<FeedingTime> allFeedingTimes)
    {
        var scheduler = await _schedulerFactory.GetScheduler();
        foreach (var ft in allFeedingTimes)
        {
            await ScheduleJobsAsync(scheduler, ft);
        }
        
        _logger.LogInformationVisibleInWebUI("Initialized scheduler");
    }
    
    public async Task OnAddedAsync(FeedingTime ft) =>
        await ScheduleJobsAsync(await _schedulerFactory.GetScheduler(), ft);

    public async Task OnUpdatedAsync(FeedingTime ft)
    {
        var scheduler = await _schedulerFactory.GetScheduler();
        await scheduler.DeleteJob(new JobKey(ft.Id.ToString()));
        await ScheduleJobsAsync(scheduler, ft);
    }

    public async Task OnRemovedAsync(Guid id) =>
        await (await _schedulerFactory.GetScheduler()).DeleteJob(new JobKey(id.ToString()));
    
    private static async Task ScheduleJobsAsync(IScheduler scheduler, FeedingTime ft)
    {
        await ScheduleFeedJobAsync(scheduler, ft);
        await ScheduleLedJobsAsync(scheduler, ft);
    }
    
    private static async Task ScheduleFeedJobAsync(IScheduler scheduler, FeedingTime ft)
    {
        var trigger = TriggerBuilder
            .Create()
            .WithIdentity($"{ft.Id}")
            .DailyAt(ft.Time)
            .Build();
        var job = JobBuilder.Create<FeedJob>().Build();
        await scheduler.ScheduleJob(job, trigger);
    }
    private static async Task ScheduleLedJobsAsync(IScheduler scheduler, FeedingTime ft)
    {
        var dimmedLedTrigger = TriggerBuilder
            .Create()
            .WithIdentity($"{ft.Id}_dimmed_led")
            .DailyAt(ft.Time.AddHours(-1))
            .Build();
        var dimmedLedJob = JobBuilder.Create<StartDimmedLedCountdownJob>()
            .SetJobData(new JobDataMap(new Dictionary<string, string>()
            {
                { "NextFeedingTime", ft.Time.ToString() },
            }))
            .Build();

        var flashingLedTrigger = TriggerBuilder
            .Create()
            .WithIdentity($"{ft.Id}_flashing")
            .DailyAt(ft.Time.Add(TimeSpan.FromSeconds(15)))
            .Build();
        var flashingLedJob = JobBuilder.Create<StartFlashingLedCountdownJob>().Build();
        
        await scheduler.ScheduleJob(dimmedLedJob, dimmedLedTrigger);
        await scheduler.ScheduleJob(flashingLedJob, flashingLedTrigger);
    }
}
