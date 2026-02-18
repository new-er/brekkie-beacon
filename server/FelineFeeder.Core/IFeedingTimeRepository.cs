namespace FelineFeeder.Core;

public interface IFeedingTimeRepository
{
    public event Func<FeedingTime, Task>? Added;
    public event Func<FeedingTime, Task>? Updated;
    public event Func<Guid, Task>? Removed;
    
    Task AddAsync(FeedingTime feedingTime, CancellationToken ct = default);
    Task UpdateAsync(FeedingTime feedingTime, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
    Task<List<FeedingTime>> GetAllAsync(CancellationToken ct = default);
    Task<FeedingTime?> GetByIdAsync(Guid id, CancellationToken ct = default);
}