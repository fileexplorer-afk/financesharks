using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Financesharks.Api.Auth;
using Financesharks.Api.Data;
using Financesharks.Api.Middleware;
using Financesharks.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ─── Validate required config at startup ──────────────────────────────────────
var jwtSecret = builder.Configuration["JwtSettings:Secret"]
    ?? throw new InvalidOperationException("JWT Secret is not configured. Set JwtSettings:Secret via user-secrets or env vars.");

var connectionString = builder.Configuration.GetConnectionString("Supabase");
if (string.IsNullOrWhiteSpace(connectionString))
    throw new InvalidOperationException("Database connection string is not configured. Set ConnectionStrings:Supabase via user-secrets or env vars.");

// ─── Database ──────────────────────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString, o =>
    {
        o.CommandTimeout(120);
        o.EnableRetryOnFailure(2, TimeSpan.FromSeconds(10), null);
    }));

// ─── Auth ──────────────────────────────────────────────────────────────────────
var jwtSection = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSection);
var jwtIssuer = jwtSection["Issuer"] ?? "Financesharks.Api";
var jwtAudience = jwtSection["Audience"] ?? "Financesharks.App";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ClockSkew = TimeSpan.Zero,
    };
});

builder.Services.AddAuthorization();

// ─── Services ──────────────────────────────────────────────────────────────────
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<IGoalService, GoalService>();
builder.Services.AddScoped<IHoldingService, HoldingService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IFamilyService, FamilyService>();
builder.Services.AddScoped<IBudgetService, BudgetService>();
builder.Services.AddScoped<IInsightService, InsightService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// ─── Controllers & Swagger ────────────────────────────────────────────────────
builder.Services.AddControllers(options =>
{
    options.MaxModelValidationErrors = 5;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ─── CORS ──────────────────────────────────────────────────────────────────────
var corsOrigins = (builder.Configuration["CORS_ORIGINS"] ?? "http://localhost:5173,http://localhost:3000")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(corsOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
    });
});

var app = builder.Build();

// ─── Security middleware ───────────────────────────────────────────────────────
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["X-XSS-Protection"] = "0";
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    context.Response.Headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
    await next();
});

app.UseMiddleware<RateLimitingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ─── Seed admin user on startup ──────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var adminEmail = builder.Configuration["AdminEmail"];
    if (!string.IsNullOrWhiteSpace(adminEmail))
    {
        var admin = await db.Users.FirstOrDefaultAsync(u => u.Email == adminEmail);
        if (admin != null && admin.Role != "admin")
        {
            admin.Role = "admin";
            await db.SaveChangesAsync();
        }
    }
}

app.Run();
