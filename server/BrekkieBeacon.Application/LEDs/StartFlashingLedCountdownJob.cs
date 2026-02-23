using System.Text.Json;
using BrekkieBeacon.Core;
using Microsoft.Extensions.Logging;
using Quartz;

namespace BrekkieBeacon.Application.LEDs;

public class StartFlashingLedCountdownJob(LEDService ledService, ILogger<StartFlashingLedCountdownJob> logger) : IJob
{
    public Task Execute(IJobExecutionContext context)
    { 
        logger.LogInformationVisibleForClient("StartFlashingLedCountdownJob");
        var ledInstructionsString = context.MergedJobDataMap.GetString("LedInstructions")
                                    ?? throw new NullReferenceException("LedInstructionsString");
        var ledInstructions = JsonSerializer.Deserialize<LEDInstructions>(ledInstructionsString)
                              ?? throw new NullReferenceException("Led instructions null");
        
        
        ledService.StopFlash();
        Task.Run(async () =>
        {
            try
            {
                await ledService.StartFlashingLedCountdown(ledInstructions.Brightness);
            }
            catch (Exception e)
            {
                logger.LogErrorVisibleForClient(e, "StartDimmedLedCountdownJob failed");
            }
        });
        
        return Task.CompletedTask;
    }
}