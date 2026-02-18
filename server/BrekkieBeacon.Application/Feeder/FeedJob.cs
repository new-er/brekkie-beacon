using BrekkieBeacon.Core;
using Quartz;

namespace BrekkieBeacon.Application.Feeder;

public class FeedJob(FeederService feederService) : IJob
{
    public Task Execute(IJobExecutionContext context) 
        => feederService.Feed(MotorInstructions.Default, CancellationToken.None);
}