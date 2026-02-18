using FelineFeeder.Core;
using Microsoft.EntityFrameworkCore;

namespace FelineFeeder.Infrastructure;

public class FeedingTimeRepository(AppDbContext db) : IFeedingTimeRepository
{
    public event Func<FeedingTime, Task>? Added;
    public event Func<FeedingTime, Task>? Updated;
    public event Func<Guid, Task>? Removed;

    public async Task AddAsync(FeedingTime feedingTime, CancellationToken ct = default)
    {
        db.FeedingTimes.Add(feedingTime);
        await db.SaveChangesAsync(ct);
        if (Added is not null) await Added(feedingTime);
    }

    public async Task UpdateAsync(FeedingTime feedingTime, CancellationToken ct = default)
    {
        db.FeedingTimes.Update(feedingTime);
        await db.SaveChangesAsync(ct);
        if (Updated is not null) await Updated(feedingTime);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await db.FeedingTimes.FindAsync([id], ct);
        if (entity is null) return;

        db.FeedingTimes.Remove(entity);
        await db.SaveChangesAsync(ct);
        if (Removed is not null) await Removed(id);
    }
    
    public async Task<List<FeedingTime>> GetAllAsync(CancellationToken ct = default)
        => await db.FeedingTimes.ToListAsync(ct);

    public async Task<FeedingTime?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await db.FeedingTimes.FindAsync([id], ct);
}