<template>
  <div style="position: relative;">
    <GameCanvas ref="gameCanvas" />
    <DialogBox
      :visible="gameCanvas?.dialog.visible"
      :message="gameCanvas?.dialog.message"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import GameCanvas from './components/Game.vue';
import DialogBox from './components/Dialog.vue';

const gameCanvas = ref(null);

</script>
