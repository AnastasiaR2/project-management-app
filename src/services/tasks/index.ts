import http from "@/services/api";
import type { Task } from "./types";

async function getTasks() {
  return await http.get<Task[]>("tasks");
}

async function createTask(newTask: Task) {
  return await http.post<Task>("tasks", newTask);
}

export const TaskService = {
  getTasks,
  createTask,
};
