<script setup>
const emit = defineEmits(['continueToGame']);

function handleContinue() {
  emit('continueToGame');
}
</script>

<template>
  <div class="story-container">
    <div class="story-content">
      <p class="story-text">
        O tempo deixa sussurros, meu avô costumava dizer. 
        <br> Ecos de histórias gravados na pedra e na areia. 
        <br>Ele seguiu esses sussurros até o maior deles: o Khronóvoros. 
        <br>E então, foi silenciado. 
        <br>Hoje, sigo os rastros dele até Nea Olympia, onde o passado respira através das ruínas. 
        <br>Enquanto outros buscam o poder do artefato, eu busco sua história. Desvendar o que ele é, o que ele fez... e por que levou meu avô. 
        <br>O maior segredo não é como controlar o tempo, mas sim como ouvi-lo.
      </p>
      <button class="continue-button" @click="handleContinue">
        Continuar
      </button>
    </div>
  </div>
</template>

<style scoped>
.story-container {
  width: 100%;
  height: 100%;
  background-color: #000;
  color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Courier New', Courier, monospace;
}

.story-content {
  text-align: center;
  max-width: 800px;
  padding: 40px;
  border: 2px solid #555;
  background-color: #1a1a1a;
}

.story-text {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 40px;
}

.continue-button {
  padding: 15px 30px;
  font-size: 1.5rem;
  color: #f0f0f0;
  background-color: #333;
  border: 2px solid #555;
  cursor: pointer;
  transition: background-color 0.3s;
}

.continue-button:hover {
  background-color: #444;
}
</style>