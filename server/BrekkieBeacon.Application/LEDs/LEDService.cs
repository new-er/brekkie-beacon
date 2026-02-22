using BrekkieBeacon.Core;
using Dotcore.GPIO.Pins;
using Microsoft.AspNetCore.SignalR;

namespace BrekkieBeacon.Application.LEDs;

public class LEDService(IHubContext<StatusHub> hubContext)
{
    private readonly OutputPin[] pins =
    [
        IPinFactory.Instance.Output(21), //40
        IPinFactory.Instance.Output(20), //38
        IPinFactory.Instance.Output(16), //36
        IPinFactory.Instance.Output(12) //32
    ];
    
    
    private CancellationTokenSource? _cts;
    private readonly Lock _lock = new();

    public bool IsRunning => _cts != null;

    public Task StartDimmedLedCountdown(DateTimeOffset countdownTarget, float brightness = 1) 
        => StartFlash((pins, cancellation) => pins.DimmedCountdown(
            LEDInstructions.StartDimmingCountdown / pins.Length, 
            () => countdownTarget - DateTimeOffset.Now, 
            brightness,
            cancellation));
    
    public Task StartFlashingLedCountdown(float brightness = 1) 
        => StartFlash((pins, cancellation) => pins.FlashAll(brightness, cancellation));

    public Task StartTestFlash(float brightness = 1) 
        => StartFlash((pins, cancellation) => pins.FlashTest(
            TimeSpan.FromSeconds(0.25),
            brightness,
            cancellation));

    private async Task StartFlash(Func<BrightnessSoftwarePWMOutputPin[], CancellationToken, Task> flashFunc)
    {
        lock (_lock)
        {
            if (_cts != null) return;
            _cts = new CancellationTokenSource();
        }
        
        var softwarePWMPins = CreateSoftwarePWMPins().ToArray();
        
        try
        {
            await hubContext.Clients.All.SendAsync("LedStatusChanged", new State(true));
            softwarePWMPins.ForEach(pin => pin.Start());
            await flashFunc(softwarePWMPins, _cts.Token);
        }
        finally
        {
            softwarePWMPins.ForEach(pin => pin.Dispose());
            await hubContext.Clients.All.SendAsync("LedStatusChanged", new State(false));
        }
    }

    public void StopFlash()
    {
        lock (_lock)
        {
            if (_cts == null) return;
            _cts.Cancel();
            _cts = null;
        }
    }


    private BrightnessSoftwarePWMOutputPin[] CreateSoftwarePWMPins(int frequency = 60, double dutyCycle = 0,
        bool usePrecisionTimer = false)
        => pins.Select(pin => new BrightnessSoftwarePWMOutputPin(pin, frequency, dutyCycle, usePrecisionTimer))
            .ToArray();
}