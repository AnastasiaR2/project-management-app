<script setup lang="ts">
defineProps<{
  variant?: "button" | "icon-button";
}>();
</script>

<template>
  <button :class="[variant ?? 'button']"><slot /></button>
</template>

<style scoped lang="scss">
button {
  border: none;
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba($primary-color, 0.5);
  }
}
.button {
  font-weight: bold;
  border-radius: $border-radius;
  padding: 12px 24px;
  color: $color-white;
  background-color: $primary-color;
  transition: background-color 0.2s ease;
  letter-spacing: 0.8px;

  &:hover {
    background-color: $primary-color-darker;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
}

.icon-button {
  background: transparent;
}
</style>
