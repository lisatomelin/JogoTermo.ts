import { AvaliacaoLetraEnum } from "./termo.js";
import { Termo } from "./termo.js";
export class TermoTela {
    get linhaAtual() {
        return this.divLinhasTermo[this.jogo.tentativas];
    }
    constructor() {
        this.divLinhasTermo = [];
        this.indiceColunaSelecionada = -1;
        this.jogo = new Termo();
        this.termos = new Array();
        this.termos.push(this.jogo);
        this.pnlTeclado = document.getElementById("pnlTeclado");
        this.btnEnter = document.getElementById("btnEnter");
        this.btnReiniciar = document.getElementById("btnReiniciar");
        this.btnApagar = document.getElementById("btnApagar");
        this.labelMensagemFinal = document.getElementById("labelMensagemFinal");
        this.divMensagemFinal = document.getElementById("divMensagemFinal");
        document.querySelectorAll(".linha").forEach(div => {
            this.divLinhasTermo.push(div);
        });
        this.registrarEventos();
        this.divMensagemFinal.classList.add("display-none");
    }
    reiniciarJogo() {
        this.jogo = new Termo();
        for (const linha of this.divLinhasTermo) {
            for (const coluna of linha.children) {
                coluna.textContent = '';
                coluna.classList.remove("letra-correta");
                coluna.classList.remove("letra-posicao-incorreta");
                coluna.classList.remove("letra-nao-existente");
            }
        }
        for (const botao of this.pnlTeclado.children) {
            botao.disabled = false;
        }
        this.labelMensagemFinal.textContent = '';
        this.divMensagemFinal.classList.add("display-none");
        this.indiceColunaSelecionada = -1;
    }
    apagarLetra() {
        if (this.indiceColunaSelecionada >= 0) {
            const coluna = this.linhaAtual.children[this.indiceColunaSelecionada];
            if (coluna) {
                coluna.textContent = "";
                this.indiceColunaSelecionada--;
            }
        }
    }
    avaliarPalavra() {
        const linha = this.jogo.tentativas;
        const palavraCompleta = this.obterPalavra();
        let avaliacoes;
        avaliacoes = this.jogo.avaliar(palavraCompleta);
        if (avaliacoes === null)
            return;
        const jogadorAcertou = this.jogo.jogadorAcertou(palavraCompleta);
        const jogadorPerdeu = this.jogo.jogadorPerdeu();
        this.colorirColunas(linha, avaliacoes);
        if (jogadorPerdeu) {
            this.labelMensagemFinal.classList.add("jogador-perdeu");
        }
        else {
            this.labelMensagemFinal.classList.add("jogador-ganhou");
        }
        if (jogadorAcertou || jogadorPerdeu) {
            this.labelMensagemFinal.textContent = this.jogo.mensagemFinal;
            for (const botao of this.pnlTeclado.children) {
                if (botao.textContent === "Reiniciar")
                    continue;
                botao.disabled = true;
            }
            this.divMensagemFinal.classList.remove("display-none");
        }
        this.indiceColunaSelecionada = -1;
    }
    registrarEventos() {
        for (const botao of this.pnlTeclado.children) {
            if (botao.textContent === "Enter" || botao.textContent === "Reiniciar" || botao.textContent === "<")
                continue;
            botao.addEventListener("click", this.digitarLetra.bind(this));
        }
        this.btnEnter.addEventListener("click", this.avaliarPalavra.bind(this));
        this.btnReiniciar.addEventListener("click", this.reiniciarJogo.bind(this));
        this.btnApagar.addEventListener("click", this.apagarLetra.bind(this));
    }
    colorirColunas(indiceLinha, avaliacoes) {
        for (let indiceColuna = 0; indiceColuna < avaliacoes.length; indiceColuna++) {
            const divSelecionado = this.divLinhasTermo[indiceLinha].children[indiceColuna];
            switch (avaliacoes[indiceColuna]) {
                case AvaliacaoLetraEnum.Correta:
                    divSelecionado.classList.add("letra-correta");
                    break;
                case AvaliacaoLetraEnum.PosicaoIncorreta:
                    divSelecionado.classList.add("letra-posicao-incorreta");
                    break;
                case AvaliacaoLetraEnum.Inexistente:
                    divSelecionado.classList.add("letra-nao-existente");
                    break;
            }
        }
    }
    obterPalavra() {
        let palavra = '';
        for (let coluna = 0; coluna < 5; coluna++) {
            palavra += this.linhaAtual.children[coluna].innerText;
        }
        return palavra;
    }
    digitarLetra(event) {
        if (this.indiceColunaSelecionada > 3 || this.indiceColunaSelecionada < -1)
            return;
        const letra = event.target.textContent;
        this.indiceColunaSelecionada++;
        const coluna = this.linhaAtual.children[this.indiceColunaSelecionada];
        coluna.textContent = letra;
    }
}
window.addEventListener("load", () => new TermoTela());
//# sourceMappingURL=tela-termo.js.map