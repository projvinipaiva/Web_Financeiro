using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_financeiro.Controllers.DTO;
using Web_financeiro.Models;
using Web_financeiro.Models.Enum;

namespace Web_financeiro.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TransacaoController : ControllerBase
    {
        private readonly AppDbContext _db;

        public TransacaoController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<List<Transacao>>> Get()
        {
            return await _db.Transacoes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<List<Transacao>>> Get(int id)
        {
            return await _db.Transacoes.Where(t => t.PessoaId == id).ToListAsync();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] UpdateTransactionDTO body)
        {
            var transacao = await _db.Transacoes.FindAsync(id);

            if (transacao == null)
            {
                return NotFound("Transação não encontrada.");
            }

            // Verifica se a pessoa existe
            var pessoa = await _db.Pessoa.FindAsync(body.PessoaId);

            if (pessoa == null)
            {
                return BadRequest("Pessoa não encontrada.");
            }

            // Menores de idade só podem possuir despesas
            if (pessoa.Idade < 18 && body.Tipo == TipoTransacao.Receita)
            {
                return BadRequest("Menores de idade só podem cadastrar despesas.");
            }

            transacao.Descricao = body.Descricao;
            transacao.Valor = body.Valor;
            transacao.Tipo = body.Tipo;
            transacao.PessoaId = body.PessoaId;
            transacao.Data = body.Data;

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            // Procura a transação pelo ID
            var transacao = await _db.Transacoes.FindAsync(id);

            if (transacao == null)
            {
                return NotFound("Transação não encontrada.");
            }

            // Remove do banco
            _db.Transacoes.Remove(transacao);

            // Salva as alterações
            await _db.SaveChangesAsync();

            return NoContent();
        }

    }

}
