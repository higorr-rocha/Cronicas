import { ref } from 'vue';

// 1. Remova 'temploAtual' da lista de parâmetros
export function useDialog(player, currentMap, aviao, mapaBase, mapaPredio, ativarBotao, adicionarItem, limparInventario) {
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

      // --- ORDEM DE VERIFICAÇÃO CORRIGIDA ---

      // 1. Primeiro, todos os casos que comparam com uma STRING ou um OBJETO ESPECÍFICO
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

      // 2. Agora, os casos que usam .startsWith() ou outras propriedades de ID
      } else if (alvo && alvo.id === 'ir_predio') {
        currentMap.value = 'predio';
        player.value.x = aviao.spawnPointPredio.x;
        player.value.y = aviao.spawnPointPredio.y;

      } else if (alvo && alvo.id === 'aviao_predio_saida') {
        currentMap.value = 'base';
        player.value.x = mapaBase.saida.x + 115; // Posição segura na base
        player.value.y = mapaBase.saida.y - 25;

      } else if (alvo && alvo.id === 'predio') {
        currentMap.value = 'predio_interior';
        player.value.x = 640; // Ponto de spawn no interior do prédio
        player.value.y = 550;

      } else if (alvo && alvo.id === 'saida_predio_interior') {
        // Se o jogador tiver o artefato final, o jogo acaba
        if (temItem('artefato')) {
          finalizarJogo();
        } else {
          // Se não, ele apenas sai para a área externa do prédio
          currentMap.value = 'predio';
          player.value.x = mapaPredio.porta.x + (mapaPredio.porta.largura / 2);
          player.value.y = mapaPredio.porta.y + 20;
        }
      } else if (alvo && alvo.id?.startsWith('papel_')) {
        return; 
      
      } else if (alvo && alvo.type === 'artefato') {
        // Se for o artefato final, limpa o inventário primeiro
        if (alvo.id === 'artefato') {
          limparInventario();
        }
        adicionarItem(alvo);

      } else if (alvo && alvo.id?.startsWith('btn_')) {
        ativarBotao(alvo.id);
        
      } else if (alvo && alvo.id === 'aviao') {
        currentMap.value = 'base';
        player.value.x = alvo.spawnPoint.x;
        player.value.y = alvo.spawnPoint.y;

      } else if (alvo && alvo.id) { 
        // Lógica de entrada nos templos
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