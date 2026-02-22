using System.Text.Json;
using BrekkieBeacon.Core;
using Quartz;

namespace BrekkieBeacon.Application.LEDs;

public class StartDimmedLedCountdownJob(LEDService ledService) : IJob
{
    public Task Execute(IJobExecutionContext context)
    {
        var nextFeedingTimeString = context.MergedJobDataMap.GetString("NextFeedingTime")
                                    ?? throw new NullReferenceException("NextFeedingTimeString");
        var nextFeedingTime = DateTimeOffset.Parse(nextFeedingTimeString);
        
        var ledInstructionsString = context.MergedJobDataMap.GetString("LedInstructions")
                                    ?? throw new NullReferenceException("LedInstructionsString");
        var ledInstructions = JsonSerializer.Deserialize<LEDInstructions>(ledInstructionsString)
                              ?? throw new NullReferenceException("Led instructions null");

        ledService.StopFlash();
        _ = ledService.StartDimmedLedCountdown(nextFeedingTime, ledInstructions.Brightness);
        return Task.CompletedTask;
    }
}