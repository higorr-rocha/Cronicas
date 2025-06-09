<template>
  <div class="end-container">
    <h1 class="end-text">FIM</h1>
  </div>
</template>

<style scoped>
.end-container {
  width: 100%;
  height: 100%;
  background-color: #000;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Courier New', Courier, monospace;
}

.end-text {
  font-size: 5rem;
  font-weight: bold;
  /* Animação de fade-in para o texto */
  animation: fadeIn 5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>