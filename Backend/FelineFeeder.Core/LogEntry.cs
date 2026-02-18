namespace FelineFeeder.Core;

public record LogEntry(
    int Id,
    DateTime? TimeStamp,
    string? Level,
    string? Exception,
    string? RenderedMessage,
    string? Properties
);