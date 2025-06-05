import { onMounted, onUnmounted, ref } from 'vue';

export function useTeclado(keys, onInteracaoTecla) {
  const teclasPermitidas = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'];

  function mapearTecla(tecla) {
    switch (tecla.toLowerCase()) {
      case 'w': return 'ArrowUp';
      case 'a': return 'ArrowLeft';
      case 's': return 'ArrowDown';
      case 'd': return 'ArrowRight';
      default: return tecla;
    }
  }

  function keydownHandler(e) {
    const teclaMapeada = mapearTecla(e.key);
    if (keys.value.hasOwnProperty(teclaMapeada)) {
      keys.value[teclaMapeada] = true;
    }

    if (onInteracaoTecla) onInteracaoTecla(e);
  }

  function keyupHandler(e) {
    const teclaMapeada = mapearTecla(e.key);
    if (keys.value.hasOwnProperty(teclaMapeada)) {
      keys.value[teclaMapeada] = false;
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', keydownHandler);
    window.addEventListener('keyup', keyupHandler);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', keydownHandler);
    window.removeEventListener('keyup', keyupHandler);
  });
}
