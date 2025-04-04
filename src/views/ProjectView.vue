<script setup lang="ts">
import { useRoute } from "vue-router";
import TasksTable from "@/components/TasksTable.vue";
import { useProjectStore } from "@/stores/projects";

const route = useRoute();
const projectStore = useProjectStore();

const project = projectStore.getProjectById(route.params.id as string);
</script>

<template>
  <h1 class="project-title">Project: {{ project?.name }}</h1>
  <TasksTable />
</template>
