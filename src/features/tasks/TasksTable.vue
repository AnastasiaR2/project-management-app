<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import DataTable from "@/components/DataTable.vue";
import { useTaskStore } from "@/stores/tasks";
import type { Task } from "@/services/tasks/types";

const columns = [
  { key: "id", label: "ID" },
  { key: "title", label: "Task Title" },
  { key: "assignee", label: "Assignee" },
  { key: "status", label: "Status" },
  { key: "dueDate", label: "Due Date" },
  { key: "actions", label: "" },
];

const emit = defineEmits<{
  editBtnClicked: [project: Task];
  deleteBtnClicked: [id: string];
}>();

const route = useRoute();
const projectId = route.params.id as string;

const taskStore = useTaskStore();

const filteredTasks = taskStore.getTasksByProjectId(projectId);

onMounted(async () => {
  await taskStore.dispatchGetTasks();
});

function editBtnClicked(item: unknown) {
  emit("editBtnClicked", item as Task);
}

function deleteBtnClicked(id: string) {
  emit("deleteBtnClicked", id);
}
</script>

<template>
  <DataTable
    :columns="columns"
    :data="filteredTasks"
    table-id="tasks - table"
    :resizable="true"
    @edit-btn-clicked="editBtnClicked"
    @delete-btn-clicked="deleteBtnClicked"
  />
</template>
