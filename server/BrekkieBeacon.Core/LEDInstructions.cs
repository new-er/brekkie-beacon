using Microsoft.EntityFrameworkCore;

namespace BrekkieBeacon.Core;

[Owned]
public class LEDInstructions
{
    public static TimeSpan StartDimmingCountdown = TimeSpan.FromHours(1);
    public static TimeSpan StartExcitedCountdown = TimeSpan.FromSeconds(15);
    
    public static LEDInstructions Default => new()
    {
        Brightness = 1,
    };
    
    public float Brightness { get; set; }
}