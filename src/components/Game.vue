<template>
  <div ref="gameContainer" class="game-container">
    <canvas
      ref="canvas"
      class="game-canvas"
      :width="gameWidth"
      :height="gameHeight"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Howl } from 'howler';
import mapSrc from '../assets/Mapas/templos.png';
import playerSrc from '../assets/player_spritesheet.png';
import passosAudio from '../assets/Sons/passos.ogg';
import { useColisoes } from '../composables/useColisoes.js';
import { usePlayer } from '../composables/usePlayer.js';
import { useTeclado } from '../composables/useTeclado.js';
import { useDialog } from '../composables/useDialog.js';
import { usePuzzle } from '../composables/usePuzzle.js';
import { useInventario } from '../composables/useInventario.js';

// Configurações do jogo
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const ASPECT_RATIO = GAME_WIDTH / GAME_HEIGHT;

// Refs
const gameContainer = ref(null);
const canvas = ref(null);
const gameWidth = ref(GAME_WIDTH);
const gameHeight = ref(GAME_HEIGHT);

// Imagens
const mapImage = new Image();
mapImage.src = mapSrc;
const interiorMapImages = {};
const hudImages = {};
const playerImage = new Image();
playerImage.src = playerSrc;

// Som de passos
const somPassos = new Howl({
  src: [passosAudio],
  volume: 0.6
});
let ultimoPasso = 0;
const intervaloPassos = 350; // milissegundos entre sons

// Sistemas
const { templos, aviao, mapaBase, retangulosColidem, verificaColisaoTemplos, verificaColisaoAviao, verificaColisaoPorta } = useColisoes();
const { player, keys, moverJogador } = usePlayer();
const currentMap = ref('base');
const { puzzleStatus, ativarBotao, podeAtivar } = usePuzzle();
const { inventario, adicionarItem, temItem } = useInventario();
const baseMapImage = new Image();
baseMapImage.src = mapaBase.interiorImageSrc;
const { dialog, abrirDialogo, processarTecla: processarTeclaDialogo } = useDialog(player, currentMap, aviao, ativarBotao, adicionarItem);
let context;
let animationFrameId = null;

inventario.value.forEach(item => {
  if (item.hudImageSrc) {
    const img = new Image();
    img.src = item.hudImageSrc;
    hudImages[item.id] = img;
  }
});

const showCollisionBoxes = ref(false); // Variável para controlar a exibição
function handleKeyPress(e) {
  // Passa o evento para o processador de diálogos
  processarTeclaDialogo(e); 

  // Adiciona a nossa nova lógica para a tecla 'c'
  if (e.key.toLowerCase() === 'c') {
    showCollisionBoxes.value = !showCollisionBoxes.value;
  }
}

// Configuração do display
function setupDisplay() {
  const updateSize = () => {
    if (!gameContainer.value || !canvas.value) return;

    const containerWidth = gameContainer.value.clientWidth;
    const containerHeight = gameContainer.value.clientHeight;

    // Mantém o aspect ratio do jogo
    let newWidth = containerWidth;
    let newHeight = Math.round(newWidth / ASPECT_RATIO);

    if (newHeight > containerHeight) {
      newHeight = containerHeight;
      newWidth = Math.round(newHeight * ASPECT_RATIO);
    }

    gameWidth.value = newWidth;
    gameHeight.value = newHeight;

    // Atualiza o canvas
    canvas.value.width = newWidth;
    canvas.value.height = newHeight;
    canvas.value.style.width = `${newWidth}px`;
    canvas.value.style.height = `${newHeight}px`;
  };

  // Event listeners
  window.addEventListener('resize', updateSize);
  document.addEventListener('fullscreenchange', updateSize);
  updateSize();

  return () => {
    window.removeEventListener('resize', updateSize);
    document.removeEventListener('fullscreenchange', updateSize);
  };
}

// Funções do jogo (mantidas conforme seu código original)
function rectFromPlayer(newX, newY) {
  return {
    x: newX + player.value.hitbox.offsetX,
    y: newY + player.value.hitbox.offsetY,
    largura: player.value.hitbox.width,
    altura: player.value.hitbox.height,
  };
}

useTeclado(keys, handleKeyPress);

