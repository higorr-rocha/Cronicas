import { ref } from 'vue';

export function usePuzzle() {
  const sequenciaCorreta = ref([]);
  const sequenciaAtual = ref([]);
  const puzzleStatus = ref('incompleto');

  function iniciarPuzzle(novaSequencia = []) {
    console.log("Iniciando puzzle com a sequência:", novaSequencia);
    sequenciaCorreta.value = novaSequencia;
    sequenciaAtual.value = [];
    puzzleStatus.value = 'incompleto';
  }

  function resetarTentativa() {
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
    } else if (sequenciaAtual.value.length === sequenciaCorreta.value.length) {
      console.log("PUZZLE RESOLVIDO!");
      puzzleStatus.value = 'resolvido';
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