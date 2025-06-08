<script setup>
import { ref } from 'vue';
import MainMenu from './components/MainMenu.vue';
import Game from './components/Game.vue';

// Agora só precisamos de dois estados: 'menu' e 'playing'
const gameState = ref('menu');

// A função foi renomeada para ser mais genérica
function startGame() {
  gameState.value = 'playing';
}
</script>

<template>
  <div id="app-container">
    <MainMenu 
      v-if="gameState === 'menu'" 
      @new-game="startGame" 
    />
    
    <Game 
      v-if="gameState === 'playing'" 
    />
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