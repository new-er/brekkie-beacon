namespace BrekkieBeacon.Core;

public static class CancellationTokenExtensions
{
    public static async Task WhileNotCancelled(this CancellationToken cancellation, Func<Task> action)
    {
        while (!cancellation.IsCancellationRequested)
        {
            await action();
        }
    }
}