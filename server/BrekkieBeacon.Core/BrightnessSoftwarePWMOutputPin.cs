using Dotcore.GPIO.Pins;

namespace BrekkieBeacon.Core;

public class BrightnessSoftwarePWMOutputPin(
    OutputPin pin,
    int frequency = 400,
    double dutyCycle = 0.5,
    bool usePrecisionTimer = false)
    : SoftwarePWMOutputPin(pin, frequency, dutyCycle, usePrecisionTimer)
{
    public void SetDutyCycle(double dutyCycle, float brightness)
    {
        var dutyCycleBrightness = dutyCycle * brightness;
        if (dutyCycleBrightness < 0) dutyCycleBrightness = 0;
        if (dutyCycleBrightness > 1) dutyCycleBrightness = 1;
        DutyCycle = dutyCycleBrightness;
    }
}