function update() {
  if (!dialog.value.visible) {
    const xAnterior = player.value.x;
    const yAnterior = player.value.y;

    const { nextX, nextY } = moverJogador(keys.value);
    const boundedX = Math.max(0, Math.min(GAME_WIDTH - player.value.width, nextX));
    const boundedY = Math.max(0, Math.min(GAME_HEIGHT - player.value.height, nextY));
    const playerRect = rectFromPlayer(boundedX, boundedY);

    if (currentMap.value === 'exterior') {
      const objetoComPorta = verificaColisaoPorta(playerRect);
      if (objetoComPorta) {
        // LÓGICA CORRIGIDA AQUI
        if (objetoComPorta.id === 'aviao') {
          abrirDialogo(objetoComPorta, 'Voltar para a base?\nE - Sim   ESC - Não');
        } else {
          abrirDialogo(objetoComPorta, 'Deseja entrar?\nE - Sim   ESC - Não');
        }
      } else {
        const colidiuComBarreira = verificaColisaoTemplos(playerRect) || verificaColisaoAviao(playerRect);
        if (!colidiuComBarreira) {
          player.value.x = boundedX;
          player.value.y = boundedY;
        }
      }
    } else if (currentMap.value.startsWith('templo_')) {
        const temploAtual = templos.find(t => t.id === currentMap.value);
        
        if (temploAtual && temploAtual.interior) {
          // Destruturamos todos os possíveis elementos do interior
          const { paredes, saida, puzzle, artefato } = temploAtual.interior;
          let movimentoBloqueado = false;

          // Lógica do Puzzle (só executa se houver um puzzle)
          if (puzzle) {
            // Bloqueia a porta final se o puzzle não estiver resolvido
            if (puzzleStatus.value !== 'resolvido' && retangulosColidem(playerRect, puzzle.portaFinal)) {
              movimentoBloqueado = true;
            }
            
            // Verifica colisão com os botões
            const botaoPressionado = puzzle.botoes.find(b => retangulosColidem(playerRect, b));
            if (botaoPressionado) {
              movimentoBloqueado = true;
              if (podeAtivar(botaoPressionado.id)) {
                abrirDialogo(botaoPressionado, `Ativar o botão?\nE - Sim   ESC - Não`);
              }
            }
          }

          // Lógica do Artefato
          // Condição para poder coletar: ou não existe puzzle, ou o puzzle foi resolvido
          const podeColetar = !puzzle || puzzleStatus.value === 'resolvido';
          if (artefato && podeColetar && !temItem(artefato.id) && retangulosColidem(playerRect, artefato)) {
            movimentoBloqueado = true;
            abrirDialogo(artefato, 'Coletar Artefato?\nE - Sim   ESC - Não');
          }

          // Lógica de Saída e Paredes
          if (retangulosColidem(playerRect, saida)) {
            movimentoBloqueado = true;
            abrirDialogo({ id: 'saida', origem: temploAtual }, 'Deseja sair?\nE - Sim   ESC - Não');
          } else if (paredes.some(p => retangulosColidem(playerRect, p))) {
            movimentoBloqueado = true;
          }

          // Efetiva o movimento apenas se não estiver bloqueado
          if (!movimentoBloqueado) {
            player.value.x = boundedX;
            player.value.y = boundedY;
          }
        }
      } else if (currentMap.value === 'base') {
      const { paredes, saida } = mapaBase;
      if (retangulosColidem(playerRect, saida)) {
        abrirDialogo('saida_base', 'Deseja ir para os templos?\nE - Sim   ESC - Não');
      } else {
        const colidiuComParede = paredes.some(p => retangulosColidem(playerRect, p));
        if (!colidiuComParede) {
          player.value.x = boundedX;
          player.value.y = boundedY;
        }
      }
    }

    // Lógica de som de passos
    const realmenteMoveu = player.value.x !== xAnterior || player.value.y !== yAnterior;
    const agora = Date.now();
    if (realmenteMoveu && agora - ultimoPasso > intervaloPassos) {
      somPassos.play();
      ultimoPasso = agora;
    }
  }
}

