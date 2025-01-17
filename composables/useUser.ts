import { calculateLevels, getCurrentLevel } from "~/helpers/user"
import type { Task, TaskHistory } from "~/types/tables"
import type { AllLevels, UserProfile } from "~/types/user"

export const useUser = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const levels = ref<AllLevels[]>(
    calculateLevels(BASE_XP, MAX_LVL, GROWTH_FACTOR)
  )
  const currentLevel = computed(() =>
    getCurrentLevel(levels.value, userData.value?.experience!)
  )
  const nextLevel = computed(() => {
    const userLevelIdx = levels.value.findIndex(
      (level) => level.level === currentLevel.value.level
    )
    return levels.value[userLevelIdx + 1]
  })

  const { data: userData, refresh: refreshUserData } = useAsyncData(
    "user",
    async () => {
      if (!user.value) {
        return
      }
      const { data } = await supabase
        .from("profiles")
        .select(
          `
    username,
    avatar_url,
    email,
    experience
    `
        )
        .eq("id", user.value.id)
        .single<UserProfile>()

      return data
    }
  )

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

      return data as Array<TaskHistory & { tasks: Pick<Task, "id" | "name"> }>
    }
  )

  const userCompleteTask = async (task: Task) => {
    return await supabase
      .from("profiles")
      .update({ experience: userData.value!.experience + task.experience })
      .eq("id", user.value!.id)
      .select()
  }

  return {
    userData,
    refreshUserData,
    currentLevel,
    nextLevel,
    userCompleteTask,
    taskHistories,
    refetchHistories,
  }
}
