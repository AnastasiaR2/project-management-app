import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Project } from "@/services/projects/types";
import { API } from "@/services";
import { AxiosError } from "axios";

export const useProjectStore = defineStore("projectStore", () => {
  const projects = ref<Project[]>([]);

  const getProjectById = computed((id) => projects.value.find((p) => p.id === id));

  function initProjects(data: Project[]) {
    projects.value = data;
  }

  async function dispatchGetProjects() {
    try {
      const { status, data } = await API.projects.getProjects();
      if (status === 200) {
        initProjects(data);
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
    projects,
    initProjects,
    getProjectById,
    dispatchGetProjects,
  };
});
