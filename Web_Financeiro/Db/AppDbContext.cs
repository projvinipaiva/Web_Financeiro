using Microsoft.EntityFrameworkCore;
using Web_financeiro.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

   public DbSet<Pessoas> Pessoa => Set<Pessoas>();
    public DbSet<Transacao> Transacoes => Set<Transacao>();
}