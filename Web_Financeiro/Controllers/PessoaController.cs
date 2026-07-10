using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_financeiro.Controllers.DTO;
using Web_financeiro.Models;
using Web_financeiro.Models.Enum;

namespace Web_financeiro.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PessoaController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PessoaController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<List<Pessoas>>> Get()
        {
            var pessoas = await _db.Pessoa
                                     .Include(p => p.Transacoes)
                                     .ToListAsync();
            var transacoes = await _db.Transacoes.ToListAsync();
            foreach (var pessoa in pessoas)
            {
                foreach (var transacao in transacoes)
                {
                    if (transacao.PessoaId == pessoa.Id)
                    {
                        pessoa.Transacoes.Add(transacao);
                    }
                }
            }
            return Ok(pessoas);
        }
        [HttpGet("totais")]
        public IActionResult GetTotais()
        {
            var Pessoas = _db.Pessoa.ToList();

            var resultado = Pessoas.Select(p =>
            {
                var receitas = _db.Transacoes
                    .Where(t => t.PessoaId == p.Id && t.Tipo == TipoTransacao.Receita)
                    .Sum(t => (decimal?)t.Valor) ?? 0;

                var despesas = _db.Transacoes
                    .Where(t => t.PessoaId == p.Id && t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => (decimal?)t.Valor) ?? 0;

                return new
                {
                    Pessoa = p.Nome,
                    TotalReceitas = receitas,
                    TotalDespesas = despesas,
                    Saldo = receitas - despesas
                };
            }).ToList();

            var totalReceitas = resultado.Sum(x => x.TotalReceitas);
            var totalDespesas = resultado.Sum(x => x.TotalDespesas);

            return Ok(new
            {
                Pessoas = resultado,
                TotalGeralReceitas = totalReceitas,
                TotalGeralDespesas = totalDespesas,
                SaldoLiquido = totalReceitas - totalDespesas
            });
        }

        [HttpPost]
        public async Task<ActionResult<Pessoas>> Post([FromBody] Pessoas body)
        {
            _db.Pessoa.Add(body);
            await _db.SaveChangesAsync();

            return Created();
        }

        [HttpPost("{id}/transacoes")]
        public async Task<ActionResult> CreateTransaction(int id, [FromBody] TransactionDTO Transacao)
        {
            var Pessoas = await _db.Pessoa.FindAsync(id);
            if (Pessoas == null)
            {
                Console.WriteLine(Pessoas);
                return NotFound("Usuario não encontrado");
            }

            if (Pessoas.Idade < 18 && Transacao.TipoTransacao != TipoTransacao.Despesa)
            {
                return BadRequest("Apenas pessoas maiores de 18 anos podem cadastrar transações do tipo RECEITA");
            }
            var t = new Transacao();
            t.Descricao = Transacao.Descricao;
            t.Tipo = TipoTransacao.Receita;
            t.Valor = Transacao.Valor;
            t.PessoaId = Pessoas.Id;
            t.Data = Transacao.Data;
            await _db.Transacoes.AddAsync(t);
            await _db.SaveChangesAsync();
            return Created();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var Pessoas = await _db.Pessoa.FindAsync(id);
            _db.Transacoes.RemoveRange(_db.Transacoes.Where(t => t.PessoaId == id));
            if (Pessoas == null)
            {
                return NotFound();
            }
            _db.Pessoa.Remove(Pessoas);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] PessoaDTO body)
        {
            var Pessoas = await _db.Pessoa.FindAsync(id);

            if (Pessoas == null)
            {
                return NotFound("Pessoa não encontrada.");
            }

            Pessoas.Nome = body.Nome;
            Pessoas.Idade = body.Idade;

            await _db.SaveChangesAsync();

            return NoContent();
        }

    }
}