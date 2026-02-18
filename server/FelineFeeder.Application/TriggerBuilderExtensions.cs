using Quartz;

namespace FelineFeeder.Application;

public static class TriggerBuilderExtensions
{
    public static TriggerBuilder DailyAt(this TriggerBuilder builder, TimeOnly time)
        => builder.WithDailyTimeIntervalSchedule(dailyBuilder =>
            dailyBuilder.StartingDailyAt(new TimeOfDay(time.Hour, time.Minute, time.Second)).WithIntervalInHours(24));
}