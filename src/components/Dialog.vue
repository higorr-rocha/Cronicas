<template>
  <div class="dialog-box" v-if="visible">
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  message: String
});
</script>

<style scoped>
.dialog-box {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 12px 20px;
  border: 2px solid white;
  font-family: monospace;
  font-size: 16px;
  white-space: pre;
  z-index: 10;
}
</style>
