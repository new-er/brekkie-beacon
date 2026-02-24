using BrekkieBeacon.Application.Feeder;
using BrekkieBeacon.Core;
using Dotcore.GPIO.Pins;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Quartz;
using Quartz.Impl.Matchers;

namespace BrekkieBeacon.Application.LEDs;

public class LEDService(
    IHubContext<StatusHub> hubContext,
    ISchedulerFactory schedulerFactory,
    FeederService feederService) : BackgroundService
{
    private readonly OutputPin[] pins =
    [
        IPinFactory.Instance.Output(21), //40
        IPinFactory.Instance.Output(20), //38
        IPinFactory.Instance.Output(16), //36
        IPinFactory.Instance.Output(12) //32
    ];

    private readonly Lock _lock = new();
    private CancellationTokenSource? _ledCts;
    public LedState CurrentState => _currentState;
    private LedState _currentState = LedState.Off;
    private DateTimeOffset? _currentTarget;

    public enum LedState
    {
        Off,
        Dimming,
        Blinking,
        ManualFlash
    }
    private bool _isManualOverride;
    
    public void StartManualFlash()
    {
        lock (_lock)
        {
            _isManualOverride = true;
        }
        TransitionTo(LedState.ManualFlash, null);
    }

    public void StopManualFlash()
    {
        lock (_lock)
        {
            _isManualOverride = false;
        }
        TransitionTo(LedState.Off, null);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(2));
        var scheduler = await schedulerFactory.GetScheduler(stoppingToken);

        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            var nearestTriggerTime = await GetNearestTriggerTime(scheduler, stoppingToken);
            UpdateLedState(nearestTriggerTime);
        }
    }

    private async Task<DateTimeOffset?> GetNearestTriggerTime(IScheduler scheduler, CancellationToken ct)
    {
        var triggerKeys = await scheduler.GetTriggerKeys(GroupMatcher<TriggerKey>.AnyGroup(), ct);
        DateTimeOffset? nearest = null;

        foreach (var key in triggerKeys)
        {
            var trigger = await scheduler.GetTrigger(key, ct);
            var nextFireTime = trigger?.GetNextFireTimeUtc();

            if (!nextFireTime.HasValue) continue;
            if (!nearest.HasValue || nextFireTime.Value < nearest.Value)
            {
                nearest = nextFireTime.Value;
            }
        }

        return nearest;
    }

    private void UpdateLedState(DateTimeOffset? targetTime)
    {
        lock (_lock)
        {
            if (_isManualOverride) return;
        }
        
        if (!targetTime.HasValue)
        {
            TransitionTo(LedState.Off, null);
            return;
        }

        var timeRemaining = targetTime.Value - DateTimeOffset.UtcNow;

        if (timeRemaining.TotalHours > 1) TransitionTo(LedState.Off, null);
        else if (timeRemaining.TotalSeconds > 15) TransitionTo(LedState.Dimming, targetTime.Value);
        else if (timeRemaining.TotalSeconds > 0 || feederService.IsRunning) TransitionTo(LedState.Blinking, targetTime.Value);
        else TransitionTo(LedState.Off, null);
    }

    private void TransitionTo(LedState newState, DateTimeOffset? target)
    {
        lock (_lock)
        {
            if (_currentState == newState && _currentTarget == target) return;

            if (_ledCts != null)
            {
                _ledCts.Cancel();
                _ledCts.Dispose();
                _ledCts = null;
            }

            _currentState = newState;
            _currentTarget = target;

            if (newState == LedState.Off)
            {
                _ = hubContext.Clients.All.SendAsync("LedStatusChanged", new State(false));
                return;
            }

            _ledCts = new CancellationTokenSource();
            var token = _ledCts.Token;

            _ = Task.Run(async () => await RunLedRoutine(newState, target, token), CancellationToken.None);
        }
    }

    private async Task RunLedRoutine(LedState state, DateTimeOffset? target, CancellationToken token)
    {
        var softwarePWMPins = CreateSoftwarePWMPins().ToArray();
        try
        {
            await hubContext.Clients.All.SendAsync("LedStatusChanged", new State(true), token);
            softwarePWMPins.ForEach(pin => pin.Start());

            if (state == LedState.Dimming && target.HasValue)
            {
                await softwarePWMPins.DimmedCountdown(
                    LEDInstructions.StartDimmingCountdown / softwarePWMPins.Length,
                    () => target.Value.ToLocalTime() - DateTimeOffset.Now,
                    1f,
                    token);
            }
            else if (state == LedState.Blinking)
            {
                await softwarePWMPins.FlashAll(1f, token);
            }
        }
        catch (OperationCanceledException)
        {
        }
        finally
        {
            softwarePWMPins.ForEach(pin => pin.Dispose());

            lock (_lock)
            {
                if (_currentState == LedState.Off)
                {
                    hubContext.Clients.All
                        .SendAsync("LedStatusChanged", new State(false), cancellationToken: token)
                        .Wait(token);
                }
            }
        }
    }

    private BrightnessSoftwarePWMOutputPin[] CreateSoftwarePWMPins(int frequency = 60, double dutyCycle = 0,
        bool usePrecisionTimer = false)
        => pins.Select(pin => new BrightnessSoftwarePWMOutputPin(pin, frequency, dutyCycle, usePrecisionTimer))
            .ToArray();
}