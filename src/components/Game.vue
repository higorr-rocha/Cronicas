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
import mapSrc from '../assets/templos.png';
import playerSrc from '../assets/player_spritesheet.png';
import { useColisoes } from '../composables/useColisoes.js';
import { usePlayer } from '../composables/usePlayer.js';
import { useTeclado } from '../composables/useTeclado.js';
import { useDialog } from '../composables/useDialog.js';

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
const playerImage = new Image();
playerImage.src = playerSrc;

// Sistemas
const { verificaColisaoTemplos, verificaColisaoAviao, verificaColisaoPorta, aviao, retangulosColidem } = useColisoes();
const { player, keys, moverJogador } = usePlayer();
const currentMap = ref('exterior');
const temploAtual = ref(null);
const { dialog, abrirDialogo, processarTecla: processarTeclaDialogo } = useDialog(player, currentMap, aviao, temploAtual);
let context;
let animationFrameId = null;

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

// Em Cronicas/src/components/Game.vue

function update() {
  if (!dialog.value.visible) {
    const { nextX, nextY } = moverJogador(keys.value);
    const boundedX = Math.max(0, Math.min(gameWidth.value - player.value.width, nextX));
    const boundedY = Math.max(0, Math.min(gameHeight.value - player.value.height, nextY));
    const playerRect = rectFromPlayer(boundedX, boundedY);

    if (currentMap.value === 'exterior') {
      const temploComPorta = verificaColisaoPorta(playerRect);
      if (temploComPorta) {
        abrirDialogo(temploComPorta, 'Deseja entrar?\nE - Sim   ESC - Não');
      } else {
        const colidiuComBarreira = verificaColisaoTemplos(playerRect) || verificaColisaoAviao(playerRect);
        if (!colidiuComBarreira) {
          player.value.x = boundedX;
          player.value.y = boundedY;
        }
      }
    } else if (currentMap.value.startsWith('templo_')) {
      // NOVA LÓGICA PARA INTERIORES
      const { templos } = useColisoes();
      const temploAtual = templos.find(t => t.id === currentMap.value);
      
      if (temploAtual && temploAtual.interior) {
        const { paredes, saida } = temploAtual.interior;

        // Verifica colisão com a porta de saída
        if (retangulosColidem(playerRect, saida)) {
          abrirDialogo('saida', 'Deseja sair?\nE - Sim   ESC - Não');
        } else {
          // Verifica colisão com as paredes do interior
          const colidiuComParede = paredes.some(p => retangulosColidem(playerRect, p));
          if (!colidiuComParede) {
            player.value.x = boundedX;
            player.value.y = boundedY;
          }
        }
      }
    }
  }
}

function draw() {
  context.clearRect(0, 0, gameWidth.value, gameHeight.value);

  let currentMapImage;

  if (currentMap.value === 'exterior') {
    currentMapImage = mapImage;
  } else {
    // Procura a imagem do interior no nosso objeto
    currentMapImage = interiorMapImages[currentMap.value];
  }

  // Desenha o mapa
  if (currentMapImage && currentMapImage.complete) {
    context.drawImage(currentMapImage, 0, 0, gameWidth.value, gameHeight.value);
  }

  // Desenha o jogador
  const frameWidth = playerImage.width / player.value.frameCount;
  const frameHeight = playerImage.height / 4;

  context.drawImage(
    playerImage,
    frameWidth * player.value.frameIndex,
    frameHeight * player.value.direction,
    frameWidth,
    frameHeight,
    player.value.x,
    player.value.y,
    player.value.width,
    player.value.height
  );

  if (showCollisionBoxes.value) {
    const { templos, aviao } = useColisoes();
    context.lineWidth = 2;

    if (currentMap.value === 'exterior') {
      // Desenha colisões do mapa exterior
      context.strokeStyle = 'green';
      templos.forEach(t => context.strokeRect(t.x, t.y, t.largura, t.altura));
      context.strokeRect(aviao.x, aviao.y, aviao.largura, aviao.altura);

      context.strokeStyle = 'yellow';
      templos.forEach(t => t.porta && context.strokeRect(t.porta.x, t.porta.y, t.porta.largura, t.porta.altura));
      aviao.porta && context.strokeRect(aviao.porta.x, aviao.porta.y, aviao.porta.largura, aviao.porta.altura);

    } else if (currentMap.value.startsWith('templo_')) {
      // NOVA LÓGICA PARA DESENHAR COLISÕES DO INTERIOR
      const temploAtual = templos.find(t => t.id === currentMap.value);
      if (temploAtual && temploAtual.interior) {
        // Desenha as paredes em verde
        context.strokeStyle = 'green';
        temploAtual.interior.paredes.forEach(p => context.strokeRect(p.x, p.y, p.largura, p.altura));
      
        // Desenha a porta de saída em amarelo
        context.strokeStyle = 'yellow';
        const { saida } = temploAtual.interior;
        context.strokeRect(saida.x, saida.y, saida.largura, saida.altura);
      }
    }
  }
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
    new Promise(resolve => { playerImage.onload = resolve; })
  ];

  templos.forEach(templo => {
    const img = new Image();
    img.src = templo.interiorImageSrc;
    interiorMapImages[templo.id] = img; // Armazena a imagem no nosso objeto
    imagePromises.push(new Promise(resolve => { img.onload = resolve; }));
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