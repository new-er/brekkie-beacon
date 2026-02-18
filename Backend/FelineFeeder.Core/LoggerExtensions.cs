using Microsoft.Extensions.Logging;

namespace FelineFeeder.Core;

public static class LoggerExtensions
{
    public static void LogInformationVisibleInWebUI(this ILogger logger, string message)
    {
        using var scope = logger.BeginScope(new Dictionary<string, object>()
        {
            ["VisibleForClient"] = true 
        });
        logger.LogInformation(message);
    }
}