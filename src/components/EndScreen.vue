<template>
  <div class="end-container">
    <h1 class="end-text">FIM</h1>
  </div>
</template>

<style scoped>
/* Estiliza o contêiner para ocupar a tela inteira e centralizar seu conteúdo. */
.end-container {
  width: 100%;
  height: 100%;
  background-color: #000;
  color: #fff;
  display: flex; /* Ativa o layout flexbox. */
  justify-content: center; /* Centraliza horizontalmente. */
  align-items: center;     /* Centraliza verticalmente. */
  font-family: 'Courier New', Courier, monospace;
}

/* Estiliza o texto "FIM". */
.end-text {
  font-size: 5rem;
  font-weight: bold;
  /* Aplica a animação 'fadeIn' que definimos abaixo. */
  animation: fadeIn 5s ease-in;
}

/* Define a animação de fade-in. */
@keyframes fadeIn {
  /* No início da animação, o texto está totalmente transparente. */
  from {
    opacity: 0;
  }
  /* Ao final da animação, o texto está totalmente visível. */
  to {
    opacity: 1;
  }
}
</style>