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

const isAddOrEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const currentTask = ref({} as Task);
const taskIdToDelete = ref("");

const route = useRoute();
const projectStore = useProjectStore();
const taskStore = useTaskStore();

const project = projectStore.getProjectById(route.params.id as string);
const projectId = project.value?.id;

async function handleAddTask(task: Task) {
  const response = await taskStore.dispatchCreateTask(task);

  if (response?.status === 201) {
    isAddOrEditModalOpen.value = false;
    if (projectId) {
      await projectStore.dispatchUpdateProject({
        ...project.value,
        tasksCount: taskStore.getTasksByProjectId(projectId).length,
      });
    }
  } else {
    console.error("Failed to create task:", response?.status);
  }
}

async function handleUpdateTask(task: Task) {
  const response = await taskStore.dispatchUpdateTask(task);

  if (response?.status === 200) {
    isAddOrEditModalOpen.value = false;
  } else {
    console.error("Failed to update task:", response?.status);
  }
}

async function handleDeleteTask(id: string) {
  const response = await taskStore.dispatchDeleteTask(id);

  if (response?.status === 200) {
    isDeleteModalOpen.value = false;
    if (projectId) {
      await projectStore.dispatchUpdateProject({
        ...project.value,
        tasksCount: taskStore.getTasksByProjectId(projectId).length,
      });
    }
  } else {
    console.error("Failed to delete task:", response?.status);
  }
}

function handleEditTask(task: Task) {
  currentTask.value = task;
  isAddOrEditModalOpen.value = true;
}

function handleDeleteModalOpen(id: string) {
  taskIdToDelete.value = id;
  isDeleteModalOpen.value = true;
}

function submitTask(task: Task) {
  if (currentTask.value && currentTask.value.id) {
    handleUpdateTask(task);
  } else {
    handleAddTask(task);
  }
}
</script>

<template>
  <div class="main-title-wrapper">
    <h1 class="project-title">Project: {{ project?.name }}</h1>
    <AppButton @click="isAddOrEditModalOpen = true">Add Task</AppButton>
  </div>
  <AppModal v-if="isAddOrEditModalOpen" @close="isAddOrEditModalOpen = false">
    <template #body>
      <TaskForm :projectId="project?.id as string" @submit="submitTask" :task="currentTask" />
    </template>
  </AppModal>
  <AppModal v-if="isDeleteModalOpen" @close="isDeleteModalOpen = false">
    <template #title> Are you sure you want to delete this task? </template>
    <template #body>
      <div class="buttons-wrapper">
        <AppButton @click="isDeleteModalOpen = false">Cancel</AppButton>
        <AppButton @click="handleDeleteTask(taskIdToDelete)">Delete</AppButton>
      </div>
    </template>
  </AppModal>
  <TasksTable @edit="handleEditTask" @delete="handleDeleteModalOpen" />
</template>

<style scoped lang="scss">
.buttons-wrapper {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>
