import { ref } from 'vue';

/**
 * Composable que gerencia todo o estado e a lógica relacionados ao jogador.
 */
export function usePlayer() {
  // Objeto reativo que guarda todas as propriedades do jogador.
  // Centralizar isso aqui facilita a manutenção.
  const player = ref({
    x: 194, // Posição inicial no eixo X.
    y: 435, // Posição inicial no eixo Y.
    width: 32,  // Largura do sprite do jogador.
    height: 64, // Altura do sprite do jogador.
    hitbox: { // A área de colisão real, menor que o sprite.
      offsetX: 6,  // Deslocamento da hitbox em relação ao X do sprite.
      offsetY: 14, // Deslocamento da hitbox em relação ao Y do sprite.
      width: 20,
      height: 50,
    },
    speed: 2.5, // Velocidade de movimento em pixels por quadro.
    // Propriedades para controlar a animação da spritesheet.
    frameIndex: 0,     // O quadro atual da animação (0 a 3).
    frameCount: 4,     // Quantos quadros existem na linha da spritesheet.
    frameTick: 0,      // Um contador para controlar a velocidade da animação.
    frameTickLimit: 10,// O jogo espera 10 "ticks" antes de avançar para o próximo frame.
    direction: 1,      // A direção para qual o jogador está virado, usada para selecionar a linha da spritesheet.
  });

  // Objeto reativo que rastreia quais teclas de movimento estão pressionadas.
  const keys = ref({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  /**
   * Avança para o próximo quadro da animação da spritesheet.
   */
  function updateFrame() {
    player.value.frameTick++;
    if (player.value.frameTick >= player.value.frameTickLimit) {
      player.value.frameTick = 0;
      // O operador '%' (módulo) faz a animação voltar ao início (0) após o último quadro.
      player.value.frameIndex = (player.value.frameIndex + 1) % player.value.frameCount;
    }
  }

  /**
   * Reseta a animação para o primeiro quadro (personagem parado).
   */
  function resetFrame() {
    player.value.frameIndex = 0;
  }

  /**
   * Calcula a próxima posição potencial do jogador com base nas teclas pressionadas.
   * Esta função não lida com colisões, apenas com o movimento desejado.
   * @param {object} keys - O estado atual das teclas.
   * @returns {{nextX: number, nextY: number}} - As coordenadas da próxima posição.
   */
  function moverJogador(keys) {
    let movendo = false;
    let nextX = player.value.x;
    let nextY = player.value.y;

    // Verifica cada tecla e atualiza a posição desejada e a direção do sprite.
    if (keys.ArrowUp) {
      nextY -= player.value.speed;
      player.value.direction = 0; // Linha 0 da spritesheet: para cima
      movendo = true;
    } else if (keys.ArrowDown) {
      nextY += player.value.speed;
      player.value.direction = 1; // Linha 1 da spritesheet: para baixo
      movendo = true;
    } else if (keys.ArrowLeft) {
      nextX -= player.value.speed;
      player.value.direction = 2; // Linha 2 da spritesheet: para a esquerda
      movendo = true;
    } else if (keys.ArrowRight) {
      nextX += player.value.speed;
      player.value.direction = 3; // Linha 3 da spritesheet: para a direita
      movendo = true;
    }

    // Atualiza a animação apenas se o jogador estiver tentando se mover.
    if (movendo) {
      updateFrame();
    } else {
      resetFrame();
    }

    // Retorna a posição futura para que Game.vue possa validar as colisões.
    return { nextX, nextY };
  }

  return {
    player,
    keys,
    moverJogador,
  };
}