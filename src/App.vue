<script setup>
// Importações do Vue e da biblioteca de áudio.
import { ref } from 'vue';
import { Howl } from 'howler';

// Importa os componentes filhos que este App.vue irá controlar.
import MainMenu from './components/MainMenu.vue';
import Game from './components/Game.vue';
import StoryScreen from './components/StoryScreen.vue';
import EndScreen from './components/EndScreen.vue';

// Importa os arquivos de áudio.
import backgroundMusicSrc from './assets/Sons/musica_fundo.mp3';
import finalSoundSrc from './assets/Sons/Fim.ogg';

// --- GERENCIAMENTO DE ÁUDIO GLOBAL ---

// Cria a instância da música de fundo.
const musicaFundo = new Howl({
  src: [backgroundMusicSrc],
  loop: true,   // Garante que a música toque continuamente.
  volume: 0.1,  // Define um volume baixo para não atrapalhar outros sons.
});

// Cria a instância para o som de finalização do jogo.
const somFinal = new Howl({
  src: [finalSoundSrc],
  loop: false, // Não repete, toca apenas uma vez.
  volume: 1.0,
});

// --- GERENCIAMENTO DE ESTADO DO JOGO ---

// 'gameState' é a variável reativa que controla qual tela é exibida.
// Começa com 'menu' para mostrar o menu principal ao iniciar.
const gameState = ref('menu');

/**
 * Função chamada quando o jogador clica em "Novo Jogo" no MainMenu.
 * Muda o estado para 'story', exibindo a tela de história.
 */
function startGame() {
  gameState.value = 'story';
}

/**
 * Função chamada quando o jogador clica em "Continuar" na tela de história.
 * Muda o estado para 'playing', exibindo o componente principal do jogo (Game.vue).
 * Também inicia a música de fundo.
 */
function enterGame() {
  gameState.value = 'playing';

  // Garante que a música só comece a tocar uma vez.
  if (!musicaFundo.playing()) {
    musicaFundo.play();
  }
}

/**
 * Função chamada quando o jogo emite o evento 'end-game'.
 * Para a música de fundo, toca o som de vitória e muda para a tela final.
 */
function triggerEndGame() {
  musicaFundo.stop();
  somFinal.play();
  gameState.value = 'ended';
}
</script>

<template>
  <div id="app-container">
    <MainMenu v-if="gameState === 'menu'" @new-game="startGame" />

    <StoryScreen v-if="gameState === 'story'" @continue-to-game="enterGame" />
    
    <Game v-if="gameState === 'playing'" @end-game="triggerEndGame" />
    
    <EndScreen v-if="gameState === 'ended'" />
  </div>
</template>

<style scoped>
/* Estilo do contêiner principal para garantir que ele ocupe toda a tela
   e centralize o componente filho ativo. */
#app-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #181818;
}
</style>