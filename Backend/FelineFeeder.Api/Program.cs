using FelineFeeder.Core;
using FelineFeeder.Infrastructure;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseSqlite("Data Source=app.db"));

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
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
app.MapGet("/feeding_times/{id}", async (int id, AppDbContext db) =>
{
    var item = await db.FeedingTimes.FindAsync(id);
    return item is not null ? Results.Ok(item) : Results.NotFound();
}).WithName("GetFeedingTimeById");
app.MapPut("/feeding_times/{id}", async (int id, FeedingTime updated, AppDbContext db) =>
{
    var existing = await db.FeedingTimes.FindAsync(id);
    if (existing is null) return Results.NotFound();
    existing.Id = updated.Id;
    existing.Name = updated.Name;
    existing.Time = updated.Time;
    await db.SaveChangesAsync();
    return Results.Ok(existing);
}).WithName("UpdateFeedingTime");
app.MapDelete("/feeding_times/{id}", async (int id, AppDbContext db) =>
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

app.Run();