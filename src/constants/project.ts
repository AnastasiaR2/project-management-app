export const projectStatuses = ["Not Started", "In Progress", "Completed"] as const;

export type ProjectStatus = (typeof projectStatuses)[number];
