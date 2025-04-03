<script setup lang="ts">
import { onMounted } from "vue";
import { useProjectStore } from "@/stores/projects";
import DataTable from "@/components/DataTable.vue";

const projectStore = useProjectStore();

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status" },
  { key: "tasksCount", label: "Tasks Count" },
  { key: "createdAt", label: "Created At" },
];

onMounted(async () => {
  await projectStore.dispatchGetProjects();
});
</script>

<template>
  <main>
    <DataTable :columns="columns" :data="projectStore.projects"> </DataTable>
  </main>
</template>
