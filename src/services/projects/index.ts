import http from "@/services/api";
import type { Project } from "./types";

async function getProjects() {
  return await http.get<Project[]>("projects");
}

export const ProjectService = {
  getProjects,
};
