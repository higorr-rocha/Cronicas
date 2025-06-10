<template>
  <div class="dialog-box" v-if="visible">
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
// Define as "props" que este componente aceita do seu componente pai (Game.vue).
// É assim que o Game.vue envia os dados para o diálogo.
defineProps({
  // Controla se a caixa de diálogo está visível ou não.
  visible: Boolean,
  // O texto que será exibido dentro da caixa de diálogo.
  message: String
});
</script>

<style scoped>
/* Estiliza a caixa de diálogo. */
.dialog-box {
  /* Posicionamento absoluto para sobrepor o canvas do jogo. */
  position: absolute;
  /* Distância da parte inferior da tela. */
  bottom: 200px;
  /* Truque de CSS para centralizar horizontalmente: move o início do elemento para o meio... */
  left: 50%;
  /* ...e então o desloca para a esquerda pela metade de sua própria largura. */
  transform: translateX(-50%);

  /* Estilo visual: fundo escuro, texto branco, borda. */
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 12px 20px;
  border: 2px solid white;
  
  /* Estilo da fonte, 'monospace' para um visual retro/de terminal. */
  font-family: monospace;
  font-size: 16px;
  
  /* Crucial: preserva os espaços em branco e quebras de linha (\n) da string da mensagem. */
  white-space: pre;
  
  /* Garante que o diálogo fique por cima de outros elementos. */
  z-index: 10;
}
</style>