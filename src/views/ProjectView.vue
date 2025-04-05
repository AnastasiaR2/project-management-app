<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import TasksTable from "@/features/tasks/TasksTable.vue";
import AppModal from "@/components/AppModal.vue";
import AppButton from "@/components/AppButton.vue";
import TaskForm from "@/features/tasks/TaskForm.vue";
import { useProjectStore } from "@/stores/projects";
import { useTaskStore } from "@/stores/tasks";
import type { Task } from "@/services/tasks/types";

const isModalOpen = ref(false);

const route = useRoute();
const projectStore = useProjectStore();
const taskStore = useTaskStore();

const project = projectStore.getProjectById(route.params.id as string);
const projectId = project.value?.id;

async function handleAddTask(task: Task) {
  const response = await taskStore.dispatchCreateTask(task);

  if (response?.status === 201) {
    isModalOpen.value = false;
    if (projectId) {
      await projectStore.dispatchUpdateProject({
        ...project.value,
        tasksCount: taskStore.getTasksByProjectId(projectId).value.length,
      });
    }
  } else {
    console.error("Failed to create task:", response?.status);
  }
}
</script>

<template>
  <div class="main-title-wrapper">
    <h1 class="project-title">Project: {{ project?.name }}</h1>
    <AppButton @click="isModalOpen = true">Add Task</AppButton>
  </div>
  <AppModal v-if="isModalOpen" @close="isModalOpen = false">
    <template #body>
      <TaskForm :projectId="project?.id as string" @submit="handleAddTask" />
    </template>
  </AppModal>
  <TasksTable />
</template>
