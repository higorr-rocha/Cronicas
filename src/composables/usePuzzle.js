// src/composables/usePuzzle.js
import { ref } from 'vue';

// ===================================================================
// DEFINA AQUI A SOLUÇÃO DO PUZZLE
// A ordem dos 'id' dos botões deve corresponder à que você definiu
// em useColisoes.js
// ===================================================================
const sequenciaCorreta = ['btn_chao_1', 'btn_chao_3', 'btn_parede_1', 'btn_parede_4', 'btn_parede_2', 'btn_chao_2', 'btn_parede_3', 'btn_parede_6', 'btn_chao_4', 'btn_parede_5', 'btn_parede_7'];

export function usePuzzle() {
  // Guarda a sequência que o jogador está tentando (ex: ['btn_chao_1'])
  const sequenciaAtual = ref([]);
  
  // Guarda o status do puzzle: 'incompleto' ou 'resolvido'
  const puzzleStatus = ref('incompleto');

  /**
   * Reseta a tentativa do jogador se ele errar a ordem.
   */
  function resetarPuzzle() {
    console.log("Ordem errada! Resetando o puzzle.");
    sequenciaAtual.value = [];
  }

  /**
   * Função principal chamada quando um botão é ativado.
   * @param {string} idBotao - O ID do botão que foi ativado.
   */
  function ativarBotao(idBotao) {
    // Se o puzzle já foi resolvido ou se este botão específico já foi 
    // ativado na sequência atual, não faz nada.
    if (puzzleStatus.value === 'resolvido' || sequenciaAtual.value.includes(idBotao)) {
      return; 
    }

    // Adiciona o botão à sequência da tentativa atual do jogador.
    sequenciaAtual.value.push(idBotao);
    console.log("Sequência do jogador:", sequenciaAtual.value);

    // Compara a sequência do jogador com a sequência correta.
    const parteDaSequenciaCorreta = sequenciaCorreta.slice(0, sequenciaAtual.value.length);
    const estaCorreto = JSON.stringify(sequenciaAtual.value) === JSON.stringify(parteDaSequenciaCorreta);

    if (!estaCorreto) {
      // Se em qualquer ponto a sequência estiver errada, reseta.
      resetarPuzzle();
    } else if (sequenciaAtual.value.length === sequenciaCorreta.length) {
      // Se a sequência estiver correta E tiver o mesmo tamanho da solução, o puzzle foi resolvido.
      console.log("PUZZLE RESOLVIDO!");
      puzzleStatus.value = 'resolvido';
    }
  }
  
  /**
   * Uma função auxiliar para verificar se um botão já foi pressionado na tentativa atual.
   * @param {string} idBotao - O ID do botão a ser verificado.
   */
  function podeAtivar(idBotao) {
      return !sequenciaAtual.value.includes(idBotao);
  }

  return {
    puzzleStatus,
    ativarBotao,
    podeAtivar,
    // Exportamos a sequência atual para fins de depuração, se necessário
    sequenciaAtual 
  };
}