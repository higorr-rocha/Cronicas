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
import mapInteriorTemplo from '../assets/templo_interior.png';
import { useColisoes } from '../composables/useColisoes.js';
import { usePlayer } from '../composables/usePlayer.js';
import { useTeclado } from '../composables/useTeclado.js';

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
const mapInteriorImage = new Image();
mapInteriorImage.src = mapInteriorTemplo;
const playerImage = new Image();
playerImage.src = playerSrc;

// Sistemas
const { verificaColisaoTemplos, verificaColisaoAviao, verificaColisaoPorta, aviao } = useColisoes();
const { player, keys, resetFrame, updateFrame } = usePlayer();
const dialog = ref({ visible: false, message: '', currentTemplo: null });
const currentMap = ref('exterior');
let context;
let animationFrameId = null;

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

function verificaPortaSaidaInterior(playerRect) {
  const portaSaida = { x: 280, y: 410, largura: 80, altura: 40 };
  const colidiu =
    playerRect.x < portaSaida.x + portaSaida.largura &&
    playerRect.x + playerRect.largura > portaSaida.x &&
    playerRect.y < portaSaida.y + portaSaida.altura &&
    playerRect.y + playerRect.altura > portaSaida.y;
  return colidiu ? portaSaida : null;
}

function processarTecla(e) {
  if (!dialog.value.visible) return;

  if (e.key === 'e' || e.key === 'E') {
    if (dialog.value.currentTemplo === aviao) {
      alert('Você entrou no avião!');
    } else if (dialog.value.currentTemplo === 'saida') {
      currentMap.value = 'exterior';
      player.value.x = 300;
      player.value.y = 350;
    } else {
      currentMap.value = 'interior';
      player.value.x = 100;
      player.value.y = 100;
    }
    dialog.value.visible = false;
  } else if (e.key === 'Escape') {
    dialog.value.visible = false;
  }
}

useTeclado(keys, processarTecla);

function update() {
  if (dialog.value.visible) return;

  let moving = false;
  let newX = player.value.x;
  let newY = player.value.y;
  let newDirection = player.value.direction;

  if (keys.value.ArrowLeft) {
    newX -= player.value.speed;
    newDirection = 2;
    moving = true;
  }
  if (keys.value.ArrowRight) {
    newX += player.value.speed;
    newDirection = 3;
    moving = true;
  }
  if (keys.value.ArrowUp) {
    newY -= player.value.speed;
    newDirection = 0;
    moving = true;
  }
  if (keys.value.ArrowDown) {
    newY += player.value.speed;
    newDirection = 1;
    moving = true;
  }

  // Limites do jogo
  newX = Math.max(0, Math.min(GAME_WIDTH - player.value.width, newX));
  newY = Math.max(0, Math.min(GAME_HEIGHT - player.value.height, newY));

  const playerRect = rectFromPlayer(newX, newY);

  if (currentMap.value === 'interior') {
    const portaSaida = verificaPortaSaidaInterior(playerRect);
    if (portaSaida && !dialog.value.visible) {
      dialog.value.visible = true;
      dialog.value.message = 'Deseja sair?\nE - Sim   ESC - Não';
      dialog.value.currentTemplo = 'saida';
    }

    if (moving) {
      player.value.x = newX;
      player.value.y = newY;
      player.value.direction = newDirection;
      updateFrame();
    } else {
      resetFrame();
    }
    return;
  }

  const collidedTemplo = verificaColisaoTemplos(playerRect);
  const collidedAviao = verificaColisaoAviao(playerRect);
  const temploComPorta = verificaColisaoPorta(playerRect);

  if (temploComPorta && !dialog.value.visible) {
    dialog.value.visible = true;
    dialog.value.message = 'Deseja entrar?\nE - Sim   ESC - Não';
    dialog.value.currentTemplo = temploComPorta;
  }

  if (!collidedTemplo && !collidedAviao && moving) {
    player.value.x = newX;
    player.value.y = newY;
    player.value.direction = newDirection;
    updateFrame();
  } else if (!moving) {
    resetFrame();
  }
}

function draw() {
  context.clearRect(0, 0, gameWidth.value, gameHeight.value);

  // Desenha o mapa
  const currentMapImage = currentMap.value === 'interior' ? mapInteriorImage : mapImage;
  context.drawImage(currentMapImage, 0, 0, gameWidth.value, gameHeight.value);

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
}

function gameLoop() {
  update();
  draw();
  animationFrameId = requestAnimationFrame(gameLoop);
}

onMounted(() => {
  context = canvas.value.getContext('2d');
  const cleanupDisplay = setupDisplay();

  // Carrega assets
  Promise.all([
    new Promise(resolve => { mapImage.onload = resolve; }),
    new Promise(resolve => { playerImage.onload = resolve; }),
    new Promise(resolve => { mapInteriorImage.onload = resolve; })
  ]).then(() => {
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