<script setup lang="ts">
import AppButton from "./AppButton.vue";
defineProps<{
  item: Record<string, string | number>;
}>();

const emit = defineEmits<{
  edit: [item: Record<string, string | number>];
  delete: [id: string];
}>();
</script>

<template>
  <div class="buttons-wrapper">
    <AppButton variant="icon-button" @click.stop="emit('edit', item)" title="Edit">
      <img src="@/components/icons/edit-icon.svg" alt="Edit" />
    </AppButton>

    <AppButton
      variant="icon-button"
      @click.stop="$emit('delete', item.id as string)"
      title="Delete"
    >
      <img src="@/components/icons/delete-icon.svg" alt="Delete" />
    </AppButton>
  </div>
</template>

<style scoped lang="scss">
.buttons-wrapper {
  text-align: right;
}
</style>
