<template>
  <button><slot /></button>
</template>

<style scoped lang="scss">
button {
  font-weight: bold;
  border-radius: $border-radius;
  padding: 12px 24px;
  border: none;
  color: $color-white;
  background-color: $primary-color;
  cursor: pointer;
  transition: background-color 0.2s ease;
  letter-spacing: 0.8px;

  &:hover {
    background-color: $primary-color-darker;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba($primary-color, 0.5);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
}
</style>
