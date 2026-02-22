using System.Text.Json;
using BrekkieBeacon.Core;
using Quartz;

namespace BrekkieBeacon.Application.Feeder;

public class FeedJob(FeederService feederService) : IJob
{
    public Task Execute(IJobExecutionContext context)
    {
        var motorInstructionsString = context.MergedJobDataMap.GetString("MotorInstructions") 
            ?? throw new NullReferenceException("MotorInstructionsString");
        var motorInstructions = JsonSerializer.Deserialize<MotorInstructions>(motorInstructionsString)
            ?? throw new NullReferenceException("Motor Instructions");
        return feederService.StartFeed(motorInstructions);
    }
}