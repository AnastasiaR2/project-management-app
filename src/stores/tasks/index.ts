import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Task } from "@/services/tasks/types";
import { API } from "@/services";
import { AxiosError } from "axios";

export const useTaskStore = defineStore("task", () => {
  const tasks = ref<Task[]>([]);

  const getTasksByProjectId = computed((projectId) =>
    tasks.value.filter((task) => task.projectId === projectId),
  );

  function initTasks(data: Task[]) {
    tasks.value = data;
  }

  async function dispatchGetTasks() {
    try {
      const { status, data } = await API.tasks.getTasks();
      if (status === 200) {
        initTasks(data);
        return {
          status,
        };
      }
    } catch (error) {
      const _error = error as AxiosError<string>;
      return {
        status: _error.response?.status,
      };
    }
    return {
      success: false,
      status: 400,
    };
  }

  return {
    tasks,
    initTasks,
    getTasksByProjectId,
    dispatchGetTasks,
  };
});
