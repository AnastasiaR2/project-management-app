<script setup lang="ts">
import ProjectsTable from "@/features/projects/ProjectsTable.vue";
import AppModal from "@/components/AppModal.vue";
import AppButton from "@/components/AppButton.vue";
import ProjectForm from "@/features/projects/ProjectForm.vue";
import type { Project } from "@/services/projects/types";

import { ref } from "vue";
const isModalOpen = ref(false);

function handleAddProject(project: Project) {
  console.log("New project:", project);
  isModalOpen.value = false;
}
</script>

<template>
  <main>
    <h1 class="project-title">Projects</h1>
    <AppButton @click="isModalOpen = true">Add Project</AppButton>
    <AppModal v-if="isModalOpen" @close="isModalOpen = false">
      <template #body><ProjectForm @submit="handleAddProject" /></template>
    </AppModal>
    <ProjectsTable />
  </main>
</template>

<style lang="scss">
.project-title {
  margin-bottom: 10px;
}
</style>
