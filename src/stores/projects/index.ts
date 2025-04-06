import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Project } from "@/features/projects/project.types";
import { API } from "@/services";
import { AxiosError } from "axios";

export const useProjectStore = defineStore(
  "projects",
  () => {
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

    function updateProject(updatedProject: Project) {
      const index = projects.value.findIndex((project) => updatedProject.id === project.id);
      if (index === -1) return;

      projects.value[index] = updatedProject;
    }

    function deleteProject(id: string) {
      const index = projects.value.findIndex((project) => project.id === id);
      if (index === -1) return;

      projects.value.splice(index, 1);
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

    async function dispatchUpdateProject(updatedProject: Project) {
      try {
        const { status, data } = await API.projects.updateProject(updatedProject);

        if (status === 200) {
          updateProject(data);
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

    async function dispatchDeleteProject(id: string) {
      try {
        const { status } = await API.projects.deleteProject(id);

        if (status === 200) {
          deleteProject(id);
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
      dispatchUpdateProject,
      dispatchDeleteProject,
    };
  },
  {
    persist: true,
  },
);
