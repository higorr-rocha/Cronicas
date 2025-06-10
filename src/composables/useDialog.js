import { ref } from 'vue';

/**
 * Composable para gerenciar toda a lógica de diálogos do jogo.
 * Ele recebe como parâmetros vários estados e funções de outros sistemas
 * para poder interagir com eles (um padrão chamado de injeção de dependência).
 * @param {Ref<object>} player - O objeto reativo do jogador.
 * @param {Ref<string>} currentMap - O estado do mapa atual.
 * @param {object} aviao - O objeto de dados do avião.
 * @param {object} mapaBase - O objeto de dados do mapa da base.
 * @param {object} mapaPredio - O objeto de dados do mapa do prédio.
 * @param {Function} ativarBotao - Função do usePuzzle para ativar um botão.
 * @param {Function} adicionarItem - Função do useInventario para adicionar um item.
 * @param {Function} limparInventario - Função do useInventario para limpar o inventário.
 * @param {Function} temItem - Função do useInventario para verificar se um item existe.
 * @param {Function} finalizarJogo - Função de Game.vue para emitir o evento de fim de jogo.
 */
export function useDialog(player, currentMap, aviao, mapaBase, mapaPredio, ativarBotao, adicionarItem, limparInventario, temItem, finalizarJogo) {
  // O estado reativo do diálogo, controla sua visibilidade, mensagem e com qual objeto estamos interagindo.
  const dialog = ref({
    visible: false,
    message: '',
    currentTemplo: null, 
  });

  /**
   * Abre a caixa de diálogo com uma mensagem e o alvo da interação.
   * @param {object | string} alvo - O objeto (templo, botão) ou string ('saida') da interação.
   * @param {string} mensagem - A mensagem a ser exibida.
   */
  function abrirDialogo(alvo, mensagem) {
    dialog.value.visible = true;
    dialog.value.message = mensagem;
    dialog.value.currentTemplo = alvo;
  }

  /**
   * Fecha a caixa de diálogo e reseta seu estado para a próxima interação.
   */
  function fecharDialogo() {
    dialog.value.visible = false;
    dialog.value.message = '';
    dialog.value.currentTemplo = null;
  }

  /**
   * Processa a entrada do teclado ('E' ou 'ESC') quando um diálogo está visível.
   * Esta função funciona como uma grande "torre de controle" ou "máquina de estados"
   * para todas as interações do jogo. Ela decide qual ação tomar com base
   * no 'alvo' da interação atual, que é guardado em `dialog.value.currentTemplo`.
   * A ordem dos 'if/else if' é crucial, indo dos casos mais específicos para os mais gerais.
   * @param {KeyboardEvent} e - O evento do teclado que acionou a função.
   */
  function processarTecla(e) {
    // Ignora qualquer tecla se o diálogo não estiver visível.
    if (!dialog.value.visible) return;

    // Ações executadas ao pressionar a tecla 'E' (confirmar).
    if (e.key.toLowerCase() === 'e') {
      const alvo = dialog.value.currentTemplo;
      let deveFecharDialogo = true; // Controla se o diálogo deve fechar ao final da ação.

      // --- ORDEM DE VERIFICAÇÃO ESTRATÉGICA ---

      // 1. PRIMEIRO: Casos que usam um objeto específico com ID 'saida'.
      // Executado ao sair de qualquer um dos três templos.
      if (alvo && alvo.id === 'saida') {
        // Pega o objeto do templo de onde estamos saindo, que foi passado em 'alvo.origem'.
        const temploDeOrigem = alvo.origem;
        currentMap.value = 'exterior'; // Retorna para o mapa principal.

        if (temploDeOrigem) {
          // Calcula a posição exata em frente à porta do templo de onde o jogador saiu.
          player.value.x = temploDeOrigem.x + (temploDeOrigem.largura / 2) - (player.value.width / 2);
          player.value.y = temploDeOrigem.porta.y + 10;
        } else {
          // Caso de segurança: se, por algum motivo, a origem for perdida, envia o jogador para um local seguro.
          console.error("Não foi possível determinar o templo de origem. Usando saída padrão.");
          player.value.x = aviao.x + aviao.largura + 10;
          player.value.y = aviao.y + (aviao.altura / 2);
        }
        player.value.direction = 1; // Vira o personagem para baixo.

      // 2. SEGUNDO: Casos que usam uma string simples como identificador.
      // Executado ao interagir com a saída do mapa da base.
      } else if (alvo === 'saida_base') {
        currentMap.value = 'exterior';
        // Posiciona o jogador ao lado do avião no mapa dos templos.
        player.value.x = aviao.x + aviao.largura + 10;
        player.value.y = aviao.y + (aviao.altura / 2);
        player.value.direction = 3; // Vira o personagem para a direita.

      // 3. TERCEIRO: Casos de objetos com IDs específicos ou padrões.
      // Executado quando o jogador confirma a viagem para o prédio final.
      } else if (alvo && alvo.id === 'ir_predio') {
        currentMap.value = 'predio';
        player.value.x = aviao.spawnPointPredio.x;
        player.value.y = aviao.spawnPointPredio.y;

      // Executado ao usar o avião no mapa do prédio para voltar à base.
      } else if (alvo && alvo.id === 'aviao_predio_saida') {
        currentMap.value = 'base';
        player.value.x = mapaBase.saida.x + 115;
        player.value.y = mapaBase.saida.y - 25;

      // Executado ao entrar no interior do prédio.
      } else if (alvo && alvo.id === 'predio') {
        currentMap.value = 'predio_interior';
        player.value.x = 640;
        player.value.y = 550;

      // Executado ao sair do interior do prédio.
      } else if (alvo && alvo.id === 'saida_predio_interior') {
        // Lógica condicional: verifica se o jogador já coletou o artefato final.
        if (temItem('artefato')) {
          finalizarJogo(); // Se sim, aciona a função de fim de jogo.
        } else {
          // Se não, apenas retorna para a área externa do prédio.
          currentMap.value = 'predio';
          player.value.x = mapaPredio.porta.x + (mapaPredio.porta.largura / 2);
          player.value.y = mapaPredio.porta.y + 20;
        }

      // Interação com papéis/dicas.
      } else if (alvo && alvo.id?.startsWith('papel_')) {
        // A tecla 'E' não faz nada aqui. O 'return' impede que 'fecharDialogo()' seja chamado,
        // forçando o jogador a usar a tecla 'ESC' para fechar a dica.
        return; 
      
      // Interação para coletar qualquer item do tipo 'artefato'.
      } else if (alvo && alvo.type === 'artefato') {
        // Lógica especial para o artefato final: limpa o inventário dos anéis.
        if (alvo.id === 'artefato') {
          limparInventario();
        }
        adicionarItem(alvo); // Adiciona o item coletado ao inventário.

      // Interação com botões de puzzle.
      } else if (alvo && alvo.id?.startsWith('btn_')) {
        ativarBotao(alvo.id);
        
      // Interação com o avião no mapa dos templos para ir à base.
      } else if (alvo && alvo.id === 'aviao') {
        currentMap.value = 'base';
        player.value.x = alvo.spawnPoint.x;
        player.value.y = alvo.spawnPoint.y;

      // Bloco genérico final: se for um objeto com ID que não se encaixou antes,
      // assume-se que é uma porta de templo para ENTRAR.
      } else if (alvo && alvo.id) { 
        currentMap.value = alvo.id;
        player.value.x = alvo.spawnPoint.x;
        player.value.y = alvo.spawnPoint.y;
      }
      
      // Se a função não foi interrompida pelo 'return' do papel, fecha o diálogo.
      if (deveFecharDialogo) {
        fecharDialogo();
      }

    // Ações executadas ao pressionar a tecla 'ESC' (cancelar/fechar).
    } else if (e.key === 'Escape') {
      fecharDialogo();
    }
  }

  // Expõe o estado e as funções do diálogo para serem usadas em outros arquivos.
  return {
    dialog,
    abrirDialogo,
    fecharDialogo,
    processarTecla,
  };
}