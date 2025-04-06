<script setup lang="ts">
import { ref } from "vue";
import ProjectsTable from "@/features/projects/ProjectsTable.vue";
import AppModal from "@/components/AppModal.vue";
import AppButton from "@/components/AppButton.vue";
import ProjectForm from "@/features/projects/ProjectForm.vue";
import type { Project } from "@/services/projects/types";
import { useProjectStore } from "@/stores/projects";
import { useTaskStore } from "@/stores/tasks";

const isAddOrEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const currentProject = ref({} as Project);
const projectIdToDelete = ref("");

const projectStore = useProjectStore();
const taskStore = useTaskStore();

async function handleAddProject(project: Project) {
  const response = await projectStore.dispatchCreateProject(project);

  if (response?.status === 201) {
    isAddOrEditModalOpen.value = false;
  } else {
    console.error("Failed to create project:", response?.status);
  }
}

async function handleUpdateProject(project: Project) {
  const response = await projectStore.dispatchUpdateProject(project);

  if (response?.status === 200) {
    isAddOrEditModalOpen.value = false;
  } else {
    console.error("Failed to update project:", response?.status);
  }
}

async function handleDeleteProject(id: string) {
  const response = await projectStore.dispatchDeleteProject(id);

  if (response?.status === 200) {
    isDeleteModalOpen.value = false;
    const projectTasks = taskStore.getTasksByProjectId(id);
    const projectTaskIds = projectTasks.map((task) => task.id);

    for (const taskId of projectTaskIds) {
      await taskStore.dispatchDeleteTask(taskId);
    }
  } else {
    console.error("Failed to delete project:", response?.status);
  }
}

function handleEditProject(project: Project) {
  currentProject.value = project;
  isAddOrEditModalOpen.value = true;
}

function handleDeleteModalOpen(id: string) {
  projectIdToDelete.value = id;
  isDeleteModalOpen.value = true;
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
      <AppButton @click="isAddOrEditModalOpen = true">Add Project</AppButton>
    </div>
    <AppModal v-if="isAddOrEditModalOpen" @close="isAddOrEditModalOpen = false">
      <template #body>
        <ProjectForm @submit="submitProject" :project="currentProject" />
      </template>
    </AppModal>
    <AppModal v-if="isDeleteModalOpen" @close="isDeleteModalOpen = false">
      <template #title> Are you sure you want to delete this project? </template>
      <template #body>
        <p>All associated tasks will be removed as well.</p>
        <div class="buttons-wrapper">
          <AppButton @click="isDeleteModalOpen = false">Cancel</AppButton>
          <AppButton @click="handleDeleteProject(projectIdToDelete)">Delete</AppButton>
        </div>
      </template>
    </AppModal>
    <ProjectsTable @edit="handleEditProject" @delete="handleDeleteModalOpen" />
  </main>
</template>

<style scoped lang="scss">
.buttons-wrapper {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>
