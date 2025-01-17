import type { Task } from "~/types/tables"
import type { ITaskHistory } from "~/types/taskHistory"

export const useTaskHistory = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const { data: taskHistories, refresh: refetchHistories } = useAsyncData(
    "taskHistories",
    async () => {
      if (!user.value) {
        return
      }
      const { data } = await supabase
        .from("task_history")
        .select(
          `
        id,
        completed_at,
        experience_earned,
        tasks (
          id,
          name
        )
          `
        )
        .eq("profile_id", user.value.id)
        .order("completed_at", { ascending: false })
        .limit(10)

      return data as Array<ITaskHistory>
    }
  )

  const addTaskHistory = async (task: Task) => {
    return await supabase.from("task_history").insert({
      experience_earned: task.experience,
      profile_id: user.value?.id!,
      task_id: task.id,
      completed_at: new Date().toISOString(),
    })
  }

  const deleteTaskHistory = async (id: string) => {
    return await supabase.from("task_history").delete().eq("id", id)
  }

  return {
    taskHistories,
    addTaskHistory,
    refetchHistories,
    deleteTaskHistory,
  }
}
