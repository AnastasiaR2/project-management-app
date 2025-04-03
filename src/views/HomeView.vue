<script setup lang="ts">
import DataTable from "@/components/DataTable.vue";
const projects = [
  {
    id: "1",
    name: "Project 1",
    description: "Description of Project 1",
    status: "In Progress",
    tasksCount: 5,
    createdAt: "2025-04-10",
  },
  {
    id: "2",
    name: "Project 2",
    description: "Description of Project 2",
    status: "Completed",
    tasksCount: 3,
    createdAt: "2025-05-10",
  },
];
const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status" },
  { key: "tasksCount", label: "Tasks Count" },
  { key: "createdAt", label: "Created At" },
];
</script>

<template>
  <main>
    <DataTable :columns="columns" :data="projects"> </DataTable>
  </main>
</template>
