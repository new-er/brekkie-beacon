using BrekkieBeacon.Core;
using Dotcore.GPIO.Pins;

namespace BrekkieBeacon.Application.LEDs;

public class LEDService
{
    private readonly OutputPin[] pins =
    [
        IPinFactory.Instance.Output(21), //40
        IPinFactory.Instance.Output(20), //38
        IPinFactory.Instance.Output(16), //36
        IPinFactory.Instance.Output(12) //32
    ];

    public async Task StartDimmedLedCountdown(DateTimeOffset countdownTarget, CancellationToken cancellation)
    {
        var softwarePWMPins = CreateSoftwarePWMPins().ToArray();
        softwarePWMPins.ForEach(pin => pin.Start());
        var perPin = LEDInstructions.StartDimmingCountdown / softwarePWMPins.Length;
        try
        {
            await softwarePWMPins.DimmedCountdown(perPin, () => countdownTarget - DateTimeOffset.Now, cancellation);
        }
        finally
        {
            softwarePWMPins.ForEach(pin => pin.Dispose());
        }
    }

    public async Task StartFlashingLedCountdown(CancellationToken cancellation)
    {
        var softwarePWMPins = CreateSoftwarePWMPins().ToArray();
        softwarePWMPins.ForEach(pin => pin.Start());
        try
        {
            await softwarePWMPins.FlashAll(cancellation);
        }
        finally
        {
            softwarePWMPins.ForEach(pin => pin.Dispose());
        }
    }

    public async Task StartTestFlash(CancellationToken cancellation)
    {
        var softwarePWMPins = CreateSoftwarePWMPins().ToArray();
        softwarePWMPins.ForEach(pin => pin.Start());
        try
        {
            await softwarePWMPins.FlashTest(TimeSpan.FromSeconds(0.25), cancellation);
        }
        finally
        {
            softwarePWMPins.ForEach(pin => pin.Dispose());
        }
    }


    private BrightnessSoftwarePWMOutputPin[] CreateSoftwarePWMPins(int frequency = 60, double dutyCycle = 0,
        bool usePrecisionTimer = false)
        => pins.Select(pin => new BrightnessSoftwarePWMOutputPin(pin, frequency, dutyCycle, usePrecisionTimer))
            .ToArray();
}