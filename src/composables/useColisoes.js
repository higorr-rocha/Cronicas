import temploVerdeSrc from '../assets/Mapas/templo_verde.png';
import temploVerdeAbertoSrc from '../assets/Mapas/templo_verde_aberto.png';
import temploVerdeColetadoSrc from '../assets/Mapas/templo_verde_coletado.png';
import anelVerdeSrc from '../assets/Itens/anel_verde.png';
import temploVermelhoSrc from '../assets/Mapas/templo_vermelho.png';
import temploVermelhoAbertoSrc from '../assets/Mapas/templo_vermelho_aberto.png';
import temploVermelhoColetadoSrc from '../assets/Mapas/templo_vermelho_coletado.png';
import anelVermelhoSrc from '../assets/Itens/anel_vermelho.png';
import temploAzulSrc from '../assets/Mapas/templo_azul.png';
import temploAzulColetadoSrc from '../assets/Mapas/templo_azul_coletado.png';
import anelAzulSrc from '../assets/Itens/anel_azul.png';
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
        artefato: {
          id: 'anel_verde',
          x: 635,
          y: 96,
          largura: 25,
          altura: 20,
          hudImageSrc: anelVerdeSrc // Imagem que aparecerá na HUD
        },
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
          sequencia: ['btn_chao_1', 'btn_chao_3', 'btn_parede_1', 'btn_parede_4', 'btn_parede_2', 'btn_chao_2', 'btn_parede_3', 'btn_parede_6', 'btn_chao_4', 'btn_parede_5', 'btn_parede_7'],
        }
      }
    },
    {
      id: 'templo_vermelho', // ID único para o templo do meio
      x: 535, y: 18, largura: 243, altura: 320,
      porta: { x: 535, y: 330, largura: 243, altura: 10 },
      interiorImageSrc: temploVermelhoSrc,
      interiorAbertoImageSrc: temploVermelhoAbertoSrc,
      interiorColetadoImageSrc: temploVermelhoColetadoSrc,
      spawnPoint: { x: 620, y: 570 },
      interior: {
        paredes: [
          { x: 430, y: 0, largura: 465, altura: 55 },
          { x: 0, y: 265, largura: 430, altura: 55 },
          { x: 0, y: 475, largura: 426, altura: 10 },
          { x: 0, y: 265, largura: 20, altura: 215 },
          { x: 445, y: 225, largura: 175, altura: 70 },
          { x: 703, y: 225, largura: 173, altura: 70 },
          { x: 895, y: 265, largura: 365, altura: 55 },
          { x: 895, y: 475, largura: 365, altura: 10 },
          { x: 1260, y: 265, largura: 20, altura: 216 },
          { x: 428, y: 4, largura: 20, altura: 350 },
          { x: 875, y: 4, largura: 20, altura: 350 },
          { x: 428, y: 450, largura: 20, altura: 250 },
          { x: 875, y: 450, largura: 20, altura: 250 },
          { x: 445, y: 510, largura: 175, altura: 55 },
          { x: 703, y: 510, largura: 173, altura: 55 },
          { x: 445, y: 700, largura: 170, altura: 8 },
          { x: 703, y: 700, largura: 170, altura: 8 },
        ],
        saida: { x: 620, y: 700, largura: 85, altura: 10 },
        artefato: {
          id: 'anel_vermelho',
          x: 650,
          y: 140,
          largura: 25,
          altura: 20,
          hudImageSrc: anelVermelhoSrc
        },
        papel: {
          id: 'papel_enigma_2',
          x: 195,
          y: 400,
          largura: 40,
          altura: 25,
        },
        puzzle: {
          portaFinal: { x: 0, y: 0, largura: 65, altura: 10 },
          botoes: [
            // Botões do chão
            { id: 'btn_janela', x: 500, y: 110, largura: 25, altura: 20 },
            { id: 'btn_estrela', x: 500, y: 170, largura: 25, altura: 20 },
            { id: 'btn_sol', x: 799, y: 110, largura: 25, altura: 20 },
            { id: 'btn_arvore', x: 1184, y: 435, largura: 25, altura: 20 },
            { id: 'btn_lua', x: 1184, y: 374, largura: 25, altura: 20 },
          ],
          sequencia: ['btn_sol', 'btn_arvore', 'btn_janela', 'btn_estrela', 'btn_lua'],
        }
      }
    },
    {
      id: 'templo_azul', // ID único para o templo da direita
      x: 955, y: 135, largura: 243, altura: 320,
      porta: { x: 955, y: 445, largura: 243, altura: 10 },
      interiorImageSrc: temploAzulSrc,
      interiorColetadoImageSrc: temploAzulColetadoSrc,
      spawnPoint: { x: 700, y: 600 },
      interior: {
        paredes: [
          { x: 469, y: 535, largura: 314, altura: 10 },
          { x: 155, y: 478, largura: 500, altura: 5 },
          { x: 28, y: 600, largura: 660, altura: 10 },
          { x: 310, y: 359, largura: 155, altura: 5 },
          { x: 750, y: 600, largura: 500, altura: 10 },
          { x: 0, y: 416, largura: 185, altura: 5 },
          { x: 625, y: 418, largura: 340, altura: 5 },
          { x: 0, y: 235, largura: 185, altura: 5 },
          { x: 155, y: 295, largura: 315, altura: 5 },
          { x: 155, y: 178, largura: 655, altura: 5 },
          { x: 5, y: 117, largura: 650, altura: 5 },
          { x: 780, y: 117, largura: 472, altura: 5 },
          { x: 468, y: 238, largura: 500, altura: 5 },
          { x: 810, y: 298, largura: 157, altura: 5 },
          { x: 938, y: 359, largura: 157, altura: 5 },
          { x: 938, y: 479, largura: 157, altura: 5 },
          { x: 938, y: 177, largura: 185, altura: 5 },
          { x: 1095, y: 420, largura: 157, altura: 5 },
          { x: 0, y: 115, largura: 30, altura: 495 },
          { x: 1250, y: 115, largura: 30, altura: 495 },
          { x: 468, y: 240, largura: 30, altura: 180 },
          { x: 155, y: 295, largura: 30, altura: 115 },
          { x: 312, y: 360, largura: 30, altura: 65 },
          { x: 312, y: 480, largura: 30, altura: 120 },
          { x: 155, y: 480, largura: 30, altura: 65 },
          { x: 312, y: 180, largura: 30, altura: 60 },
          { x: 625, y: 295, largura: 30, altura: 120 },
          { x: 782, y: 245, largura: 30, altura: 115 },
          { x: 782, y: 420, largura: 30, altura: 180 },
          { x: 782, y: 120, largura: 30, altura: 65 },
          { x: 1095, y: 235, largura: 30, altura: 130 },
          { x: 938, y: 360, largura: 30, altura: 65 },
          { x: 938, y: 483, largura: 30, altura: 65 },
          { x: 938, y: 180, largura: 30, altura: 65 },
          { x: 1095, y: 420, largura: 30, altura: 65 },
          { x: 1095, y: 540, largura: 30, altura: 65 },
        ],
        saida: { x: 686, y: 680, largura: 63, altura: 10 },
        artefato: {
          id: 'anel_azul',
          x: 706,
          y: 73,
          largura: 27,
          altura: 20,
          hudImageSrc: anelAzulSrc // Imagem que aparecerá na HUD
        }
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