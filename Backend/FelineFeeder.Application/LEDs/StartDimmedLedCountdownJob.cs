using Quartz;

namespace FelineFeeder.Application.LEDs;

public class StartDimmedLedCountdownJob(LEDService ledService)  : IJob
{
    public Task Execute(IJobExecutionContext context)
    {
        var nextFeedingTime = context.JobDetail.JobDataMap.GetString("NextFeedingTime");
        var nextFeedingTimeDateTime = DateTime.Parse(nextFeedingTime);
        var cancellationToken = new CancellationTokenSource();
        cancellationToken.CancelAfter(TimeSpan.FromHours(1));
        return ledService.StartDimmedLedCountdown(nextFeedingTimeDateTime, cancellationToken.Token);
    }
}