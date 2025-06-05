<template>
  <div ref="gameContainer" style="position:relative; width:100vw; height:100vh; overflow:hidden;">
    <canvas
      ref="canvas"
      :width="canvasWidth"
      :height="canvasHeight"
      style="display:block; width:100vw; height:100vh; image-rendering: pixelated; background: #000;"
      @click="enterFullscreen"
    ></canvas>

    <!-- Caixa de mensagem do jogo -->
    <!-- <div
      v-if="dialog.visible"
      style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.75);
        color: white;
        padding: 16px 24px;
        border-radius: 10px;
        font-family: sans-serif;
        font-size: 1.1rem;
        white-space: pre-line;
        pointer-events: none;
        z-index: 10;
        text-align: center;
      "
    >
      {{ dialog.message }}
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import mapSrc from '../assets/templos.png';
import playerSrc from '../assets/player_spritesheet.png';
import mapInteriorTemplo from '../assets/templo_interior.png';

import { useColisoes } from '../composables/useColisoes.js';
import { usePlayer } from '../composables/usePlayer.js';
import { useTeclado } from '../composables/useTeclado.js';

const gameContainer = ref(null);
const canvas = ref(null);
const canvasWidth = ref(window.innerWidth);
const canvasHeight = ref(window.innerHeight);

let context;

const mapImage = new Image();
mapImage.src = mapSrc;

const mapInteriorImage = new Image();
mapInteriorImage.src = mapInteriorTemplo;

const playerImage = new Image();
playerImage.src = playerSrc;

const { verificaColisaoTemplos, verificaColisaoAviao, verificaColisaoPorta, aviao } = useColisoes();
const { player, keys, resetFrame, updateFrame } = usePlayer();
const dialog = ref({ visible: false, message: '', currentTemplo: null });
const currentMap = ref('exterior'); // 'exterior' ou 'interior'

// FULLSCREEN: faz o container entrar em fullscreen
function enterFullscreen() {
  if (gameContainer.value.requestFullscreen) {
    gameContainer.value.requestFullscreen();
  }
  resizeCanvasToFullscreen();
}

// Atualiza o tamanho do canvas para fullscreen
function resizeCanvasToFullscreen() {
  if (!canvas.value || !gameContainer.value) return;
  canvasWidth.value = gameContainer.value.clientWidth;
  canvasHeight.value = gameContainer.value.clientHeight;
  canvas.value.width = canvasWidth.value;
  canvas.value.height = canvasHeight.value;
}

// Cria retângulo do player para checar colisões
function rectFromPlayer(newX, newY) {
  return {
    x: newX + player.value.hitbox.offsetX,
    y: newY + player.value.hitbox.offsetY,
    largura: player.value.hitbox.width,
    altura: player.value.hitbox.height,
  };
}

// Verifica porta de saída do templo (em coordenadas definidas)
function verificaPortaSaidaInterior(playerRect) {
  const portaSaida = { x: 280, y: 400, largura: 80, altura: 40 };
  const colidiu =
    playerRect.x < portaSaida.x + portaSaida.largura &&
    playerRect.x + playerRect.largura > portaSaida.x &&
    playerRect.y < portaSaida.y + portaSaida.altura &&
    playerRect.y + playerRect.altura > portaSaida.y;
  return colidiu ? portaSaida : null;
}

// Processa tecla 'E' ou 'Escape'
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

  newX = Math.max(0, Math.min(canvasWidth.value - player.value.width, newX));
  newY = Math.max(0, Math.min(canvasHeight.value - player.value.height, newY));

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

  const temploComPorta = verificaColisaoPorta(playerRect, canvasWidth.value, canvasHeight.value);
  const collidedTemplo = verificaColisaoTemplos(playerRect, canvasWidth.value, canvasHeight.value);
  const collidedAviao = verificaColisaoAviao(playerRect, canvasWidth.value, canvasHeight.value);

  if (temploComPorta && !dialog.value.visible) {
    dialog.value.visible = true;
    if (temploComPorta === aviao) {
      dialog.value.message = 'Deseja embarcar no avião?\nE - Sim   ESC - Não';
    } else {
      dialog.value.message = 'Deseja entrar?\nE - Sim   ESC - Não';
    }
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
  context.clearRect(0, 0, canvasWidth.value, canvasHeight.value);

  const currentMapImage = currentMap.value === 'interior' ? mapInteriorImage : mapImage;
  context.drawImage(currentMapImage, 0, 0, canvasWidth.value, canvasHeight.value);

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

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

let mapLoaded = false;
let playerLoaded = false;

onMounted(() => {
  context = canvas.value.getContext('2d');

  mapImage.onload = () => {
    mapLoaded = true;
    if (playerLoaded) loop();
  };

  playerImage.onload = () => {
    playerLoaded = true;
    if (mapLoaded) loop();
  };

  // FULLSCREEN: redimensiona o canvas ao redimensionar a janela ou fullscreen
  window.addEventListener('resize', resizeCanvasToFullscreen);
  document.addEventListener('fullscreenchange', resizeCanvasToFullscreen);

  // Ajusta ao montar
  resizeCanvasToFullscreen();
});

defineExpose({ dialog });
</script>
