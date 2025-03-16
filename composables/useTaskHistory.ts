import type { Task } from "~/types/tables"
import type { ITaskHistory } from "~/types/taskHistory"

export const useTaskHistory = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const { data: taskHistories, refresh: refetchHistories } = useAsyncData(
    "taskHistoriesList",
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
    const createdHistroy = await supabase.from("task_history").insert({
      experience_earned: task.experience,
      profile_id: user.value?.id!,
      task_id: task.id,
      completed_at: new Date().toISOString(),
    })
    await refetchTotalCompletedTasks()
    return createdHistroy
  }

  const deleteTaskHistory = async (id: string) => {
    return await supabase.from("task_history").delete().eq("id", id)
  }

  const { data: totalCompletedTasks, refresh: refetchTotalCompletedTasks } =
    useAsyncData("taskHistoriesCount", async () => {
      if (!user.value) {
        return 0
      }
      const { count } = await supabase
        .from("task_history")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", user.value.id)

      return count
    })

  return {
    taskHistories,
    addTaskHistory,
    refetchHistories,
    deleteTaskHistory,
    totalCompletedTasks,
    refetchTotalCompletedTasks,
  }
}
