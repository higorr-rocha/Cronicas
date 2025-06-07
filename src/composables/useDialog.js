import { ref } from 'vue';

// 1. Remova 'temploAtual' da lista de parâmetros
export function useDialog(player, currentMap, aviao, ativarBotao, adicionarItem) {
  const dialog = ref({
    visible: false,
    message: '',
    currentTemplo: null, 
  });

  function abrirDialogo(alvo, mensagem) {
    dialog.value.visible = true;
    dialog.value.message = mensagem;
    dialog.value.currentTemplo = alvo;
  }

  function fecharDialogo() {
    dialog.value.visible = false;
    dialog.value.message = '';
    dialog.value.currentTemplo = null;
  }

  // 2. Esta é a versão final da função, sem nenhuma referência a 'temploAtual'
  function processarTecla(e) {
    if (!dialog.value.visible) return;

    if (e.key.toLowerCase() === 'e') {
      const alvo = dialog.value.currentTemplo;

      if (alvo && alvo.id === 'saida') {
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

      } else if (alvo && alvo.id?.startsWith('anel_')) {
        adicionarItem(alvo);
      
      } else if (alvo && alvo.id?.startsWith('btn_')) {
        ativarBotao(alvo.id);
        
      } else if (alvo && alvo.id === 'aviao') {
        currentMap.value = 'base';
        player.value.x = alvo.spawnPoint.x;
        player.value.y = alvo.spawnPoint.y;

      } else if (alvo && alvo.id) { 
        // Lógica de entrada nos templos (não modifica mais temploAtual)
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