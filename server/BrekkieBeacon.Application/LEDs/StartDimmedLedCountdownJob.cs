using Quartz;

namespace BrekkieBeacon.Application.LEDs;

public class StartDimmedLedCountdownJob(LEDService ledService)  : IJob
{
    public Task Execute(IJobExecutionContext context)
    {
        var nextFeedingTime = context.JobDetail.JobDataMap.GetString("NextFeedingTime");
        if (nextFeedingTime == null) throw new NullReferenceException("Next feeding time is null");
        var nextFeedingTimeDateTime = DateTime.Parse(nextFeedingTime);
        
        ledService.StopFlash();
        _ = ledService.StartDimmedLedCountdown(nextFeedingTimeDateTime);
        return Task.CompletedTask;
    }
}