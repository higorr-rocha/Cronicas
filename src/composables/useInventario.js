import { ref } from 'vue';

const inventario = ref([]);

// A função agora espera um objeto com 'callbacks' como parâmetro
export function useInventario({ onItemAdicionado }) {

  function adicionarItem(item) {
    if (!inventario.value.some(i => i.id === item.id)) {
      inventario.value.push(item);
      console.log(`${item.id} foi adicionado ao inventário!`);

      // Avisa que um item foi adicionado, passando o próprio item como informação
      if (onItemAdicionado) {
        onItemAdicionado(item);
      }
    }
  }

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