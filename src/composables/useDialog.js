import { ref } from 'vue';

/**
 * Composable para gerenciar toda a lógica de diálogos do jogo.
 * @param {Ref<object>} player - A referência reativa do objeto do jogador.
 * @param {Ref<string>} currentMap - A referência reativa do mapa atual.
 * @param {object} aviao - O objeto do avião para comparações.
 */
export function useDialog(player, currentMap, aviao, temploAtual) {
  const dialog = ref({
    visible: false,
    message: '',
    currentTemplo: null, // Armazena o objeto com o qual estamos interagindo
  });

  /**
   * Abre a caixa de diálogo com uma mensagem e o alvo da interação.
   * @param {object} alvo - O objeto do templo, avião ou 'saida'.
   * @param {string} mensagem - A mensagem a ser exibida.
   */
  function abrirDialogo(alvo, mensagem) {
    dialog.value.visible = true;
    dialog.value.message = mensagem;
    dialog.value.currentTemplo = alvo;
  }

  /**
   * Fecha a caixa de diálogo e reseta seu estado.
   */
  function fecharDialogo() {
    dialog.value.visible = false;
    dialog.value.message = '';
    dialog.value.currentTemplo = null;
  }

  /**
   * Processa a entrada do teclado (E ou ESC) quando um diálogo está visível.
   * Esta função contém a lógica de mudança de mapa.
   * @param {KeyboardEvent} e - O evento do teclado.
   */
  function processarTecla(e) {
    if (!dialog.value.visible) return;

    if (e.key.toLowerCase() === 'e') {
      const alvo = dialog.value.currentTemplo;

      if (alvo === aviao) {
        alert('Você entrou no avião!');
      } else if (alvo === 'saida') {
        // NOVA LÓGICA DE SAÍDA
        currentMap.value = 'exterior';
        
        if (temploAtual.value) {
          const temploDeOrigem = temploAtual.value;
          
          // Calcula a posição de saída com base nos dados do templo de origem
          // Meio do templo no eixo X (considerando o centro do jogador)
          player.value.x = temploDeOrigem.x + (temploDeOrigem.largura / 2) - (player.value.width / 2);
          // 5 pixels abaixo da porta no eixo Y
          player.value.y = temploDeOrigem.porta.y + 10;
          // Vira o personagem para baixo
          player.value.direction = 1; 
        }

      } else {
        // Lógica de entrada
        currentMap.value = alvo.id;
        player.value.x = alvo.spawnPoint.x;
        player.value.y = alvo.spawnPoint.y;
        
        // AQUI "LEMBRAMOS" EM QUAL TEMPLO ENTRAMOS
        temploAtual.value = alvo; 
      }
      
      fecharDialogo();

    } else if (e.key === 'Escape') {
      fecharDialogo();
    }
  }

  return {
    dialog,
    abrirDialogo,
    fecharDialogo,
    processarTecla,
  };
}