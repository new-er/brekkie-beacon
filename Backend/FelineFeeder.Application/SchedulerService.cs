using FelineFeeder.Core;
using Quartz;
using Quartz.Impl;

namespace FelineFeeder.Application;

public class SchedulerService
{
    private readonly ISchedulerFactory _schedulerFactory = new StdSchedulerFactory();

    public async Task InitializeAsync(IEnumerable<FeedingTime> allFeedingTimes)
    {
        var scheduler = await _schedulerFactory.GetScheduler();
        foreach (var ft in allFeedingTimes)
        {
            await ScheduleFeedJobAsync(scheduler, ft);
        }
    }
    
    public async Task OnAddedAsync(FeedingTime ft) =>
        await ScheduleFeedJobAsync(await _schedulerFactory.GetScheduler(), ft);

    public async Task OnUpdatedAsync(FeedingTime ft)
    {
        var scheduler = await _schedulerFactory.GetScheduler();
        await scheduler.DeleteJob(new JobKey(ft.Id.ToString()));
        await ScheduleFeedJobAsync(scheduler, ft);
    }

    public async Task OnRemovedAsync(Guid id) =>
        await (await _schedulerFactory.GetScheduler()).DeleteJob(new JobKey(id.ToString()));
    
    private async Task ScheduleFeedJobAsync(IScheduler scheduler, FeedingTime ft)
    {
        var job = JobBuilder.Create<FeedJob>().Build();
        var trigger = TriggerBuilder
            .Create()
            .WithIdentity($"{ft.Id}")
            .DailyAt(ft.Time)
            .Build();
        await scheduler.ScheduleJob(job, trigger);
    }
}
