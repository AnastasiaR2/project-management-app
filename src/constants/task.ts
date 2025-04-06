export const taskStatuses = ["To Do", "In Progress", "Done"] as const;

export type TaskStatus = (typeof taskStatuses)[number];
