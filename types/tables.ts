import type { Tables } from "~/database.types"

export type Profile = Tables<"profiles">
export type Task = Tables<"tasks">
export type TaskHistory = Tables<"task_history">
export type TaskType = Tables<"task_types">
