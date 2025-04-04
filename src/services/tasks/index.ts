import http from "@/services/api";
import type { Task } from "./types";

async function getTasks() {
  return await http.get<Task[]>("tasks");
}

export const TaskService = {
  getTasks,
};
