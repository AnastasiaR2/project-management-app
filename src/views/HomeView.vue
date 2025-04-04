<script setup lang="ts">
import ProjectsTable from "@/features/projects/ProjectsTable.vue";
import AppModal from "@/components/AppModal.vue";
import AppButton from "@/components/AppButton.vue";

import { ref } from "vue";
const isModalOpen = ref(false);
</script>

<template>
  <main>
    <h1 class="project-title">Projects</h1>
    <AppButton @click="isModalOpen = true">Add Project</AppButton>
    <AppModal v-if="isModalOpen" @close="isModalOpen = false">
      <template #title>Add Project</template>
      <template #body> Complete this form to add your next project! </template>
    </AppModal>
    <ProjectsTable />
  </main>
</template>

<style lang="scss">
.project-title {
  margin-bottom: 10px;
}
</style>
