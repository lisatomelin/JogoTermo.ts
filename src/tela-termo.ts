import { AvaliacaoLetraEnum } from "./termo.js";
import { Termo } from "./termo.js";

export class TermoTela{
  
  private jogo: Termo;
  
  private pnlTeclado: HTMLDivElement; 
  
  private btnEnter: HTMLButtonElement; 
  private btnReiniciar : HTMLButtonElement;
  private btnApagar : HTMLButtonElement;

  private divMensagemFinal : HTMLDivElement;
  private labelMensagemFinal: HTMLLabelElement;

  private divLinhasTermo : HTMLDivElement[] = [];

  private indiceColunaSelecionada : number = -1;

  private termos : Termo[];

  private get linhaAtual() : HTMLDivElement {
    return this.divLinhasTermo[this.jogo.tentativas];
  }

  constructor() {

    this.jogo = new Termo();

    this.termos = new Array<Termo>();

    this.termos.push(this.jogo);

    this.pnlTeclado = document.getElementById("pnlTeclado") as HTMLDivElement;    
    this.btnEnter = document.getElementById("btnEnter") as HTMLButtonElement; 
    this.btnReiniciar = document.getElementById("btnReiniciar") as HTMLButtonElement; 
    this.btnApagar = document.getElementById("btnApagar") as HTMLButtonElement; 
    this.labelMensagemFinal = document.getElementById("labelMensagemFinal") as HTMLLabelElement;  
    this.divMensagemFinal = document.getElementById("divMensagemFinal") as HTMLDivElement; 

    document.querySelectorAll(".linha").forEach( div => {
      this.divLinhasTermo.push(div as HTMLDivElement);
    });

    this.registrarEventos();

    this.divMensagemFinal.classList.add("display-none"); 
  }

  public reiniciarJogo() : void {
    this.jogo = new Termo();

    for (const linha of this.divLinhasTermo){
      for (const coluna of linha.children) {
        
        coluna.textContent = '';
        coluna.classList.remove("letra-correta");
        coluna.classList.remove("letra-posicao-incorreta");
        coluna.classList.remove("letra-nao-existente");        
      }
    }

    for (const botao of this.pnlTeclado.children) {
      (botao as HTMLButtonElement).disabled = false;
    }
       
    this.labelMensagemFinal.textContent = '';

    this.divMensagemFinal.classList.add("display-none"); 

    this.indiceColunaSelecionada = -1;
  }

  public apagarLetra() : void {
    if (this.indiceColunaSelecionada >= 0){
      const coluna = this.linhaAtual.children[this.indiceColunaSelecionada];

      if (coluna){
        coluna.textContent = "";
        this.indiceColunaSelecionada--;
      }
    }
  }

  public avaliarPalavra() : void {
    
    const linha = this.jogo.tentativas;

    const palavraCompleta = this.obterPalavra();

    let avaliacoes : AvaliacaoLetraEnum[] | null;
    avaliacoes = this.jogo.avaliar(palavraCompleta);    

    if (avaliacoes === null)
      return;

    const jogadorAcertou = this.jogo.jogadorAcertou(palavraCompleta);
    const jogadorPerdeu = this.jogo.jogadorPerdeu();

    this.colorirColunas(linha, avaliacoes);

    if (jogadorPerdeu) {
      this.labelMensagemFinal.classList.add("jogador-perdeu"); 
    } else {
      this.labelMensagemFinal.classList.add("jogador-ganhou"); 
    }

    if (jogadorAcertou || jogadorPerdeu) {
      this.labelMensagemFinal.textContent = this.jogo.mensagemFinal;

      for (const botao of this.pnlTeclado.children) {
        if (botao.textContent === "Reiniciar")
          continue;

        (botao as HTMLButtonElement).disabled = true;
      }
      
      this.divMensagemFinal.classList.remove("display-none"); 
    }

    this.indiceColunaSelecionada=-1;
  }

  private registrarEventos() {
    for (const botao of this.pnlTeclado.children) {
      
      if (botao.textContent === "Enter" || botao.textContent === "Reiniciar" || botao.textContent === "<")
        continue;

      botao.addEventListener("click", this.digitarLetra.bind(this));
    }
    
    this.btnEnter.addEventListener("click", this.avaliarPalavra.bind(this));
    this.btnReiniciar.addEventListener("click", this.reiniciarJogo.bind(this));
    this.btnApagar.addEventListener("click", this.apagarLetra.bind(this));
  }

  private colorirColunas(indiceLinha : number, avaliacoes: AvaliacaoLetraEnum[]) {

    for (let indiceColuna = 0; indiceColuna < avaliacoes.length; indiceColuna++) {

      const divSelecionado = this.divLinhasTermo[indiceLinha].children[indiceColuna] as HTMLDivElement;

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

  private obterPalavra() : string{
    let palavra = '';
    for (let coluna = 0; coluna < 5; coluna++) {
      palavra += (this.linhaAtual.children[coluna] as HTMLDivElement).innerText;
    }
    return palavra;
  }
  
  private digitarLetra(event: Event) {

    if (this.indiceColunaSelecionada > 3 || this.indiceColunaSelecionada < -1)
      return;

    const letra = (event.target as HTMLButtonElement).textContent;

    this.indiceColunaSelecionada++;
    
    const coluna = this.linhaAtual.children[this.indiceColunaSelecionada] as HTMLDivElement;
    
    coluna.textContent = letra;    
  }

}
window.addEventListener("load" , () => new TermoTela());