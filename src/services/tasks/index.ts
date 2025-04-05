import http from "@/services/api";
import type { Task } from "./types";

async function getTasks() {
  return await http.get<Task[]>("tasks");
}

async function createTask(newTask: Task) {
  return await http.post<Task>("tasks", newTask);
}

async function updateTask(updatedTask: Task) {
  return await http.put<Task>(`tasks/${updatedTask.id}`, updatedTask);
}

async function deleteTask(id: string) {
  return await http.delete<Task>(`tasks/${id}`);
}

export const TaskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
