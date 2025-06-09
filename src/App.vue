<script setup>
import { ref } from 'vue';
import { Howl } from 'howler';
import MainMenu from './components/MainMenu.vue';
import Game from './components/Game.vue';
import StoryScreen from './components/StoryScreen.vue';
import EndScreen from './components/EndScreen.vue';
import backgroundMusicSrc from './assets/Sons/musica_fundo.mp3';
import finalSoundSrc from './assets/Sons/Fim.ogg';

// Música de fundo
const musicaFundo = new Howl({
  src: [backgroundMusicSrc],
  loop: true,
  volume: 0.1,
});

// Som de finalização
const somFinal = new Howl({
  src: [finalSoundSrc],
  loop: false,
  volume: 1.0,
});

// 2. ADICIONE O NOVO ESTADO 'story'
const gameState = ref('menu');

function startGame() {
  // Agora, "Novo Jogo" leva para a tela de história
  gameState.value = 'story';
}

// 3. CRIE A FUNÇÃO para ir da história para o jogo
function enterGame() {
  gameState.value = 'playing';

  if (!musicaFundo.playing()) {
    musicaFundo.play();
  }
}

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
#app-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #181818;
}
</style>