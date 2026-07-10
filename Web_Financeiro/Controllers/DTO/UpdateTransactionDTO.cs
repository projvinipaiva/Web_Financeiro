using Web_financeiro.Models.Enum;

public class UpdateTransactionDTO
{
    public string Descricao { get; set; } = "";

    public decimal Valor { get; set; }

    public TipoTransacao Tipo { get; set; }

    public int PessoaId { get; set; }

    public DateTime Data { get; set; }
}