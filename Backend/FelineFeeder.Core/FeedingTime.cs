namespace FelineFeeder.Core;

public record FeedingTime
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public TimeOnly Time  { get; set; }
}