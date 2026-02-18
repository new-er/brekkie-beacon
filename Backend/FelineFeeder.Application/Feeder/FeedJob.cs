using FelineFeeder.Core;
using Quartz;

namespace FelineFeeder.Application;

public class FeedJob(FeederService feederService) : IJob
{
    public Task Execute(IJobExecutionContext context) 
        => feederService.Feed(MotorInstructions.Default, CancellationToken.None);
}