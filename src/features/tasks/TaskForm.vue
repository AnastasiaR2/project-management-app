<script setup lang="ts">
import { ref, computed } from "vue";
import type { Task } from "@/features/tasks/task.types";
import AppButton from "@/components/AppButton.vue";
import { taskStatuses } from "@/constants/task";

const assigneeOptions = ["John Smith", "Erika Berger", "Alice Young", "Peter Parker"];

const emit = defineEmits<{
  submit: [task: Task];
}>();

const props = defineProps<{
  projectId: string;
  task?: Task;
}>();

const title = ref(props.task?.title ?? "");
const assignee = ref(props.task?.assignee ?? "");
const status = ref(props.task?.status ?? "To Do");
const dueDate = ref(props.task?.dueDate ?? "");

const today = new Date().toISOString().split("T")[0];

const isEditing = computed(() => !!props.task?.id);

const isValid = computed(() => title.value.trim().length > 0);

function handleSubmit() {
  const task: Task = {
    id: props.task?.id ?? crypto.randomUUID(),
    title: title.value.trim(),
    status: status.value,
    projectId: props.task?.projectId ?? props.projectId,
    assignee: assignee.value,
    dueDate: dueDate.value,
  };

  emit("submit", task);
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="form">
    <div class="form-group">
      <label for="name">Title <span class="required">*</span></label>
      <input id="name" type="text" required v-model="title" />
    </div>
    <div class="form-group">
      <label for="assignee">Assignee</label>
      <select id="assignee" v-model="assignee">
        <option v-for="option in assigneeOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
    <div class="form-group" v-if="isEditing">
      <label for="status">Status</label>
      <select id="status" v-model="status">
        <option v-for="option in taskStatuses" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
    <div class="form-group">
      <label for="dueDate">Due Date</label>
      <input id="dueDate" type="date" v-model="dueDate" :min="today" />
    </div>

    <AppButton type="submit" :disabled="!isValid"
      >{{ isEditing ? "Update" : "Add" }} Task</AppButton
    >
  </form>
</template>