function draw() {
  const scaleX = gameWidth.value / GAME_WIDTH;
  const scaleY = gameHeight.value / GAME_HEIGHT;

  // Salva o estado do canvas (sem escala)
  context.save();

  // Aplica a escala a TODO o canvas
  context.scale(scaleX, scaleY);

  // A partir daqui, tudo é desenhado usando as coordenadas do "mundo" (1280x720)
  // e será automaticamente escalado para a tela.
  
  context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // 1. Desenha o mapa de fundo no tamanho original do mundo
  let currentMapImage;
  if (currentMap.value === 'exterior') {
    currentMapImage = mapImage;
  } else if (currentMap.value === 'base') {
    currentMapImage = baseMapImage;
  } else {
    const temploAtual = templos.find(t => t.id === currentMap.value); 
    if (temploAtual) {
      const artefatoId = temploAtual.interior?.artefato?.id;

      if (artefatoId && temItem(artefatoId) && interiorMapImages[`${temploAtual.id}_coletado`]) {
        currentMapImage = interiorMapImages[`${temploAtual.id}_coletado`];
      } else if (puzzleStatus.value === 'resolvido' && interiorMapImages[`${temploAtual.id}_aberto`]) {
        currentMapImage = interiorMapImages[`${temploAtual.id}_aberto`];
      } else {
        currentMapImage = interiorMapImages[temploAtual.id];
      }
    }
  }

  if (currentMapImage && currentMapImage.complete) {
    context.drawImage(currentMapImage, 0, 0, GAME_WIDTH, GAME_HEIGHT);
  }

  // 2. Desenha o jogador usando as coordenadas do mundo
  const frameWidth = playerImage.width / player.value.frameCount;
  const frameHeight = playerImage.height / 4;
  context.drawImage(
    playerImage,
    frameWidth * player.value.frameIndex,
    frameHeight * player.value.direction,
    frameWidth, frameHeight,
    player.value.x,
    player.value.y,
    player.value.width,
    player.value.height
  );

  // 3. Desenha as caixas de colisão de depuração (se ativadas)
  if (showCollisionBoxes.value) {
    // Não precisamos mais multiplicar pela escala aqui, pois o canvas já está escalado
    const { aviao } = useColisoes();
    context.lineWidth = 2 / scaleX; // Ajusta a espessura da linha para não ficar grossa demais

    if (currentMap.value === 'exterior') {
      context.strokeStyle = 'green';
      templos.forEach(t => context.strokeRect(t.x, t.y, t.largura, t.altura));
      context.strokeRect(aviao.x, aviao.y, aviao.largura, aviao.altura);

      context.strokeStyle = 'yellow';
      templos.forEach(t => t.porta && context.strokeRect(t.porta.x, t.porta.y, t.porta.largura, t.porta.altura));
      aviao.porta && context.strokeRect(aviao.porta.x, aviao.porta.y, aviao.porta.largura, aviao.porta.altura);

    } else if (currentMap.value.startsWith('templo_')) {
      const temploAtual = templos.find(t => t.id === currentMap.value);
      if (temploAtual && temploAtual.interior) {
        context.strokeStyle = 'green';
        temploAtual.interior.paredes.forEach(p => context.strokeRect(p.x, p.y, p.largura, p.altura));
        
        context.strokeStyle = 'yellow';
        const { saida } = temploAtual.interior;
        context.strokeRect(saida.x, saida.y, saida.largura, saida.altura);
      }
      if (temploAtual.interior.puzzle) {
        const { portaFinal, botoes, artefato } = temploAtual.interior.puzzle;

        // Desenha os botões do puzzle em azul
        context.strokeStyle = 'blue';
        botoes.forEach(b => context.strokeRect(b.x, b.y, b.largura, b.altura));

        // Desenha a porta final do puzzle em vermelho
        context.strokeStyle = 'red';
        context.strokeRect(portaFinal.x, portaFinal.y, portaFinal.largura, portaFinal.altura);

        if (artefato && !temItem(artefato.id)) {
          context.strokeStyle = 'magenta';
          context.strokeRect(artefato.x, artefato.y, artefato.largura, artefato.altura);
        }
      }
      const { artefato } = temploAtual.interior;
      if (artefato && !temItem(artefato.id)) {
        context.strokeStyle = 'magenta';
        context.strokeRect(artefato.x, artefato.y, artefato.largura, artefato.altura);
      }
    } else if (currentMap.value === 'base') {
        context.strokeStyle = 'green';
        mapaBase.paredes.forEach(p => context.strokeRect(p.x, p.y, p.largura, p.altura));
        
        context.strokeStyle = 'yellow';
        const { saida } = mapaBase;
        context.strokeRect(saida.x, saida.y, saida.largura, saida.altura);
    }
  }

  // Restaura o estado do canvas para o original (sem escala)
  context.restore();

  inventario.value.forEach((item, index) => {
    const hudImage = hudImages[item.id]; // Pega a imagem pré-carregada

    if (hudImage && hudImage.complete) {
      context.drawImage(hudImage, 20 + (index * 60), 20, 50, 50);
    }
  });
}

function gameLoop() {
  update();
  draw();
  animationFrameId = requestAnimationFrame(gameLoop);
}

onMounted(() => {
  context = canvas.value.getContext('2d');
  const cleanupDisplay = setupDisplay();
  const { templos } = useColisoes();

  // Cria uma lista de promessas para carregar TODAS as imagens
  const imagePromises = [
    new Promise(resolve => { mapImage.onload = resolve; }),
    new Promise(resolve => { baseMapImage.onload = resolve; }),
    new Promise(resolve => { playerImage.onload = resolve; })
  ];

  templos.forEach(templo => {
    const imgFechada = new Image();
    imgFechada.src = templo.interiorImageSrc;
    interiorMapImages[templo.id] = imgFechada;
    imagePromises.push(new Promise(resolve => { imgFechada.onload = resolve; }));

    if (templo.interiorAbertoImageSrc) {
      const imgAberta = new Image();
      imgAberta.src = templo.interiorAbertoImageSrc;
      interiorMapImages[`${templo.id}_aberto`] = imgAberta;
      imagePromises.push(new Promise(resolve => { imgAberta.onload = resolve; }));
    }

    if (templo.interiorColetadoImageSrc) {
      const imgColetado = new Image();
      imgColetado.src = templo.interiorColetadoImageSrc;
      interiorMapImages[`${templo.id}_coletado`] = imgColetado;
      imagePromises.push(new Promise(resolve => { imgColetado.onload = resolve; }));
    }

    if (templo.interior?.artefato?.hudImageSrc) {
      const artefato = templo.interior.artefato;
      const img = new Image();
      img.src = artefato.hudImageSrc;
      hudImages[artefato.id] = img;
      imagePromises.push(new Promise(resolve => { img.onload = resolve; }));
    }
  });

  Promise.all(imagePromises).then(() => {
    gameLoop();
  });

  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId);
    cleanupDisplay();
  });
});

defineExpose({ dialog });
</script>

<style scoped>
.game-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-canvas {
  image-rendering: pixelated;
  background-color: #000;
}
</style>