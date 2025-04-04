<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import TasksTable from "@/features/tasks/TasksTable.vue";
import AppModal from "@/components/AppModal.vue";
import AppButton from "@/components/AppButton.vue";
import { useProjectStore } from "@/stores/projects";

const isModalOpen = ref(false);

const route = useRoute();
const projectStore = useProjectStore();

const project = projectStore.getProjectById(route.params.id as string);
</script>

<template>
  <div class="main-title-wrapper">
    <h1 class="project-title">Project: {{ project?.name }}</h1>
    <AppButton @click="isModalOpen = true">Add Task</AppButton>
  </div>
  <AppModal v-if="isModalOpen" @close="isModalOpen = false">
    <template #body>Just some text</template>
  </AppModal>
  <TasksTable />
</template>
