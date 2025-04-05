<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import DataTable from "@/components/DataTable.vue";
import { useProjectStore } from "@/stores/projects";
import type { Project } from "@/services/projects/types";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status" },
  { key: "tasksCount", label: "Tasks Count" },
  { key: "createdAt", label: "Created At" },
  { key: "actions", label: "" },
];

const emit = defineEmits<{
  editBtnClicked: [project: Project];
  deleteBtnClicked: [id: string];
}>();

const router = useRouter();
const projectStore = useProjectStore();

onMounted(async () => {
  await projectStore.dispatchGetProjects();
});

function rowSelected(id: string) {
  router.push({ name: "project", params: { id } });
}

function editBtnClicked(item: unknown) {
  emit("editBtnClicked", item as Project);
}

function deleteBtnClicked(id: string) {
  emit("deleteBtnClicked", id);
}
</script>

<template>
  <DataTable
    :columns="columns"
    :data="projectStore.projects"
    table-id="projects - table"
    :resizable="true"
    @row-selected="rowSelected"
    @edit-btn-clicked="editBtnClicked"
    @delete-btn-clicked="deleteBtnClicked"
  />
</template>
