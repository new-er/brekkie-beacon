using BrekkieBeacon.Application;
using BrekkieBeacon.Application.Feeder;
using BrekkieBeacon.Application.LEDs;
using BrekkieBeacon.Application.Logging;
using BrekkieBeacon.Core;
using BrekkieBeacon.Infrastructure;
using Dotcore.GPIO.Pins;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quartz;
using Quartz.Impl.Matchers;
using Serilog;

var pinMode = Environment.GetEnvironmentVariable("PIN_MODE") ?? "mock";
if (pinMode.Equals("prod", StringComparison.OrdinalIgnoreCase)) InitializePinFactory.Production();
else InitializePinFactory.Mock();

var timezoneString = Environment.GetEnvironmentVariable("timezone") ?? "Europe/Amsterdam";
var userTimeZone = TimeZoneInfo.FindSystemTimeZoneById(timezoneString);

var builder = WebApplication.CreateBuilder(args);
var dbFolder = builder.Configuration["DATABASE_PATH"] ?? Directory.GetCurrentDirectory();
if (!Directory.Exists(dbFolder)) Directory.CreateDirectory(dbFolder);
var dataFolder = Path.Combine(dbFolder, "data");
if (!Directory.Exists(dataFolder)) Directory.CreateDirectory(dataFolder);
var logDbPath = Path.Combine(dataFolder, "logs.db");
var appDbPath = Path.Combine(dataFolder, "app.db");

builder.Services.AddSingleton(userTimeZone);

builder.Services.AddCors(options =>
{
    var allowedOrigins = builder.Configuration["ALLOWED_ORIGINS"]?.Split(',') ?? Array.Empty<string>();
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
builder.Services.AddSignalR();


builder.Host.UseSerilog();

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddQuartz(q =>
{
    q.AddJobListener<QuartzExceptionListener>(GroupMatcher<JobKey>.AnyGroup());
});
builder.Services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);
builder.Services.AddHealthChecks();

builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseSqlite($"Data Source={appDbPath}"));
builder.Services.AddDbContext<LogsDbContext>(opts =>
    opts.UseSqlite($"Data Source={logDbPath}"));

builder.Services.AddScoped<LogService>();
builder.Services.AddScoped<IFeedingTimeRepository, FeedingTimeRepository>();
builder.Services.AddSingleton<IFeedingTimeEvents, FeedingTimeEvents>();
builder.Services.AddSingleton<SchedulerService>();
builder.Services.AddSingleton<FeederService>();
builder.Services.AddSingleton<LEDService>();

var app = builder.Build();
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .WriteTo.Sink(new SignalRSink(app.Services))
    .WriteTo.SQLite(sqliteDbPath: logDbPath, tableName: "Logs", retentionPeriod: TimeSpan.FromDays(7))
    .WriteTo.Console()
    .CreateLogger();

app.UseCors("FrontendPolicy");
app.UseSerilogRequestLogging();
app.MapHealthChecks("/health");
app.MapHub<StatusHub>("/statusHub");

using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
db.Database.Migrate();

var repo = scope.ServiceProvider.GetRequiredService<IFeedingTimeRepository>();
var repoEvents = scope.ServiceProvider.GetRequiredService<IFeedingTimeEvents>();
var scheduler = scope.ServiceProvider.GetRequiredService<SchedulerService>();
var allFeedingTimes = await repo.GetAllAsync();
await scheduler.InitializeAsync(allFeedingTimes);

repoEvents.Added += scheduler.OnAddedAsync;
repoEvents.Updated += scheduler.OnUpdatedAsync;
repoEvents.Removed += scheduler.OnRemovedAsync;

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapPost("/feeding_times", async (FeedingTime feedingTime, AppDbContext db) =>
{
    db.FeedingTimes.Add(feedingTime);
    await db.SaveChangesAsync();
    return Results.Created($"/feeding_times/{feedingTime.Id}", feedingTime);
}).WithName("CreateFeedingTime");
app.MapGet("/feeding_times/{id}", async (Guid id, IFeedingTimeRepository repo) =>
{
    var item = await repo.GetByIdAsync(id);
    return item is not null ? Results.Ok(item) : Results.NotFound();
}).WithName("GetFeedingTimeById");
app.MapPut("/feeding_times/{id}", async (Guid id, FeedingTime updated, IFeedingTimeRepository repo) =>
{
    var existing = await db.FeedingTimes.FindAsync(id);
    if (existing is null) return Results.NotFound();
    await repo.UpdateAsync(updated);
    return Results.Ok(existing);
}).WithName("UpdateFeedingTime");
app.MapDelete("/feeding_times/{id}", async (Guid id, IFeedingTimeRepository repo) =>
{
    var item = await db.FeedingTimes.FindAsync(id);
    if (item is null) return Results.NotFound();
    await repo.DeleteAsync(item.Id);
    return Results.NoContent();
}).WithName("DeleteFeedingTime");
app.MapGet("/feeding_times", async (IFeedingTimeRepository repo) =>
{
    return await repo.GetAllAsync();
}).WithName("GetFeedingTimes");

app.MapPost("/feed_now", (FeederService feederService) =>
{
    _ = feederService.StartFeed(MotorInstructions.Default);
    return Results.Ok(new { Message = "started feeder" });
}).WithName("FeedNow");
app.MapPost("/stop_feed", (FeederService feederService) =>
{
    feederService.StopFeed();
    return Results.Ok(new { Message = "stopped feeder" });
}).WithName("StopFeed");
app.MapGet("/motor_status", (FeederService feederService) => Results.Ok(new State(feederService.IsRunning)))
    .WithName("MotorStatus");

app.MapPost("/flash_lights", (LEDService ledService) =>
{
    if (ledService.IsRunning) return Results.Ok(new { Message = "already flashing" });
    _ = ledService.StartTestFlash();
    Task.Run(async () =>
    {
        await Task.Delay(TimeSpan.FromSeconds(10));
        ledService.StopFlash();
    });
    return Results.Ok(new { Message = "started light flash" });
}).WithName("FlashLEDsNow");
app.MapPost("/stop_lights", (LEDService ledService) =>
{
    ledService.StopFlash();
    return Results.Ok(new { Message = "stopped led service" });
}).WithName("StopLEDs");
app.MapGet("/lights_status", (LEDService ledService) => Results.Ok(new State(ledService.IsRunning)))
    .WithName("LEDStatus");

app.MapGet("/logs", async ([FromServices] LogsDbContext db) =>
    {
        var logs = await db.Logs
            .FromSqlRaw(@"
        SELECT *
        FROM Logs
        WHERE json_extract(Properties, '$.VisibleForClient') = 1
        ORDER BY TimeStamp DESC
        LIMIT 100
    ")
            .ToListAsync();

        return Results.Ok(logs);
    })
    .WithName("GetLogs");

app.Run();