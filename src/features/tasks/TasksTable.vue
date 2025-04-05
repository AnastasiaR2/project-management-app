<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import DataTable from "@/components/DataTable.vue";
import { useTaskStore } from "@/stores/tasks";
import type { Task } from "@/services/tasks/types";
import draggable from "vuedraggable";
import AppButton from "@/components/AppButton.vue";

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
const projectTasks = ref(taskStore.getTasksByProjectId(projectId));

onMounted(async () => {
  await taskStore.dispatchGetTasks();
});

function editBtnClicked(item: unknown) {
  emit("editBtnClicked", item as Task);
}

function deleteBtnClicked(id: string) {
  emit("deleteBtnClicked", id);
}

watch(
  () => taskStore.tasks,
  () => {
    projectTasks.value = taskStore.getTasksByProjectId(projectId);
  },
  { deep: true },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function onDragChange(evt: any, status: string) {
  if (evt.added) {
    const task = evt.added.element;
    await taskStore.dispatchUpdateTask({
      ...task,
      status,
    });
  }
}
</script>

<template>
  <DataTable
    :columns="columns"
    :data="projectTasks"
    table-id="tasks - table"
    :resizable="true"
    @edit-btn-clicked="editBtnClicked"
    @delete-btn-clicked="deleteBtnClicked"
  >
    <template #tableBody>
      <div class="table-section">To Do</div>
      <draggable
        :list="projectTasks"
        tag="tbody"
        item-key="id"
        group="tasks"
        @change="(e) => onDragChange(e, 'To Do')"
      >
        <template #item="{ element: item }">
          <tr v-if="item.status === 'To Do'">
            <td v-for="(column, i) in columns" :key="`${column.key}-${i}`">
              <template v-if="column.key === 'actions'">
                <div class="buttons-wrapper">
                  <AppButton
                    variant="icon-button"
                    @click.stop="emits('editBtnClicked', item)"
                    title="Edit"
                  >
                    <img src="@/components/icons/edit-icon.svg" alt="Edit" />
                  </AppButton>

                  <AppButton
                    variant="icon-button"
                    @click.stop="emits('deleteBtnClicked', item.id as string)"
                    title="Delete"
                  >
                    <img src="@/components/icons/delete-icon.svg" alt="Delete" />
                  </AppButton>
                </div>
              </template>
              <template v-else>
                {{ item[column.key] }}
              </template>
            </td>
          </tr>
        </template>
      </draggable>
      <div class="table-section">In Progress</div>
      <draggable
        :list="projectTasks"
        tag="tbody"
        item-key="id"
        group="tasks"
        @change="(e) => onDragChange(e, 'In Progress')"
      >
        <template #item="{ element: item }">
          <tr v-if="item.status === 'In Progress'">
            <td v-for="(column, i) in columns" :key="`${column.key}-${i}`">
              <template v-if="column.key === 'actions'">
                <div class="buttons-wrapper">
                  <AppButton
                    variant="icon-button"
                    @click.stop="emits('editBtnClicked', item)"
                    title="Edit"
                  >
                    <img src="@/components/icons/edit-icon.svg" alt="Edit" />
                  </AppButton>

                  <AppButton
                    variant="icon-button"
                    @click.stop="emits('deleteBtnClicked', item.id as string)"
                    title="Delete"
                  >
                    <img src="@/components/icons/delete-icon.svg" alt="Delete" />
                  </AppButton>
                </div>
              </template>
              <template v-else>
                {{ item[column.key] }}
              </template>
            </td>
          </tr>
        </template>
      </draggable>
      <div class="table-section">Done</div>
      <draggable
        :list="projectTasks"
        tag="tbody"
        item-key="id"
        group="tasks"
        @change="(e) => onDragChange(e, 'Done')"
      >
        <template #item="{ element: item }">
          <tr v-if="item.status === 'Done'">
            <td v-for="(column, i) in columns" :key="`${column.key}-${i}`">
              <template v-if="column.key === 'actions'">
                <div class="buttons-wrapper">
                  <AppButton
                    variant="icon-button"
                    @click.stop="emits('editBtnClicked', item)"
                    title="Edit"
                  >
                    <img src="@/components/icons/edit-icon.svg" alt="Edit" />
                  </AppButton>

                  <AppButton
                    variant="icon-button"
                    @click.stop="emits('deleteBtnClicked', item.id as string)"
                    title="Delete"
                  >
                    <img src="@/components/icons/delete-icon.svg" alt="Delete" />
                  </AppButton>
                </div>
              </template>
              <template v-else>
                {{ item[column.key] }}
              </template>
            </td>
          </tr>
        </template>
      </draggable>
    </template>
  </DataTable>
</template>

<style lang="scss" scoped>
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.table {
  width: max-content;
  min-width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  background: $color-white;
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  th,
  td {
    padding: 12px;
    border: 1px solid $border-color;
    text-align: left;
  }

  tr td:first-child,
  tr th:first-child {
    border-left: 0;
  }

  tr td:last-child,
  tr th:last-child {
    border-right: 0;
  }

  th {
    background-color: $primary-color;
    font-weight: bold;
    color: $color-white;
    position: relative;
  }

  .resize-handle {
    width: 5px;
    height: 100%;
    cursor: col-resize;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
  }

  tr:hover {
    background-color: rgba($primary-color, 0.1);
  }

  .buttons-wrapper {
    text-align: right;
  }

  .table-section {
    padding: 12px;
    font-weight: bold;
  }
}
</style>
