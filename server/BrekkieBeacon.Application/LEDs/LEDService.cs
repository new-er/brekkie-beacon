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
    
    
    public bool IsRunning => isRunning;
    private bool isRunning;

    public Task StartDimmedLedCountdown(DateTimeOffset countdownTarget, CancellationToken cancellation) 
        => StartFlash(pins => pins.DimmedCountdown(
            LEDInstructions.StartDimmingCountdown / pins.Length, 
            () => countdownTarget - DateTimeOffset.Now, 
            cancellation));
    
    public Task StartFlashingLedCountdown(CancellationToken cancellation) 
        => StartFlash(pins => pins.FlashAll(cancellation));

    public Task StartTestFlash(CancellationToken cancellation) 
        => StartFlash(pins => pins.FlashTest(TimeSpan.FromSeconds(0.25), cancellation));

    private async Task StartFlash(Func<BrightnessSoftwarePWMOutputPin[], Task> flashFunc)
    {
        if(isRunning) return;
        isRunning = true;
        await hubContext.Clients.All.SendAsync("LedStatusChanged", new Status(true));
        
        var softwarePWMPins = CreateSoftwarePWMPins().ToArray();
        softwarePWMPins.ForEach(pin => pin.Start());
        try
        {
            await flashFunc(softwarePWMPins);
        }
        finally
        {
            softwarePWMPins.ForEach(pin => pin.Dispose());
            isRunning = false;
            await hubContext.Clients.All.SendAsync("LedStatusChanged", new Status(false));
        }
    }


    private BrightnessSoftwarePWMOutputPin[] CreateSoftwarePWMPins(int frequency = 60, double dutyCycle = 0,
        bool usePrecisionTimer = false)
        => pins.Select(pin => new BrightnessSoftwarePWMOutputPin(pin, frequency, dutyCycle, usePrecisionTimer))
            .ToArray();
}