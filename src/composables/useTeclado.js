import { onMounted, onUnmounted } from 'vue';

/**
 * Composable genérico para capturar e gerenciar a entrada do teclado.
 * @param {Ref<object>} keys - Um objeto reativo para guardar o estado das teclas de movimento (pressionada/não pressionada).
 * @param {Function} onInteracaoTecla - Uma função de callback que será executada para QUALQUER tecla pressionada,
 * para lidar com interações (como 'E', 'ESC', 'c').
 */
export function useTeclado(keys, onInteracaoTecla) {
  /**
   * Mapeia as teclas WASD para as setas direcionais, permitindo que ambas controlem o personagem.
   * @param {string} tecla - A tecla pressionada (ex: 'w').
   * @returns {string} - A tecla mapeada (ex: 'ArrowUp').
   */
  function mapearTecla(tecla) {
    switch (tecla.toLowerCase()) {
      case 'w': return 'ArrowUp';
      case 'a': return 'ArrowLeft';
      case 's': return 'ArrowDown';
      case 'd': return 'ArrowRight';
      default: return tecla;
    }
  }

  /**
   * Handler para o evento 'keydown' (quando uma tecla é pressionada).
   */
  function keydownHandler(e) {
    const teclaMapeada = mapearTecla(e.key);
    // Se a tecla for uma das teclas de movimento, atualiza seu estado para 'true'.
    if (keys.value.hasOwnProperty(teclaMapeada)) {
      keys.value[teclaMapeada] = true;
    }

    // Se um callback de interação foi fornecido, ele é executado para qualquer tecla.
    // Isso permite que Game.vue lide com 'E', 'ESC', 'c', etc.
    if (onInteracaoTecla) onInteracaoTecla(e);
  }

  /**
   * Handler para o evento 'keyup' (quando uma tecla é solta).
   */
  function keyupHandler(e) {
    const teclaMapeada = mapearTecla(e.key);
    // Atualiza o estado da tecla de movimento para 'false'.
    if (keys.value.hasOwnProperty(teclaMapeada)) {
      keys.value[teclaMapeada] = false;
    }
  }

  // onMounted e onUnmounted são hooks do Vue.
  // Eles garantem que os event listeners sejam adicionados quando o componente é criado
  // e removidos quando o componente é destruído, para evitar vazamentos de memória.
  onMounted(() => {
    window.addEventListener('keydown', keydownHandler);
    window.addEventListener('keyup', keyupHandler);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', keydownHandler);
    window.removeEventListener('keyup', keyupHandler);
  });
}