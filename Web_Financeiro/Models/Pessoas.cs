namespace Web_financeiro.Models
{
   public class Pessoas
    {
        public int Id { get; set; }

        public string Nome { get; set; }

        public int Idade { get; set; }

        public List<Transacao> Transacoes { get; set; } = [];

        public Pessoas(string Nome, int Idade, int Id)
        {
            this.Id = Id;
            this.Nome = Nome;
            this.Idade = Idade;
        }
    }
}
