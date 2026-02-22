using BrekkieBeacon.Core;
using Microsoft.EntityFrameworkCore;

namespace BrekkieBeacon.Infrastructure;

public class FeedingTimeRepository(AppDbContext db, IFeedingTimeEvents events) : IFeedingTimeRepository
{
    public async Task AddAsync(FeedingTime feedingTime, CancellationToken ct = default)
    {
        db.FeedingTimes.Add(feedingTime);
        await db.SaveChangesAsync(ct);
        await events.NotifyAddedAsync(feedingTime);
    }

    public async Task UpdateAsync(FeedingTime feedingTime, CancellationToken ct = default)
    {
        db.FeedingTimes.Update(feedingTime);
        await db.SaveChangesAsync(ct);
        await events.NotifyUpdatedAsync(feedingTime);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await db.FeedingTimes.FindAsync([id], ct);
        if (entity is null) return;

        db.FeedingTimes.Remove(entity);
        await db.SaveChangesAsync(ct);
        await events.NotifyRemovedAsync(entity.Id);
    }
    
    public async Task<List<FeedingTime>> GetAllAsync(CancellationToken ct = default)
        => await db.FeedingTimes.ToListAsync(ct);

    public async Task<FeedingTime?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await db.FeedingTimes.FindAsync([id], ct);
}