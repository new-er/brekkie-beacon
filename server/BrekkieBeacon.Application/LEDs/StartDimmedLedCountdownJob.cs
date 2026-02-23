using System.Text.Json;
using BrekkieBeacon.Core;
using Microsoft.Extensions.Logging;
using Quartz;

namespace BrekkieBeacon.Application.LEDs;

public class StartDimmedLedCountdownJob(LEDService ledService, ILogger<StartDimmedLedCountdownJob> logger) : IJob
{
    public Task Execute(IJobExecutionContext context)
    {
        logger.LogInformationVisibleForClient("StartDimmedLedCountdownJob");
        var nextFeedingTimeString = context.MergedJobDataMap.GetString("NextFeedingTime")
                                    ?? throw new NullReferenceException("NextFeedingTimeString");
        var nextFeedingTime = DateTimeOffset.Parse(nextFeedingTimeString);
        
        var ledInstructionsString = context.MergedJobDataMap.GetString("LedInstructions")
                                    ?? throw new NullReferenceException("LedInstructionsString");
        var ledInstructions = JsonSerializer.Deserialize<LEDInstructions>(ledInstructionsString)
                              ?? throw new NullReferenceException("Led instructions null");

        ledService.StopFlash();
        Task.Run(async () =>
        {
            try
            {
                await ledService.StartDimmedLedCountdown(nextFeedingTime, ledInstructions.Brightness);
            }
            catch (Exception e)
            {
                logger.LogErrorVisibleForClient(e, "StartDimmedLedCountdownJob failed");
            }
        });
        return Task.CompletedTask;
    }
}