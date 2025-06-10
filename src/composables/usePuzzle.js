import { ref } from 'vue';

/**
 * Composable que funciona como uma "máquina de puzzle" genérica.
 * Ele gerencia o estado de um puzzle de sequência, mas não sabe qual
 * puzzle específico está ativo. Ele recebe a sequência correta de fora.
 * @param {object} options - Callbacks para notificar sobre eventos do puzzle.
 * @param {Function} options.onBotaoCorreto - Chamado quando um botão correto é pressionado.
 * @param {Function} options.onPuzzleResolvido - Chamado quando o puzzle é completado.
 * @param {Function} options.onBotaoErrado - Chamado quando um botão errado é pressionado.
 */
export function usePuzzle({ onBotaoCorreto, onPuzzleResolvido, onBotaoErrado }) {
  // A solução para o puzzle atual. É definida por 'iniciarPuzzle'.
  const sequenciaCorreta = ref([]);
  // A sequência que o jogador está inserindo.
  const sequenciaAtual = ref([]);
  // O estado geral do puzzle.
  const puzzleStatus = ref('incompleto');

  /**
   * Prepara a máquina para um novo puzzle, definindo a solução correta
   * e resetando o progresso do jogador.
   * @param {string[]} novaSequencia - O array com a nova solução.
   */
  function iniciarPuzzle(novaSequencia = []) {
    sequenciaCorreta.value = novaSequencia;
    sequenciaAtual.value = [];
    puzzleStatus.value = 'incompleto';
  }

  /**
   * Limpa a tentativa do jogador quando ele comete um erro.
   */
  function resetarTentativa() {
    if (onBotaoErrado) onBotaoErrado(); 
    console.log("Ordem errada! Resetando a tentativa.");
    sequenciaAtual.value = [];
  }

  /**
   * A função principal que processa a ativação de um botão.
   * @param {string} idBotao - O ID do botão que o jogador ativou.
   */
  function ativarBotao(idBotao) {
    // Várias condições para ignorar a ativação se não for permitida.
    if (puzzleStatus.value === 'resolvido' || sequenciaAtual.value.includes(idBotao) || sequenciaCorreta.value.length === 0) {
      return;
    }

    sequenciaAtual.value.push(idBotao);

    // Compara a tentativa do jogador com a parte correspondente da solução.
    const parteCorreta = sequenciaCorreta.value.slice(0, sequenciaAtual.value.length);
    const estaCorreto = JSON.stringify(sequenciaAtual.value) === JSON.stringify(parteCorreta);

    if (!estaCorreto) {
      resetarTentativa();
    } else {
      // Se o passo está correto, notifica através do callback.
      if (onBotaoCorreto) onBotaoCorreto();

      // Se o passo está correto E a sequência está completa, o puzzle é resolvido.
      if (sequenciaAtual.value.length === sequenciaCorreta.value.length) {
        if (onPuzzleResolvido) onPuzzleResolvido();
        puzzleStatus.value = 'resolvido';
      }
    }
  }
  
  /**
   * Verifica se um botão já foi ativado na tentativa atual.
   * Usado em Game.vue para decidir se abre o diálogo de interação.
   */
  function podeAtivar(idBotao) {
      return !sequenciaAtual.value.includes(idBotao);
  }

  return {
    puzzleStatus,
    ativarBotao,
    podeAtivar,
    iniciarPuzzle,
    sequenciaAtual 
  };
}