using System.Text.Json;
using BrekkieBeacon.Core;
using Quartz;

namespace BrekkieBeacon.Application.LEDs;

public class StartFlashingLedCountdownJob(LEDService ledService) : IJob
{
    public Task Execute(IJobExecutionContext context)
    { 
        var ledInstructionsString = context.MergedJobDataMap.GetString("LedInstructions")
                                    ?? throw new NullReferenceException("LedInstructionsString");
        var ledInstructions = JsonSerializer.Deserialize<LEDInstructions>(ledInstructionsString)
                              ?? throw new NullReferenceException("Led instructions null");
        
        
        ledService.StopFlash();
        ledService.StartFlashingLedCountdown(ledInstructions.Brightness);
        return Task.CompletedTask;
    }
}