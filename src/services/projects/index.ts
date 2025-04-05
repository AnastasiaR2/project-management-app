import http from "@/services/api";
import type { Project } from "./types";

async function getProjects() {
  return await http.get<Project[]>("projects");
}

async function createProject(newProject: Project) {
  return await http.post<Project>("projects", newProject);
}

async function updateProject(updatedProject: Project) {
  return await http.put<Project>(`projects/${updatedProject.id}`, updatedProject);
}

async function deleteProject(id: string) {
  return await http.delete<Project>(`projects/${id}`);
}

export const ProjectService = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};
