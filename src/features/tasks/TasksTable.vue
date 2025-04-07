<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import AppTable from "@/components/AppTable.vue";
import { useTaskStore } from "@/stores/tasks";
import type { Task } from "@/features/tasks/task.types";
import draggable from "vuedraggable";
import TableActions from "@/components/TableActions.vue";
import { taskStatuses, type TaskStatus } from "@/constants/task";

const columns = [
  { key: "id", label: "ID", sortable: true },
  { key: "title", label: "Task Title", sortable: true },
  { key: "assignee", label: "Assignee", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "dueDate", label: "Due Date", sortable: true },
  { key: "actions", label: "" },
];

const assigneeOptions = ["John Smith", "Erika Berger", "Alice Young", "Peter Parker"];

const emit = defineEmits<{
  edit: [project: Task];
  delete: [id: string];
}>();

const route = useRoute();
const projectId = route.params.id as string;

const taskStore = useTaskStore();
const projectTasks = ref(taskStore.getTasksByProjectId(projectId));

const filters = ref({
  assignee: "",
  status: "",
});

onMounted(async () => {
  await taskStore.dispatchGetTasks();
});

watch(
  () => taskStore.tasks,
  () => {
    projectTasks.value = taskStore.getTasksByProjectId(projectId);
  },
  { deep: true },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function onDragChange(evt: any, status: TaskStatus) {
  if (evt.added) {
    const task = evt.added.element;
    await taskStore.dispatchUpdateTask({
      ...task,
      status,
    });
  }
}

function countItemsByStatus(array: Task[], status: TaskStatus) {
  return array.filter((item) => item.status === status).length;
}
</script>

<template>
  <div class="filters">
    <select v-model="filters.status">
      <option value="">All statuses</option>
      <option v-for="status in taskStatuses" :key="status" :value="status">{{ status }}</option>
    </select>
    <select v-model="filters.assignee">
      <option value="">All assignees</option>
      <option v-for="assignee in assigneeOptions" :key="assignee" :value="assignee">
        {{ assignee }}
      </option>
    </select>
  </div>
  <AppTable
    :columns="columns"
    :data="projectTasks"
    table-id="tasks-table"
    :resizable="true"
    :filters="filters"
  >
    <template #tableBody="{ data }">
      <template v-for="status in taskStatuses" :key="status">
        <div class="table-section">
          {{ `${status} (${countItemsByStatus(data as unknown as Task[], status)})` }}
        </div>
        <draggable
          :list="data"
          tag="tbody"
          item-key="id"
          group="tasks"
          @change="(e) => onDragChange(e, status)"
        >
          <template #item="{ element: item }">
            <tr v-if="item.status === status">
              <td v-for="(column, i) in columns" :key="`${column.key}-${i}`">
                <template v-if="column.key === 'actions'">
                  <TableActions
                    :item
                    @edit="(item: unknown) => emit('edit', item as Task)"
                    @delete="emit('delete', $event)"
                  />
                </template>
                <template v-else>
                  {{ item[column.key] }}
                </template>
              </td>
            </tr>
          </template>
        </draggable>
      </template>
    </template>
  </AppTable>
</template>
