<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import AppTable from "@/components/AppTable.vue";
import { useProjectStore } from "@/stores/projects";
import type { Project } from "@/features/projects/project.types";

const columns = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "description", label: "Description" },
  { key: "status", label: "Status", sortable: true },
  { key: "tasksCount", label: "Tasks Count", sortable: true },
  { key: "createdAt", label: "Created At", sortable: true },
  { key: "actions", label: "" },
];

const emit = defineEmits<{
  edit: [project: Project];
  delete: [id: string];
}>();

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
  <AppTable
    :columns="columns"
    :data="projectStore.projects"
    table-id="projects - table"
    :resizable="true"
    @row-selected="rowSelected"
    @edit="(item: unknown) => emit('edit', item as Project)"
    @delete="emit('delete', $event)"
  />
</template>
