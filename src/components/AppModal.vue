<script setup lang="ts">
const emit = defineEmits<{
  close: [];
}>();

function closeModal() {
  emit("close");
}
</script>

<template>
  <Teleport to="body">
    <div class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="title" v-if="$slots.title">
          <slot name="title" />
        </div>
        <div @click="closeModal" class="close">X</div>
        <slot name="body" />
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;

  background-color: $color-backdrop;
}
.modal-content {
  position: relative;
  max-width: 600px;
  width: 100%;
  padding: 16px;
  margin: 0 12px;

  background-color: $color-white;
  border-radius: $border-radius;
}
.title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
}
.close {
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
}
</style>
