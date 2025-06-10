<script setup>
// Importa a imagem do menu para ser usada no template.
import imageUrl from '../assets/Menu/Menu.png';

// Define os eventos que este componente pode emitir para seu pai (App.vue).
const emit = defineEmits(['newGame']);

/**
 * Função chamada quando o botão "Novo Jogo" é clicado.
 * Emite o evento 'newGame' para o componente pai.
 */
function handleNewGame() {
  emit('newGame');
}

/**
 * Função chamada quando o botão "Configurações" é clicado.
 * Abre um link externo em uma nova aba.
 */
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
/* Estiliza o contêiner principal do menu. */
.menu-container {
  width: 100%;
  height: 100%;
  /* Garante que a imagem inteira seja visível, sem cortes. */
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  /* Flexbox para centralizar o 'buttons-wrapper'. */
  display: flex;
  justify-content: center;
  align-items: center;
  /* Ajuste para descer os botões. */
  padding-top: 130px;
}

/* Organiza os botões. */
.buttons-wrapper {
  display: flex;
  /* Empilha os botões verticalmente. */
  flex-direction: column; 
  /* Adiciona um espaço entre os botões. */
  gap: 30px;
}

/* Estilo principal para os botões do menu. */
.menu-button {
  /* Espaçamento interno e tamanho da fonte. */
  padding: 20px 30px;
  font-size: 1.8rem;
  font-family: 'Courier New', Courier, monospace;
  color: #502d16;
  font-weight: bold;
  
  /* Cor de fundo e borda. */
  background-color: #f7e1a9;
  border: 4px solid #502d16;
  border-radius: 0; /* Bordas quadradas para um estilo retro. */
  
  /* Efeito de sombra "pixelada", sem blur. */
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.4);

  cursor: pointer;
  /* Efeito de sombra interna no texto para dar profundidade. */
  text-shadow: 2px 2px 0px #fdf3d8;
  
  /* Prepara o botão para a animação de clique. */
  position: relative;
  transition: top 0.05s ease, left 0.05s ease;
  top: 0;
  left: 0;
}

/* Efeito ao passar o mouse por cima. */
.menu-button:hover {
  background-color: #fff2c7;
}

/* Efeito de "botão pressionado" quando clicado. */
.menu-button:active {
  /* Move o botão para baixo e para a direita, alinhando com a sombra. */
  top: 6px;
  left: 6px;
  /* Remove a sombra para dar a ilusão de que foi "pressionado para dentro". */
  box-shadow: none;
}
</style>