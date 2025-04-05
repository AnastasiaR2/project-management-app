import { defineStore } from "pinia";
import { ref } from "vue";
import type { Task } from "@/services/tasks/types";
import { API } from "@/services";
import { AxiosError } from "axios";

export const useTaskStore = defineStore(
  "tasks",
  () => {
    const tasks = ref<Task[]>([]);

    const getTasksByProjectId = (projectId: string) => {
      return tasks.value.filter((task) => task.projectId === projectId);
    };

    function initTasks(data: Task[]) {
      tasks.value = data;
    }

    function addTask(newTask: Task) {
      tasks.value.push(newTask);
    }

    function updateTask(updatedTask: Task) {
      const index = tasks.value.findIndex((task) => updatedTask.id === task.id);
      if (index === -1) return;

      tasks.value[index] = updatedTask;
    }

    function deleteTask(id: string) {
      const index = tasks.value.findIndex((task) => task.id === id);
      if (index === -1) return;

      tasks.value.splice(index, 1);
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

    async function dispatchCreateTask(newTask: Task) {
      try {
        const { status, data } = await API.tasks.createTask(newTask);

        if (status === 201) {
          addTask(data);
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
    }

    async function dispatchUpdateTask(updatedTask: Task) {
      try {
        const { status, data } = await API.tasks.updateTask(updatedTask);

        if (status === 200) {
          updateTask(data);
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
    }

    async function dispatchDeleteTask(id: string) {
      try {
        const { status } = await API.tasks.deleteTask(id);

        if (status === 200) {
          deleteTask(id);
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
    }

    return {
      tasks,
      initTasks,
      getTasksByProjectId,
      dispatchGetTasks,
      dispatchCreateTask,
      dispatchUpdateTask,
      dispatchDeleteTask,
    };
  },
  {
    persist: true,
  },
);
