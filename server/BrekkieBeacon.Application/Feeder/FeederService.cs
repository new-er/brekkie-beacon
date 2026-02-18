using BrekkieBeacon.Core;
using Dotcore.GPIO.Engines.Step;
using Dotcore.GPIO.Engines.Step.TB6600;
using Dotcore.GPIO.Pins;
using Microsoft.Extensions.Logging;

namespace BrekkieBeacon.Application.Feeder;

public class FeederService
{
    private readonly IStepEngine _stepEngine;
    private bool isRunning;
    private readonly ILogger<FeederService> _logger;

    public FeederService(ILogger<FeederService> logger)
    {
        _logger = logger;
        var gpio = IPinFactory.Instance;
        _stepEngine = new StepEngine(
                gpio.Output(26), //37
                gpio.Output(19), //35
                gpio.Output(13)) //33
            { Enable = false };
    }
    
    public async Task Feed(MotorInstructions motorInstructions, CancellationToken cancellation)
    {
        if (isRunning) return;
        _stepEngine.Direction = motorInstructions.NegateDirection;
        isRunning = true;
        
        _logger.LogInformationVisibleForClient("Feeder started");
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
            _logger.LogInformationVisibleForClient("Feeder stopped");
        }
    }
}