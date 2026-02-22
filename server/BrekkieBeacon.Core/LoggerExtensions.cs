using Microsoft.Extensions.Logging;

namespace BrekkieBeacon.Core;

public static class LoggerExtensions
{
    public static void LogInformationVisibleForClient(this ILogger logger, string message)
    {
        using var scope = logger.BeginVisibleForClientScope();
        logger.LogInformation(message);
    }

    public static void LogErrorVisibleForClient(this ILogger logger, Exception ex, string message,
        params object?[] args)
    {
        using var scope = logger.BeginVisibleForClientScope();
        logger.LogError(ex, message, args);
    }

    private static IDisposable? BeginVisibleForClientScope(this ILogger logger)
    {
        return logger.BeginScope(new Dictionary<string, object>()
        {
            ["VisibleForClient"] = true
        });
    }
}