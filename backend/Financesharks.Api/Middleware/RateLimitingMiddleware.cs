using System.Collections.Concurrent;

namespace Financesharks.Api.Middleware;

public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ConcurrentDictionary<string, RateLimitEntry> _clients = new();
    private readonly int _maxRequests;
    private readonly TimeSpan _window;

    public RateLimitingMiddleware(RequestDelegate next, int maxRequests = 60, int windowSeconds = 60)
    {
        _next = next;
        _maxRequests = maxRequests;
        _window = TimeSpan.FromSeconds(windowSeconds);
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/api/auth"))
        {
            var clientKey = GetClientKey(context);
            var entry = _clients.GetOrAdd(clientKey, _ => new RateLimitEntry { Count = 0, WindowStart = DateTime.UtcNow });

            lock (entry)
            {
                if (DateTime.UtcNow - entry.WindowStart > _window)
                {
                    entry.Count = 0;
                    entry.WindowStart = DateTime.UtcNow;
                }

                entry.Count++;

                if (entry.Count > _maxRequests)
                {
                    context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                    context.Response.Headers["Retry-After"] = _window.TotalSeconds.ToString();
                    return;
                }
            }
        }

        await _next(context);
    }

    private static string GetClientKey(HttpContext context)
    {
        var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwardedFor))
            return forwardedFor.Split(',')[0].Trim();

        return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }

    private class RateLimitEntry
    {
        public int Count { get; set; }
        public DateTime WindowStart { get; set; }
    }
}
