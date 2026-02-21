using BrekkieBeacon.Core;
using Dotcore.GPIO.Engines.Step;
using Dotcore.GPIO.Engines.Step.TB6600;
using Dotcore.GPIO.Pins;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace BrekkieBeacon.Application.Feeder;

public class FeederService(IHubContext<StatusHub> hubContext, ILogger<FeederService> logger)
{
    private readonly IStepEngine _stepEngine = new StepEngine(
            IPinFactory.Instance.Output(26), //37
            IPinFactory.Instance.Output(19), //35
            IPinFactory.Instance.Output(13)) //33
        { Enable = false };

    public bool IsRunning => isRunning;
    private bool isRunning;

    public async Task Feed(MotorInstructions motorInstructions, CancellationToken cancellation)
    {
        if (isRunning) return;
        _stepEngine.Direction = motorInstructions.NegateDirection;
        isRunning = true;
        await hubContext.Clients.All.SendAsync("LedStatusChanged", new Status(true), cancellation);

        logger.LogInformationVisibleForClient("Feeder started");
        try
        {
            await _stepEngine
                .Steps(
                    () => motorInstructions.Steps,
                    () => motorInstructions.WaitBetweenSteps,
                    cancellation);
        }
        catch (TaskCanceledException)
        {
        }
        finally
        {
            _stepEngine.Enable = false;
            isRunning = false;
            logger.LogInformationVisibleForClient("Feeder stopped");
            await hubContext.Clients.All.SendAsync("LedStatusChanged", new Status(false), cancellation);
        }
    }
}