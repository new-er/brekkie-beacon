using BrekkieBeacon.Core;
using Microsoft.AspNetCore.SignalR;

namespace BrekkieBeacon.Application.Logging;


public class LogService(IHubContext<StatusHub> hubContext)
{
    public void NotifyNewLog(LogEntry log)
    {
        Console.WriteLine(log);
        _ = hubContext.Clients.All.SendAsync("NewLogMessage", log);
    }
}