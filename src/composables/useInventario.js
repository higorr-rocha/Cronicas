import { ref } from 'vue';

// O estado do inventário é definido fora da função principal.
// Isso o torna um "singleton" ou estado global: não importa quantas vezes
// useInventario() seja chamado, todos compartilharão o mesmo array de inventário.
const inventario = ref([]);

/**
 * Composable para gerenciar o inventário do jogador.
 * Expõe funções para adicionar, verificar e limpar itens.
 * @param {object} options - Um objeto de opções contendo callbacks.
 * @param {Function} options.onItemAdicionado - Callback executado quando um item é adicionado.
 */
export function useInventario({ onItemAdicionado }) {

  /**
   * Adiciona um item ao inventário, se ele ainda não existir.
   * @param {object} item - O objeto do item a ser adicionado (deve ter uma propriedade 'id').
   */
  function adicionarItem(item) {
    // .some() verifica se pelo menos um elemento no array passa no teste.
    // Impede que o mesmo item seja adicionado múltiplas vezes.
    if (!inventario.value.some(i => i.id === item.id)) {
      inventario.value.push(item);
      console.log(`${item.id} foi adicionado ao inventário!`);

      // Se um callback foi fornecido na inicialização, ele é chamado aqui.
      // Isso permite que outros sistemas (como o de som em Game.vue) reajam a este evento.
      if (onItemAdicionado) {
        onItemAdicionado(item);
      }
    }
  }

  /**
   * Verifica se um item com um ID específico já está no inventário.
   * @param {string} itemId - O ID do item a ser verificado.
   * @returns {boolean} - Verdadeiro se o item estiver no inventário.
   */
  function temItem(itemId) {
    return inventario.value.some(i => i.id === itemId);
  }

  /**
   * Esvazia completamente o array do inventário.
   */
  function limparInventario() {
    inventario.value = [];
    console.log("Inventário limpo.");
  }

  // Expõe o estado e as funções para que possam ser usados em outros componentes/composables.
  return {
    inventario,
    adicionarItem,
    temItem,
    limparInventario
  };
}