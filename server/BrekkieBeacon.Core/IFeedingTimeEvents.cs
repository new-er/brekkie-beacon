namespace BrekkieBeacon.Core;

public interface IFeedingTimeEvents
{
    event Func<FeedingTime, Task>? Added;
    event Func<FeedingTime, Task>? Updated;
    event Func<Guid, Task>? Removed;

    Task NotifyAddedAsync(FeedingTime feedingTime);
    Task NotifyUpdatedAsync(FeedingTime feedingTime);
    Task NotifyRemovedAsync(Guid id);
}