<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import DataTable from "@/components/DataTable.vue";
import { useProjectStore } from "@/stores/projects";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status" },
  { key: "tasksCount", label: "Tasks Count" },
  { key: "createdAt", label: "Created At" },
];

const router = useRouter();
const projectStore = useProjectStore();

onMounted(async () => {
  await projectStore.dispatchGetProjects();
});

function rowSelected(id: string) {
  router.push({ name: "project", params: { id } });
}
</script>

<template>
  <DataTable :columns="columns" :data="projectStore.projects" @row-selected="rowSelected" />
</template>
