using BrekkieBeacon.Core;

namespace BrekkieBeacon.Infrastructure;

public class FeedingTimeEvents : IFeedingTimeEvents
{
    public event Func<FeedingTime, Task>? Added;
    public event Func<FeedingTime, Task>? Updated;
    public event Func<Guid, Task>? Removed;

    public async Task NotifyAddedAsync(FeedingTime feedingTime)
    {
        if (Added is not null) await Added(feedingTime);
    }

    public async Task NotifyUpdatedAsync(FeedingTime feedingTime)
    {
        if (Updated is not null) await Updated(feedingTime);
    }

    public async Task NotifyRemovedAsync(Guid id)
    {
        if (Removed is not null) await Removed(id);
    }
}