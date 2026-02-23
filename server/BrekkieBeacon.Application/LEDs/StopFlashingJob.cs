using BrekkieBeacon.Core;
using Microsoft.Extensions.Logging;
using Quartz;

namespace BrekkieBeacon.Application.LEDs;

public class StopFlashingJob(LEDService ledService, ILogger<StartFlashingLedCountdownJob> logger) : IJob
{
    public Task Execute(IJobExecutionContext context)
    {
        logger.LogInformationVisibleForClient("StopFlashingLedCountdownJob");
        ledService.StopFlash();
        return Task.CompletedTask;
    }
}