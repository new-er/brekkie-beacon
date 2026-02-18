using Microsoft.EntityFrameworkCore;

namespace FelineFeeder.Core;

[Owned]
public class LEDInstructions
{
    public static LEDInstructions Default => new()
    {
        Brightness = 1,
    };
    
    public float Brightness { get; set; }
}