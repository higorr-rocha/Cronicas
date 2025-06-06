import { ref } from 'vue';

export function usePlayer() {
  const player = ref({
    x: 460,
    y: 725,
    width: 32,
    height: 64,
    hitbox: {
      offsetX: 6,
      offsetY: 14,
      width: 20,
      height: 50,
    },
    speed: 2,
    frameIndex: 0,
    frameCount: 4,
    frameTick: 0,
    frameTickLimit: 10,
    direction: 1, // 0: Cima, 1: Baixo, 2: Esquerda, 3: Direita
  });

  const keys = ref({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  function updateFrame() {
    player.value.frameTick++;
    if (player.value.frameTick >= player.value.frameTickLimit) {
      player.value.frameTick = 0;
      player.value.frameIndex = (player.value.frameIndex + 1) % player.value.frameCount;
    }
  }

  function resetFrame() {
    player.value.frameIndex = 0;
  }

  /**
   * NOVA FUNÇÃO DE MOVIMENTO GLOBAL
   * Esta função não verifica mais colisões. Ela apenas calcula a próxima posição
   * potencial com base nas teclas, atualiza a direção para a animação e o frame.
   * @param {object} keys - O estado atual das teclas.
   * @returns {{nextX: number, nextY: number}} - As coordenadas da próxima posição potencial.
   */
  function moverJogador(keys) {
    let movendo = false;
    let nextX = player.value.x;
    let nextY = player.value.y;

    // Lógica de movimento e direção da animação
    if (keys.ArrowUp) {
      nextY -= player.value.speed;
      player.value.direction = 0; // Direção para CIMA
      movendo = true;
    } else if (keys.ArrowDown) {
      nextY += player.value.speed;
      player.value.direction = 1; // Direção para BAIXO
      movendo = true;
    } else if (keys.ArrowLeft) {
      nextX -= player.value.speed;
      player.value.direction = 2; // Direção para ESQUERDA
      movendo = true;
    } else if (keys.ArrowRight) {
      nextX += player.value.speed;
      player.value.direction = 3; // Direção para DIREITA
      movendo = true;
    }

    // Atualiza a animação
    if (movendo) {
      updateFrame();
    } else {
      resetFrame();
    }

    // Retorna a posição futura para que o Game.vue possa validar
    return { nextX, nextY };
  }

  return {
    player,
    keys,
    moverJogador,
  };
}