import { ref } from 'vue';

export function usePlayer() {
  const player = ref({
    x: 250,
    y: 240,
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
    direction: 1,
  });

  const keys = ref({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  // Função para resetar frame quando parado
  function resetFrame() {
    player.value.frameIndex = 0;
  }

  // Função para avançar frame de animação
  function updateFrame() {
    player.value.frameTick++;
    if (player.value.frameTick >= player.value.frameTickLimit) {
      player.value.frameTick = 0;
      player.value.frameIndex = (player.value.frameIndex + 1) % player.value.frameCount;
    }
  }

  return {
    player,
    keys,
    resetFrame,
    updateFrame,
  };
}
