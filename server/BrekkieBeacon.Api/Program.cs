using BrekkieBeacon.Application;
using BrekkieBeacon.Application.Feeder;
using BrekkieBeacon.Application.LEDs;
using BrekkieBeacon.Core;
using BrekkieBeacon.Infrastructure;
using Dotcore.GPIO.Pins;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quartz;
using Serilog;

var pinMode = Environment.GetEnvironmentVariable("PIN_MODE");
if (pinMode == null || pinMode.Equals("Mock", StringComparison.OrdinalIgnoreCase)) InitializePinFactory.Mock();
else InitializePinFactory.Production();

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var fullLogDbPath = Path.Combine(Directory.GetCurrentDirectory(), "logs.db");
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .WriteTo.SQLite(sqliteDbPath: fullLogDbPath, tableName:"Logs", retentionPeriod: TimeSpan.FromDays(7))
    .WriteTo.Console()
    .CreateLogger();
builder.Host.UseSerilog();

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddQuartz();

builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseSqlite("Data Source=app.db"));
builder.Services.AddDbContext<LogsDbContext>(opts =>
    opts.UseSqlite($"Data Source={fullLogDbPath}"));

builder.Services.AddScoped<IFeedingTimeRepository, FeedingTimeRepository>();
builder.Services.AddScoped<SchedulerService>();
builder.Services.AddScoped<FeederService>();
builder.Services.AddScoped<LEDService>();

var app = builder.Build();
app.UseCors("FrontendPolicy");
app.UseSerilogRequestLogging();


using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
db.Database.Migrate();

var repo = scope.ServiceProvider.GetRequiredService<IFeedingTimeRepository>();
var scheduler = scope.ServiceProvider.GetRequiredService<SchedulerService>();
var allFeedingTimes = await repo.GetAllAsync();
await scheduler.InitializeAsync(allFeedingTimes);

repo.Added += scheduler.OnAddedAsync;
repo.Updated += scheduler.OnUpdatedAsync;
repo.Removed += scheduler.OnRemovedAsync;

if (!await db.FeedingTimes.AnyAsync())
{
    db.FeedingTimes.AddRange(
        new FeedingTime { Id = Guid.NewGuid(), Name = "Morning", Time = new TimeOnly(8, 0) },
        new FeedingTime { Id = Guid.NewGuid(), Name = "Evening", Time = new TimeOnly(18, 0) }
    );

    await db.SaveChangesAsync();
}

// Configure the HTTP request pipeline.
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
app.MapGet("/feeding_times/{id}", async (Guid id, AppDbContext db) =>
{
    var item = await db.FeedingTimes.FindAsync(id);
    return item is not null ? Results.Ok(item) : Results.NotFound();
}).WithName("GetFeedingTimeById");
app.MapPut("/feeding_times/{id}", async (Guid id, FeedingTime updated, AppDbContext db) =>
{
    var existing = await db.FeedingTimes.FindAsync(id);
    if (existing is null) return Results.NotFound();
    existing.Id = updated.Id;
    existing.Name = updated.Name;
    existing.Time = updated.Time;
    existing.MotorInstructions = updated.MotorInstructions;
    existing.LEDInstructions = updated.LEDInstructions;
    await db.SaveChangesAsync();
    return Results.Ok(existing);
}).WithName("UpdateFeedingTime");
app.MapDelete("/feeding_times/{id}", async (Guid id, AppDbContext db) =>
{
    var item = await db.FeedingTimes.FindAsync(id);
    if (item is null) return Results.NotFound();

    db.FeedingTimes.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("DeleteFeedingTime");
app.MapGet("/feeding_times", async (AppDbContext db) =>
{
    var times = await db.FeedingTimes.ToListAsync();
    return times;
}).WithName("GetFeedingTimes");

app.MapGet("/feed_now", async (FeederService feederService) =>
{
    _ = feederService.Feed(MotorInstructions.Default, CancellationToken.None);
    return Results.Ok(new { Message = "started feed now" });
}).WithName("FeedNow");

app.MapGet("/flash_leds_now", (LEDService ledService) =>
{
    var cancellation = new CancellationTokenSource();
    cancellation.CancelAfter(TimeSpan.FromSeconds(2));
    _ = ledService.StartTestFlash(cancellation.Token);
    return Results.Ok(new { Message = "started light flash" });
}).WithName("FlashLEDsNow");

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
