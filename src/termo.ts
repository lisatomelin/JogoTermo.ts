export enum AvaliacaoLetraEnum {
  Correta,
  PosicaoIncorreta,
  Inexistente,
}

export class Termo {
palavraSecreta: string = "";
tentativas: number = 0;
mensagemFinal: string;

constructor() {
  this.palavraSecreta = this.obterPalavraAleatoria();
}

public avaliar(palavra: string): AvaliacaoLetraEnum[] | null{
  if (palavra.length !== 5)
    return null; 

  this.tentativas++;

  const avaliacoes: AvaliacaoLetraEnum[] = new Array(palavra.length);

  for (let i = 0; i < palavra.length; i++) {
    if (palavra[i] === this.palavraSecreta[i])
      avaliacoes[i] = AvaliacaoLetraEnum.Correta;
    else if (this.palavraSecreta.includes(palavra[i]))
      avaliacoes[i] = AvaliacaoLetraEnum.PosicaoIncorreta;
    else avaliacoes[i] = AvaliacaoLetraEnum.Inexistente;
  }

  if (avaliacoes.every( a => a === AvaliacaoLetraEnum.Correta)){
    this.mensagemFinal = 'Você acertou a palavra' + this.palavraSecreta + 'parabéns!!!';
  } else if (this.jogadorPerdeu()) {
    this.mensagemFinal = 'Você perdeu! A palavra secreta era: '  + this.palavraSecreta +  ' Não desista e tente novamente...';
  }

  return avaliacoes;
}

public jogadorAcertou(palavra: string): boolean {
  return palavra === this.palavraSecreta;
}

public jogadorPerdeu(): boolean {
  return this.tentativas === 5;
}

private obterPalavraAleatoria(): string {
  const palavras: string[] = [
    "ABRIR",
    "AMIGO",
    "BEBER",
    "BOLDO",
    "CAIXA",
    "CASAL",
    "CORPO",
    "DEDOS",
    "DENTE",
    "DIZER",
    "ERROS",
    "FALAR",
    "FESTA",
    "FOGAO",
    "GANHO",
    "GIRAR",
    "GRITO",
    "HORAS",
    "JOGOS",
    "JULHO",
    "LIMAO",
    "LOUCO",
    "MACAS",
    "MAIOR",
    "MELAO",
    "MOLHO",
  ];

  const indiceAleatorio: number = Math.floor(Math.random() * palavras.length);

  return palavras[indiceAleatorio];
}
}