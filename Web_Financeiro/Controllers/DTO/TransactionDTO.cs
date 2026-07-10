using Web_financeiro.Models.Enum;

namespace Web_financeiro.Controllers.DTO
{
    public class TransactionDTO
    {
        public required string Descricao { get; set; }

        public decimal Valor { get; set; }

        public TipoTransacao TipoTransacao { get; set; }

        public DateTime Data { get; set; }
    }
}