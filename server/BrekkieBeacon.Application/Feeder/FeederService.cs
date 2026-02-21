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

    private CancellationTokenSource? _cts;
    private readonly Lock _lock = new();

    public bool IsRunning => _cts != null;

    public async Task StartFeed(MotorInstructions motorInstructions)
    {
        lock (_lock)
        {
            if (_cts != null) return;
            _cts = new CancellationTokenSource();
        }
        
        _stepEngine.Direction = motorInstructions.NegateDirection;
        await hubContext.Clients.All.SendAsync("MotorStatusChanged", new State(true));
        logger.LogInformationVisibleForClient("Feeder started");
        
        try
        {
            await _stepEngine
                .Steps(
                    () => motorInstructions.Steps,
                    () => motorInstructions.WaitBetweenSteps,
                    _cts.Token);
        }
        catch (TaskCanceledException)
        {
        }
        finally
        {
            _cts?.Dispose();
            _cts = null;
            _stepEngine.Enable = false;
            logger.LogInformationVisibleForClient("Feeder stopped");
            await hubContext.Clients.All.SendAsync("MotorStatusChanged", new State(false));
        }
    }
    
    public void StopFeed()
    {
        lock (_lock)
        {
            _cts?.Cancel();
        }
    }
}