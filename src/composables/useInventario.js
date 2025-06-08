import { ref } from 'vue';

// Este ref irá guardar todos os itens coletados
const inventario = ref([]);

export function useInventario() {

  /**
   * Adiciona um item ao inventário do jogador.
   * @param {object} item - O objeto do item a ser adicionado.
   */
  function adicionarItem(item) {
    if (!inventario.value.some(i => i.id === item.id)) {
      inventario.value.push(item);
      console.log(`${item.id} foi adicionado ao inventário!`);
    }
  }

  /**
   * Verifica se o jogador possui um item específico.
   * @param {string} itemId - O ID do item a ser verificado.
   */
  function temItem(itemId) {
    return inventario.value.some(i => i.id === itemId);
  }

  function limparInventario() {
    inventario.value = [];
    console.log("Inventário limpo.");
  }

  return {
    inventario,
    adicionarItem,
    temItem,
    limparInventario
  };
}