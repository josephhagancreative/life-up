import type { Task, TaskHistory } from "./tables"

export type ITaskHistory = TaskHistory & { tasks: Pick<Task, "id" | "name"> }
