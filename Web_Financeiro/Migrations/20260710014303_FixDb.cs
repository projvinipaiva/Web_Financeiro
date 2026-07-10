using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Web_financeiro.Migrations
{
    /// <inheritdoc />
    public partial class FixDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transacoes_Pessoa_PessoaId",
                table: "Transacoes");

            migrationBuilder.DropIndex(
                name: "IX_Transacoes_PessoaId",
                table: "Transacoes");

            migrationBuilder.AddColumn<DateTime>(
                name: "Data",
                table: "Transacoes",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "PessoasId",
                table: "Transacoes",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transacoes_PessoasId",
                table: "Transacoes",
                column: "PessoasId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transacoes_Pessoa_PessoasId",
                table: "Transacoes",
                column: "PessoasId",
                principalTable: "Pessoa",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transacoes_Pessoa_PessoasId",
                table: "Transacoes");

            migrationBuilder.DropIndex(
                name: "IX_Transacoes_PessoasId",
                table: "Transacoes");

            migrationBuilder.DropColumn(
                name: "Data",
                table: "Transacoes");

            migrationBuilder.DropColumn(
                name: "PessoasId",
                table: "Transacoes");

            migrationBuilder.CreateIndex(
                name: "IX_Transacoes_PessoaId",
                table: "Transacoes",
                column: "PessoaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transacoes_Pessoa_PessoaId",
                table: "Transacoes",
                column: "PessoaId",
                principalTable: "Pessoa",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
