<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AppTable from "@/components/AppTable.vue";
import { useProjectStore } from "@/stores/projects";
import type { Project } from "@/features/projects/project.types";
import { projectStatuses } from "@/constants/project";

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

const filters = ref({
  name: "",
  status: "",
});

onMounted(async () => {
  await projectStore.dispatchGetProjects();
});

function rowSelected(id: string) {
  router.push({ name: "project", params: { id } });
}
</script>

<template>
  <div class="filters">
    <input v-model="filters.name" placeholder="Search by name..." class="search" />
    <select v-model="filters.status">
      <option value="">All statuses</option>
      <option v-for="status in projectStatuses" :key="status" :value="status">{{ status }}</option>
    </select>
  </div>
  <AppTable
    :columns="columns"
    :data="projectStore.projects"
    table-id="projects - table"
    :resizable="true"
    :filters="filters"
    @row-selected="rowSelected"
    @edit="(item: unknown) => emit('edit', item as Project)"
    @delete="emit('delete', $event)"
  />
</template>

<style scoped lang="scss">
.search {
  width: 250px;
  border-radius: 16px;
}
</style>
