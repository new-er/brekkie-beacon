using BrekkieBeacon.Core;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Serilog.Core;
using Serilog.Events;

namespace BrekkieBeacon.Application.Logging;

public class SignalRSink(IServiceProvider serviceProvider) : ILogEventSink
{
    public void Emit(LogEvent logEvent)
    {
        if(!logEvent.Properties.TryGetValue("VisibleForClient", out var visibleForClient)) return;
        var visibleForClientValue = visibleForClient.ToString().Equals("true", StringComparison.InvariantCultureIgnoreCase);
        if(!visibleForClientValue) return;

        using var scope = serviceProvider.CreateScope();
        var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<StatusHub>>();

        Task.Run(async () =>
        {
            await Task.Delay(500); // wait until message is saved in database before notify client app //TODO: improve by keeping an in memory log message store
            _ = hubContext.Clients.All.SendAsync("NewLogMessage");
        });
    }
}