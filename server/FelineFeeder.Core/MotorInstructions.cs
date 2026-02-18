using Microsoft.EntityFrameworkCore;

namespace FelineFeeder.Core;

[Owned]
public record MotorInstructions
{
    public static MotorInstructions Default => new()
    {
        Steps = 1450,
        WaitBetweenSteps = TimeSpan.FromMilliseconds(5)
    };
    
    public uint Steps { get; set; }
    public TimeSpan WaitBetweenSteps { get; set; }
    public bool NegateDirection { get; set; }
}