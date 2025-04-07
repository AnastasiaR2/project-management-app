<script setup lang="ts">
import { ref, computed } from "vue";
import type { Project } from "@/features/projects/project.types";
import AppButton from "@/components/AppButton.vue";
import { projectStatuses } from "@/constants/project";

const emit = defineEmits<{
  submit: [project: Project];
}>();

const props = defineProps<{
  project?: Project;
}>();

const name = ref(props.project?.name ?? "");
const description = ref(props.project?.description ?? "");
const status = ref(props.project?.status ?? "Not Started");

const isEditing = computed(() => !!props.project?.id);

const isValid = computed(() => name.value.trim().length > 0);

function handleSubmit() {
  const project: Project = {
    id: props.project?.id ?? crypto.randomUUID(),
    name: name.value.trim(),
    description: description.value.trim(),
    status: status.value,
    createdAt: props.project?.createdAt ?? new Date().toISOString().split("T")[0],
    tasksCount: props.project?.tasksCount ?? 0,
  };

  emit("submit", project);
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="form">
    <div class="form-group">
      <label for="name">Name <span class="required">*</span></label>
      <input id="name" type="text" required v-model="name" />
    </div>
    <div class="form-group">
      <label for="description">Description</label>
      <textarea id="description" rows="3" v-model="description" />
    </div>
    <div class="form-group" v-if="isEditing">
      <label for="status">Status</label>
      <select id="status" v-model="status">
        <option v-for="option in projectStatuses" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>

    <AppButton type="submit" :disabled="!isValid"
      >{{ isEditing ? "Update" : "Add" }} Project</AppButton
    >
  </form>
</template>
