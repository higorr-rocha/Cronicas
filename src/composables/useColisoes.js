import temploVerdeSrc from '../assets/Mapas/templo_verde.png';
import temploVerdeAbertoSrc from '../assets/Mapas/templo_verde_aberto.png';
import temploVerdeColetadoSrc from '../assets/Mapas/templo_verde_coletado.png';
import anelVerdeSrc from '../assets/Itens/anel_verde.png';
import temploVermelhoSrc from '../assets/Mapas/templo_vermelho.png';
import temploAzulSrc from '../assets/Mapas/templo_azul.png';
import baseSrc from '../assets/Mapas/base.png';

export function useColisoes() {
  const templos = [
    {
      id: 'templo_verde', // ID único para o templo da esquerda
      x: 135, y: 152, largura: 243, altura: 320,
      porta: { x: 135, y: 465, largura: 243, altura: 10 },
      interiorImageSrc: temploVerdeSrc,
      interiorAbertoImageSrc: temploVerdeAbertoSrc,
      interiorColetadoImageSrc: temploVerdeColetadoSrc,
      spawnPoint: { x: 620, y: 570 }, // Ponto de spawn para este interior
      interior: {
        paredes: [
          { x: 0, y: 200, largura: 15, altura: 228 }, // Parede esquerda
          { x: 0, y: 200, largura: 325, altura: 48 }, // Parede esquerda
          { x: 0, y: 370, largura: 325, altura: 60 }, // Parede esquerda
          { x: 940, y: 200, largura: 390, altura: 45 }, // Parede direita
          { x: 940, y: 375, largura: 390, altura: 45 }, // Parede direita
          { x: 1265, y: 200, largura: 15, altura: 230 }, // Parede direita
          { x: 445, y: 0, largura: 375, altura: 60 }, // Parede de cima
          { x: 445, y: 0, largura: 15, altura: 170 }, // Parede de cima esquerda
          { x: 805, y: 0, largura: 15, altura: 170 }, // Parede de cima direita
          { x: 325, y: 165, largura: 275, altura: 60 }, // Parede esquerda
          { x: 665, y: 165, largura: 275, altura: 60 }, // Parede direita
          { x: 325, y: 385, largura: 275, altura: 60 }, // Parede esquerda
          { x: 665, y: 385, largura: 275, altura: 60 }, // Parede esquerda
          { x: 445, y: 385, largura: 15, altura: 300 }, // Parede de baixo esquerda
          { x: 805, y: 385, largura: 15, altura: 300 }, // Parede de baixo esquerda
          { x: 445, y: 640, largura: 150, altura: 90 }, // Parede de baixo
          { x: 665, y: 640, largura: 155, altura: 90 }, // Parede de baixo

        ],
        saida: { x: 595, y: 640, largura: 70, altura: 10 }, // Porta de saída
        puzzle: {
          portaFinal: { x: 600, y: 215, largura: 65, altura: 10 },
          botoes: [
            // Botões do chão
            { id: 'btn_chao_1', x: 534, y: 519, largura: 25, altura: 15 },
            { id: 'btn_chao_2', x: 705, y: 519, largura: 25, altura: 15 },
            { id: 'btn_chao_3', x: 1045, y: 300, largura: 25, altura: 15 },
            { id: 'btn_chao_4', x: 1115, y: 300, largura: 25, altura: 15 },
            // Botões da parede
            { id: 'btn_parede_1', x: 56, y: 246, largura: 24, altura: 12 },
            { id: 'btn_parede_2', x: 132, y: 246, largura: 8, altura: 12 },
            { id: 'btn_parede_3', x: 166, y: 246, largura: 8, altura: 12 },
            { id: 'btn_parede_4', x: 201, y: 246, largura: 8, altura: 12 },
            { id: 'btn_parede_5', x: 234, y: 246, largura: 8, altura: 12 },
            { id: 'btn_parede_6', x: 269, y: 246, largura: 8, altura: 12 },
            { id: 'btn_parede_7', x: 1080, y: 248, largura: 24, altura: 12 },
          ],
          artefato: {
            id: 'anel_verde',
            x: 635,
            y: 96,
            largura: 25,
            altura: 20,
            hudImageSrc: anelVerdeSrc // Imagem que aparecerá na HUD
          }
        }
      }
    },
    {
      id: 'templo_vermelho', // ID único para o templo do meio
      x: 535, y: 18, largura: 243, altura: 320,
      porta: { x: 535, y: 330, largura: 243, altura: 10 },
      interiorImageSrc: temploVermelhoSrc,
      spawnPoint: { x: 620, y: 570 },
      interior: {
        paredes: [
          // Adicione as paredes do templo vermelho aqui. Ex:
          { x: 640, y: 0, largura: 500, altura: 150 },
        ],
        saida: { x: 600, y: 650, largura: 80, altura: 10 }
      }
    },
    {
      id: 'templo_azul', // ID único para o templo da direita
      x: 955, y: 135, largura: 243, altura: 320,
      porta: { x: 955, y: 445, largura: 243, altura: 10 },
      interiorImageSrc: temploAzulSrc,
      spawnPoint: { x: 700, y: 600 },
      interior: {
        paredes: [
          // Adicione as paredes do templo azul aqui. Ex:
          { x: 640, y: 0, largura: 150, altura: 720 },
        ],
        saida: { x: 600, y: 650, largura: 80, altura: 10 }
      }
    },
  ];

  const aviao = {
    id: 'aviao', // Adiciona um ID para o avião
    x: 290, y: 603, largura: 85, altura: 70,
    porta: { x: 290, y: 603, largura: 8, altura: 70 },
    spawnPoint: { x: 860, y: 570 } // Ponto de spawn na base
  };

  const mapaBase = {
    id: 'base',
    interiorImageSrc: baseSrc,
    paredes: [
      { x: 160, y: 330, largura: 225, altura: 115 },    // Prédio principal
      { x: 60, y: 285, largura: 555, altura: 30 },      // Cerca de cima
      { x: 60, y: 615, largura: 555, altura: 30 },      // Cerca de baixo
      { x: 60, y: 285, largura: 5, altura: 385 },      // Portão de trás
      { x: 610, y: 285, largura: 5, altura: 155 },      // Portão de entrada de cima
      { x: 610, y: 515, largura: 5, altura: 155 },      // Portão de entrada de baixo
      { x: 900, y: 563, largura: 115, altura: 105 },    // Avião
    ],
    saida: { x: 900, y: 590, largura: 10, altura: 50 }
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
    
    // Agora verifica a porta do avião
    if (retangulosColidem(retangulo, aviao.porta)) return aviao;

    return null;
  }

  return {
    templos,
    aviao,
    mapaBase,
    retangulosColidem,
    verificaColisaoTemplos,
    verificaColisaoAviao,
    verificaColisaoPorta,
  };
}