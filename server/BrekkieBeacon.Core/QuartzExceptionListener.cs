using Microsoft.Extensions.Logging;
using Quartz;

namespace BrekkieBeacon.Core;

public class QuartzExceptionListener(ILogger<QuartzExceptionListener> logger) : IJobListener
{
    public string Name => "GlobalExceptionListener";

    public Task JobToBeExecuted(IJobExecutionContext context, CancellationToken ct) => Task.CompletedTask;

    public Task JobExecutionVetoed(IJobExecutionContext context, CancellationToken ct) => Task.CompletedTask;

    public Task JobWasExecuted(IJobExecutionContext context, JobExecutionException? jobException, CancellationToken ct)
    {
        if (jobException != null) logger.LogErrorVisibleForClient(jobException, jobException.Message);
        return Task.CompletedTask;
    }
}