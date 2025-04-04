<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import DataTable from "./DataTable.vue";
import { useTaskStore } from "@/stores/tasks";

const columns = [
  { key: "id", label: "ID" },
  { key: "title", label: "Task Title" },
  { key: "assignee", label: "Assignee" },
  { key: "status", label: "Status" },
  { key: "dueDate", label: "Due Date" },
];

const route = useRoute();
const projectId = route.params.id as string;

const taskStore = useTaskStore();

onMounted(async () => {
  await taskStore.dispatchGetTasks();
});

const filteredTasks = taskStore.getTasksByProjectId(projectId);
</script>

<template>
  <DataTable :columns="columns" :data="filteredTasks" />
</template>
