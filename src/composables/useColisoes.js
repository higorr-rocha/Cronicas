import temploVerdeSrc from '../assets/Mapas/templo_verde.png';
import temploVermelhoSrc from '../assets/Mapas/templo_vermelho.png';
import temploAzulSrc from '../assets/Mapas/templo_azul.png';

export function useColisoes() {
  const templos = [
    {
      id: 'templo_verde', // ID único para o templo da esquerda
      x: 135, y: 152, largura: 243, altura: 320,
      porta: { x: 135, y: 465, largura: 243, altura: 10 },
      interiorImageSrc: temploVerdeSrc,
      spawnPoint: { x: 745, y: 680 }, // Ponto de spawn para este interior
      interior: {
        paredes: [
          { x: 0, y: 240, largura: 20, altura: 275 }, // Parede esquerda
          { x: 0, y: 240, largura: 390, altura: 60 }, // Parede esquerda
          { x: 0, y: 440, largura: 390, altura: 60 }, // Parede esquerda
          { x: 1125, y: 240, largura: 390, altura: 60 }, // Parede direita
          { x: 1125, y: 440, largura: 390, altura: 60 }, // Parede direita
          { x: 1519, y: 240, largura: 20, altura: 275 }, // Parede direita
          { x: 535, y: 0, largura: 445, altura: 60 }, // Parede de cima
          { x: 535, y: 0, largura: 18, altura: 205 }, // Parede de cima esquerda
          { x: 965, y: 0, largura: 18, altura: 205 }, // Parede de cima direita
          { x: 395, y: 200, largura: 325, altura: 93 }, // Parede esquerda
          { x: 800, y: 200, largura: 325, altura: 93 }, // Parede esquerda
          { x: 395, y: 460, largura: 325, altura: 95 }, // Parede esquerda
          { x: 800, y: 460, largura: 325, altura: 95 }, // Parede esquerda
          { x: 535, y: 470, largura: 18, altura: 395 }, // Parede de baixo esquerda
          { x: 965, y: 470, largura: 18, altura: 395 }, // Parede de baixo esquerda
          { x: 550, y: 770, largura: 170, altura: 90 }, // Parede de baixo
          { x: 800, y: 770, largura: 165, altura: 90 }, // Parede de baixo

        ],
        saida: { x: 720, y: 770, largura: 80, altura: 10 } // Porta de saída
      }
    },
    {
      id: 'templo_vermelho', // ID único para o templo do meio
      x: 641, y: 20, largura: 294, altura: 380,
      porta: { x: 641, y: 400, largura: 294, altura: 10 },
      interiorImageSrc: temploVermelhoSrc,
      spawnPoint: { x: 745, y: 680 },
      // INTERIOR DO TEMPLO VERMELHO
    },
    {
      id: 'templo_azul', // ID único para o templo da direita
      x: 1145, y: 161, largura: 294, altura: 380,
      porta: { x: 1145, y: 535, largura: 294, altura: 10 },
      interiorImageSrc: temploAzulSrc,
      spawnPoint: { x: 745, y: 700 },
      // INTERIOR DO TEMPLO AZUL
    },
  ];

  const aviao = {
    x: 350, y: 725, largura: 99, altura: 83,
    porta: { x: 350, y: 725, largura: 8, altura: 83, },
  };

  function retangulosColidem(r1, r2) {
    return !(
      r1.x + r1.largura < r2.x ||
      r1.x > r2.x + r2.largura ||
      r1.y + r1.altura < r2.y ||
      r1.y > r2.y + r2.altura
    );
  }

  function verificaColisaoTemplos(retangulo) {
    return templos.some(templo => retangulosColidem(retangulo, templo));
  }

  function verificaColisaoAviao(retangulo) {
    return retangulosColidem(retangulo, aviao);
  }

  function verificaColisaoPorta(retangulo) {
    const temploComPorta = templos.find(templo => retangulosColidem(retangulo, templo.porta));
    if (temploComPorta) return temploComPorta;

    if (retangulosColidem(retangulo, aviao.porta)) return aviao;

    return null;
  }

  return {
    templos,
    aviao,
    retangulosColidem,
    verificaColisaoTemplos,
    verificaColisaoAviao,
    verificaColisaoPorta,
  };
}
