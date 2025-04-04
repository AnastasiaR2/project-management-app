import http from "@/services/api";
import type { Project } from "./types";

async function getProjects() {
  return await http.get<Project[]>("projects");
}

async function createProject(newProject: Project) {
  return await http.post<Project>("projects", newProject);
}

export const ProjectService = {
  getProjects,
  createProject,
};
