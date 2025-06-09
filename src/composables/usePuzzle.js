import { ref } from 'vue';

// A função agora espera um objeto com 'callbacks' como parâmetro
export function usePuzzle({ onBotaoCorreto, onPuzzleResolvido, onBotaoErrado }) {
  const sequenciaCorreta = ref([]);
  const sequenciaAtual = ref([]);
  const puzzleStatus = ref('incompleto');

  function iniciarPuzzle(novaSequencia = []) {
    sequenciaCorreta.value = novaSequencia;
    sequenciaAtual.value = [];
    puzzleStatus.value = 'incompleto';
  }

  function resetarTentativa() {
    // Chama o callback de erro, se ele foi fornecido
    if (onBotaoErrado) onBotaoErrado(); 
    console.log("Ordem errada! Resetando a tentativa.");
    sequenciaAtual.value = [];
  }

  function ativarBotao(idBotao) {
    if (puzzleStatus.value === 'resolvido' || sequenciaAtual.value.includes(idBotao) || sequenciaCorreta.value.length === 0) {
      return;
    }

    sequenciaAtual.value.push(idBotao);
    console.log("Sequência do jogador:", sequenciaAtual.value);

    const parteCorreta = sequenciaCorreta.value.slice(0, sequenciaAtual.value.length);
    const estaCorreto = JSON.stringify(sequenciaAtual.value) === JSON.stringify(parteCorreta);

    if (!estaCorreto) {
      resetarTentativa();
    } else {
      // Se estiver correto, chama o callback de acerto
      if (onBotaoCorreto) onBotaoCorreto();

      if (sequenciaAtual.value.length === sequenciaCorreta.value.length) {
        // Se completou a sequência, chama o callback de puzzle resolvido
        if (onPuzzleResolvido) onPuzzleResolvido();
        console.log("PUZZLE RESOLVIDO!");
        puzzleStatus.value = 'resolvido';
      }
    }
  }
  
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