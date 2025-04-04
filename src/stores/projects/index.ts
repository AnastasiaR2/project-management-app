import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Project } from "@/services/projects/types";
import { API } from "@/services";
import { AxiosError } from "axios";

export const useProjectStore = defineStore("project", () => {
  const projects = ref<Project[]>([]);

  const getProjectById = (id: string) => {
    return computed(() => projects.value.find((project) => project.id === id));
  };

  function initProjects(data: Project[]) {
    projects.value = data;
  }

  function addProject(project: Project) {
    projects.value.push(project);
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

  async function dispatchCreateProject(newProject: Project) {
    try {
      const { status, data } = await API.projects.createProject(newProject);

      if (status === 201) {
        addProject(data);
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
    projects,
    initProjects,
    getProjectById,
    dispatchGetProjects,
    dispatchCreateProject,
  };
});
