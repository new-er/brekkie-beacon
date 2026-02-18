namespace FelineFeeder.Core;

public static class LinqExtensions
{
    public static void ForEach<T>(this IEnumerable<T> source, Action<T> action)
    {
        foreach (var item in source) action(item);
    }
    
    public static void ForEach<T>(this IEnumerable<T> source, Action<int, T> action)
    {
        var index = 0;
        foreach (var item in source)
        {
            action(index, item);
            index++;
        }
    }
    
    public static async Task ForEachAsync<T>(this IEnumerable<T> source, Func<T, Task> action)
    {
        foreach (var item in source) await action(item);
    }
}