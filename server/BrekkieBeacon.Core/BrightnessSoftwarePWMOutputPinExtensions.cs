namespace BrekkieBeacon.Core;

public static class BrightnessSoftwarePWMOutputPinExtensions
{
     public static Task FlashTest(
         this BrightnessSoftwarePWMOutputPin[] softwarePWMPins, 
         TimeSpan waitBetweenStep, 
         float brightness = 1,
         CancellationToken cancellation = default)
    {
        var softwarePWMPinsReversed = softwarePWMPins.Reverse().ToArray();
        return cancellation.WhileNotCancelled(async () =>
        {
            await softwarePWMPinsReversed.ForEachAsync(async pin =>
            {
                pin.SetDutyCycle(0.25, brightness);
                await Task.Delay(waitBetweenStep, cancellation);
                pin.SetDutyCycle(0.5, brightness);
                await Task.Delay(waitBetweenStep, cancellation);
                pin.SetDutyCycle(0.75, brightness);
                await Task.Delay(waitBetweenStep, cancellation);
                pin.SetDutyCycle(1, brightness);
            });
            await Task.Delay(waitBetweenStep, cancellation);

            await softwarePWMPins.ForEachAsync(async pin =>
            {
                pin.SetDutyCycle(0.75, brightness);
                await Task.Delay(waitBetweenStep, cancellation);
                pin.SetDutyCycle(0.5, brightness);
                await Task.Delay(waitBetweenStep, cancellation); 
                pin.SetDutyCycle(0.25, brightness);
                await Task.Delay(waitBetweenStep, cancellation);
                pin.SetDutyCycle(0, brightness);
            });
            await Task.Delay(waitBetweenStep, cancellation);
        });
    }


    public static async Task FlashAll(
        this BrightnessSoftwarePWMOutputPin[] softwarePWMPins,
        float brightness = 1,
        CancellationToken cancellation = default)
    {
        softwarePWMPins.ForEach(pin => pin.Frequency = 60);
        await cancellation.WhileNotCancelled(async () =>
        {
            softwarePWMPins.ForEach(pin => pin.SetDutyCycle(1, brightness));
            await Task.Delay(TimeSpan.FromSeconds(0.5), cancellation);
            softwarePWMPins.ForEach(pin => pin.SetDutyCycle(0, brightness));
            await Task.Delay(TimeSpan.FromSeconds(0.5), cancellation);
        });
        softwarePWMPins.ForEach(pin => pin.SetDutyCycle(0, brightness));
    }

    public static Task DimmedCountdown(
        this BrightnessSoftwarePWMOutputPin[] softwarePWMPins,
        TimeSpan perPin,
        Func<TimeSpan> currentTime,
        float brightness = 1,
        CancellationToken cancellation = default)
    {
        return cancellation.WhileNotCancelled(async () =>
        {
            softwarePWMPins.ForEach((index, pin) =>
            {
                var fullBrightnessAt = perPin * index;
                var startAt = fullBrightnessAt + perPin;
                var dutyCycle = (1 - ((currentTime() - fullBrightnessAt) / (startAt - fullBrightnessAt)));
                if (dutyCycle < 0) dutyCycle = 0;
                if (dutyCycle > 1) dutyCycle = 1;
                pin.SetDutyCycle(dutyCycle, brightness);
            });
            await Task.Delay(TimeSpan.FromSeconds(1), cancellation);
        });
    }
}