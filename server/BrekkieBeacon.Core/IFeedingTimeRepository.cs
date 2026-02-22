namespace BrekkieBeacon.Core;

public interface IFeedingTimeRepository
{
    Task AddAsync(FeedingTime feedingTime, CancellationToken ct = default);
    Task UpdateAsync(FeedingTime feedingTime, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
    Task<List<FeedingTime>> GetAllAsync(CancellationToken ct = default);
    Task<FeedingTime?> GetByIdAsync(Guid id, CancellationToken ct = default);
}