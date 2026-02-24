namespace BrekkieBeacon.Core;

public record FeedingTime
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public TimeOnly Time  { get; set; }
    public bool IsEnabled { get; set; } = true;
    public MotorInstructions MotorInstructions { get; set; } = MotorInstructions.Default;
    public LEDInstructions LEDInstructions { get; set; } = LEDInstructions.Default;
}