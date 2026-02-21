using Quartz;

namespace BrekkieBeacon.Application.LEDs;

public class StopFlashingJob(LEDService ledService) : IJob
{
    public Task Execute(IJobExecutionContext context)
    {
        ledService.StopFlash();
        return Task.CompletedTask;
    }
}