<script setup lang="ts">
import { ref } from "vue";
import ProjectsTable from "@/features/projects/ProjectsTable.vue";
import AppModal from "@/components/AppModal.vue";
import AppButton from "@/components/AppButton.vue";
import ProjectForm from "@/features/projects/ProjectForm.vue";
import type { Project } from "@/services/projects/types";
import { useProjectStore } from "@/stores/projects";

const isModalOpen = ref(false);
const currentProject = ref({} as Project);

const projectStore = useProjectStore();

async function handleAddProject(project: Project) {
  const response = await projectStore.dispatchCreateProject(project);

  if (response?.status === 201) {
    isModalOpen.value = false;
  } else {
    console.error("Failed to create project:", response?.status);
  }
}

async function handleUpdateProject(project: Project) {
  const response = await projectStore.dispatchUpdateProject(project);

  if (response?.status === 200) {
    isModalOpen.value = false;
  } else {
    console.error("Failed to update project:", response?.status);
  }
}

function handleEditProject(project: Project) {
  currentProject.value = project;
  isModalOpen.value = true;
}

function submitProject(project: Project) {
  if (currentProject.value && currentProject.value.id) {
    handleUpdateProject(project);
  } else {
    handleAddProject(project);
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
      <template #body>
        <ProjectForm @submit="submitProject" :project="currentProject" />
      </template>
    </AppModal>
    <ProjectsTable @edit-btn-clicked="handleEditProject" />
  </main>
</template>
