import type { Profile, Task, TaskHistory } from "~/types/tables"

type AllLevels = { level: number; xpRequired: number }

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
        .single<
          Pick<Profile, "username" | "avatar_url" | "email" | "experience">
        >()

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

function calculateLevels(
  baseXP: number,
  maxLevel: number,
  growthFactor: number
) {
  const levels = [{ level: 1, xpRequired: 0 }]
  for (let n = 2; n <= maxLevel; n++) {
    const xpDifference = baseXP * Math.pow(Math.log2(n), growthFactor)
    const totalXP = Math.round(
      xpDifference + levels[levels.length - 1].xpRequired
    )
    levels.push({ level: n, xpRequired: totalXP })
  }
  return levels
}

function getCurrentLevel(levels: AllLevels[], currentXp: number) {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (currentXp >= levels[i].xpRequired) {
      return levels[i]
    }
  }
  return { level: 1, xpRequired: 0 }
}
