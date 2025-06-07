import { ref } from 'vue';

/**
 * Composable para gerenciar toda a lógica de diálogos do jogo.
 * @param {Ref<object>} player - A referência reativa do objeto do jogador.
 * @param {Ref<string>} currentMap - A referência reativa do mapa atual.
 * @param {object} aviao - O objeto do avião para comparações.
 */
export function useDialog(player, currentMap, aviao, ativarBotao, adicionarItem) {
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

      // LÓGICA REFEITA E SIMPLIFICADA
      if (alvo && alvo.id === 'saida') {
        // Agora pegamos o templo de origem diretamente do 'alvo'
        const temploDeOrigem = alvo.origem;
        currentMap.value = 'exterior';

        if (temploDeOrigem) {
          player.value.x = temploDeOrigem.x + (temploDeOrigem.largura / 2) - (player.value.width / 2);
          player.value.y = temploDeOrigem.porta.y + 10;
        } else {
          console.error("Não foi possível determinar o templo de origem. Usando saída padrão.");
          player.value.x = aviao.x + aviao.largura + 10;
          player.value.y = aviao.y + (aviao.altura / 2);
        }
        player.value.direction = 1;

      } else if (alvo === 'saida_base') {
        currentMap.value = 'exterior';
        player.value.x = aviao.x + aviao.largura + 10;
        player.value.y = aviao.y + (aviao.altura / 2);
        player.value.direction = 3;

      } else if (alvo && alvo.id === 'anel_verde') {
        adicionarItem(alvo);
      
      } else if (alvo && alvo.id.startsWith('btn_')) {
        ativarBotao(alvo.id);
        
      } else if (alvo && alvo.id === 'aviao') {
        currentMap.value = 'base';
        player.value.x = alvo.spawnPoint.x;
        player.value.y = alvo.spawnPoint.y;
        player.value.direction = 2;

      } else if (alvo && alvo.id) { 
        // Lógica de entrada nos templos (não precisa mais setar temploAtual)
        currentMap.value = alvo.id;
        player.value.x = alvo.spawnPoint.x;
        player.value.y = alvo.spawnPoint.y;
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