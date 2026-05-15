using Microsoft.EntityFrameworkCore;
using Financesharks.Api.Models;

namespace Financesharks.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Goal> Goals => Set<Goal>();
    public DbSet<Holding> Holdings => Set<Holding>();
    public DbSet<Budget> Budgets => Set<Budget>();
    public DbSet<FamilyHousehold> FamilyHouseholds => Set<FamilyHousehold>();
    public DbSet<FamilyMember> FamilyMembers => Set<FamilyMember>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<RefreshToken>(e =>
        {
            e.HasIndex(rt => rt.Token).IsUnique();
            e.HasOne(rt => rt.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Account>(e =>
        {
            e.HasIndex(a => a.UserId);
            e.HasOne(a => a.User)
                .WithMany(u => u.Accounts)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Transaction>(e =>
        {
            e.HasIndex(t => new { t.UserId, t.Date }).IsDescending(false, true);
            e.HasOne(t => t.User)
                .WithMany(u => u.Transactions)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(t => t.Account)
                .WithMany(a => a.Transactions)
                .HasForeignKey(t => t.AccountId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Goal>(e =>
        {
            e.HasIndex(g => g.UserId);
            e.HasOne(g => g.User)
                .WithMany(u => u.Goals)
                .HasForeignKey(g => g.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Holding>(e =>
        {
            e.HasIndex(h => h.UserId);
            e.HasOne(h => h.User)
                .WithMany(u => u.Holdings)
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Budget>(e =>
        {
            e.HasIndex(b => new { b.UserId, b.Month, b.Year });
            e.HasOne(b => b.User)
                .WithMany(u => u.Budgets)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<FamilyHousehold>(e =>
        {
            e.HasMany(fh => fh.Members)
                .WithOne(fm => fm.Household)
                .HasForeignKey(fm => fm.HouseholdId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<FamilyMember>(e =>
        {
            e.HasIndex(fm => fm.HouseholdId);
        });
    }
}
