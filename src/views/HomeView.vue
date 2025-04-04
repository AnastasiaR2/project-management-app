<script setup lang="ts">
import { ref } from "vue";
import ProjectsTable from "@/features/projects/ProjectsTable.vue";
import AppModal from "@/components/AppModal.vue";
import AppButton from "@/components/AppButton.vue";
import ProjectForm from "@/features/projects/ProjectForm.vue";
import type { Project } from "@/services/projects/types";
import { useProjectStore } from "@/stores/projects";

const isModalOpen = ref(false);

const projectStore = useProjectStore();

async function handleAddProject(project: Project) {
  const response = await projectStore.dispatchCreateProject(project);

  if (response?.status === 201) {
    isModalOpen.value = false;
  } else {
    console.error("Failed to create project:", response?.status);
  }
}
</script>

<template>
  <main>
    <div class="main-title-wrapper">
      <h1>Projects</h1>
      <AppButton @click="isModalOpen = true">Add Project</AppButton>
    </div>
    <AppModal v-if="isModalOpen" @close="isModalOpen = false">
      <template #body><ProjectForm @submit="handleAddProject" /></template>
    </AppModal>
    <ProjectsTable />
  </main>
</template>
