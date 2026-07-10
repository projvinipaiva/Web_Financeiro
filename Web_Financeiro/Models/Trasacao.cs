using Web_financeiro.Models.Enum;

namespace Web_financeiro.Models
{
    public class Transacao
    {
        public int Id { get; set; }

        public string Descricao { get; set; } = "";

        public decimal Valor { get; set; }

        public TipoTransacao Tipo { get; set; }

        public int PessoaId { get; set; }

        public DateTime Data { get; set; }
    }
}