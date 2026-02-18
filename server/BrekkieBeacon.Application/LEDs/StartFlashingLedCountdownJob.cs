using Quartz;

namespace BrekkieBeacon.Application.LEDs;

public class StartFlashingLedCountdownJob(LEDService ledService) : IJob
{
    public Task Execute(IJobExecutionContext context)
    {
        var cancellationToken = new CancellationTokenSource();
        cancellationToken.CancelAfter(TimeSpan.FromSeconds(20));
        return ledService.StartFlashingLedCountdown(cancellationToken.Token);
    }
}