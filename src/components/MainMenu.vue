<script setup>
import imageUrl from '../assets/Menu/Menu.png';

const emit = defineEmits(['newGame']);

function handleNewGame() {
  emit('newGame');
}

function handleOpenSettings() {
  window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
}
</script>

<template>
  <div class="menu-container" :style="{ backgroundImage: `url(${imageUrl})` }">
    <div class="buttons-wrapper">
      <button class="menu-button" @click="handleNewGame">
        Novo Jogo
      </button>

      <button class="menu-button" @click="handleOpenSettings">
        Configurações
      </button>
    </div>
  </div>
</template>

<style scoped>
/* --- ALTERAÇÃO AQUI --- */
.menu-container {
  width: 100%;
  height: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 130px;}

/* --- ALTERAÇÃO AQUI --- */
.buttons-wrapper {
  display: flex;
  flex-direction: column; /* ADICIONADO para empilhar os botões */
  gap: 30px; /* Reduzi um pouco o espaço para ficar melhor na vertical */
}

/* O estilo do botão em si não muda */
.menu-button {
  /* Tamanho e Fonte */
  padding: 20px 30px;
  font-size: 1.8rem;
  font-family: 'Courier New', Courier, monospace;
  color: #502d16;
  font-weight: bold;
  
  /* Aparência */
  background-color: #f7e1a9;
  border: 4px solid #502d16;
  border-radius: 0;
  
  /* Sombra Pixelada */
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.4);

  cursor: pointer;
  text-shadow: 2px 2px 0px #fdf3d8;
  
  /* Transição e Posição */
  position: relative;
  transition: top 0.05s ease, left 0.05s ease;
  top: 0;
  left: 0;
}

.menu-button:hover {
  background-color: #fff2c7;
}

.menu-button:active {
  top: 6px;
  left: 6px;
  box-shadow: none;
}
</style>