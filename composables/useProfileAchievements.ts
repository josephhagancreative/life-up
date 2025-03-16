import type { AllLevels, UserProfile } from "~/types/user"
import { differenceInDays, subDays } from "date-fns"

type AchievementWithUnlock = {
  id: number
  name: string
  unlocked_at: string | null
}

export const useProfileAchievements = (
  userData: Ref<UserProfile>,
  currentLevel: Ref<AllLevels>,
  refreshUserData: () => Promise<void>
) => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const checkAchievements = async () => {
    if (!user.value) return

    // Fetch all achievements and their unlock status in one query
    const { data: achievements } = await supabase
      .from("achievements")
      .select(
        `
        id,
        name,
        profile_achievements!left (
          unlocked_at
        )
      `
      )
      .eq("profile_achievements.profile_id", user.value.id)

    if (!achievements?.length) return

    // Transform data to easier format
    const achievementsMap = achievements.reduce((acc, achievement) => {
      acc[achievement.name] = {
        id: achievement.id,
        name: achievement.name,
        unlocked_at: achievement.profile_achievements?.[0]?.unlocked_at ?? null,
      }
      return acc
    }, {} as Record<string, AchievementWithUnlock>)

    await refreshUserData()

    // Only check achievements that aren't already unlocked
    const checks = []

    if (LEVEL_ACHIEVEMENTS.some((a) => !achievementsMap[a.name]?.unlocked_at)) {
      checks.push(checkLevelAchievement(achievementsMap))
    }

    if (TASK_ACHIEVEMENTS.some((a) => !achievementsMap[a.name]?.unlocked_at)) {
      checks.push(checkNumTasksAchievement(achievementsMap))
    }

    if (
      LOYALTY_ACHIEVEMENTS.some((a) => !achievementsMap[a.name]?.unlocked_at)
    ) {
      checks.push(checkLoyaltyAchievement(achievementsMap))
    }

    if (!achievementsMap[XP_PALINDROME_ACHIEVEMENT.name]?.unlocked_at) {
      checks.push(checkXPPalindromeAchievement(achievementsMap))
    }

    if (!achievementsMap[TASK_REPEAT_ACHIEVEMENT.name]?.unlocked_at) {
      checks.push(checkTaskRepeatAchievement(achievementsMap))
    }

    if (!achievementsMap[TASK_TYPE_VARIETY_ACHIEVEMENT.name]?.unlocked_at) {
      checks.push(checkTaskTypeVarietyAchievement(achievementsMap))
    }

    if (!achievementsMap[TASK_STREAK_ACHIEVEMENT.name]?.unlocked_at) {
      checks.push(checkTaskStreakAchievement(achievementsMap))
    }

    await Promise.all(checks)
  }

  const checkLevelAchievement = async (
    achievementsMap: Record<string, AchievementWithUnlock>
  ) => {
    if (!user.value) return

    for (const achievement of LEVEL_ACHIEVEMENTS) {
      const achievementData = achievementsMap[achievement.name]
      if (!achievementData || achievementData.unlocked_at) continue

      if (currentLevel.value.level >= achievement.level) {
        await unlockAchievement(achievementData.id, achievement.name)
      }
    }
  }

  const unlockAchievement = async (
    achievementId: number,
    achievementName: string
  ) => {
    await supabase
      .from("profile_achievements")
      .update({ unlocked_at: new Date().toISOString() })
      .eq("profile_id", user.value!.id)
      .eq("achievement_id", achievementId)

    const { showAchievement } = usePopup()
    showAchievement({
      name: achievementName,
    })
  }

  const checkNumTasksAchievement = async (
    achievementsMap: Record<string, AchievementWithUnlock>
  ) => {
    if (!user.value) return

    const { count: totalTasks } = await supabase
      .from("task_history")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", user.value.id)

    if (totalTasks === null) return

    for (const achievement of TASK_ACHIEVEMENTS) {
      const achievementData = achievementsMap[achievement.name]
      if (!achievementData || achievementData.unlocked_at) continue

      if (totalTasks >= achievement.count) {
        await unlockAchievement(achievementData.id, achievement.name)
      }
    }
  }

  const checkLoyaltyAchievement = async (
    achievementsMap: Record<string, AchievementWithUnlock>
  ) => {
    if (!user.value) return

    const { data: firstTask } = await supabase
      .from("task_history")
      .select("completed_at")
      .eq("profile_id", user.value.id)
      .order("completed_at", { ascending: true })
      .limit(1)
      .single()

    const { data: lastTask } = await supabase
      .from("task_history")
      .select("completed_at")
      .eq("profile_id", user.value.id)
      .order("completed_at", { ascending: false })
      .limit(1)
      .single()

    if (!firstTask || !lastTask) return

    const firstDate = new Date(firstTask.completed_at!)
    const lastDate = new Date(lastTask.completed_at!)
    const daysDifference = differenceInDays(lastDate, firstDate)

    for (const achievement of LOYALTY_ACHIEVEMENTS) {
      const achievementData = achievementsMap[achievement.name]
      if (!achievementData || achievementData.unlocked_at) continue

      if (daysDifference >= achievement.days) {
        await unlockAchievement(achievementData.id, achievement.name)
      }
    }
  }

  const checkXPPalindromeAchievement = async (
    achievementsMap: Record<string, AchievementWithUnlock>
  ) => {
    if (!user.value) return

    const achievementData = achievementsMap[XP_PALINDROME_ACHIEVEMENT.name]
    if (!achievementData || achievementData.unlocked_at) return

    if (userData.value?.experience && isPalindrome(userData.value.experience)) {
      await unlockAchievement(achievementData.id, achievementData.name)
    }
  }

  const checkTaskRepeatAchievement = async (
    achievementsMap: Record<string, AchievementWithUnlock>
  ) => {
    if (!user.value) return

    const achievementData = achievementsMap[TASK_REPEAT_ACHIEVEMENT.name]
    if (!achievementData || achievementData.unlocked_at) return

    // Get counts for each task
    const { data: taskHistories } = await supabase
      .from("task_history")
      .select("task_id")
      .eq("profile_id", user.value.id)

    if (!taskHistories) return

    // Count occurrences of each task_id
    const taskCounts = taskHistories.reduce((acc, curr) => {
      acc[curr.task_id] = (acc[curr.task_id] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Check if any task has been completed 50 or more times
    const hasTaskWith50 = Object.values(taskCounts).some((count) => count >= 50)

    if (hasTaskWith50) {
      await unlockAchievement(achievementData.id, achievementData.name)
    }
  }

  const checkTaskTypeVarietyAchievement = async (
    achievementsMap: Record<string, AchievementWithUnlock>
  ) => {
    if (!user.value) return

    const achievementData = achievementsMap[TASK_TYPE_VARIETY_ACHIEVEMENT.name]
    if (!achievementData || achievementData.unlocked_at) return

    const { data: tasks } = await supabase
      .from("tasks")
      .select("type_id")
      .eq("profile_id", user.value.id)
      .eq("is_active", true)

    if (!tasks) return

    // Count tasks per type
    const typeTaskCounts = tasks.reduce((acc, curr) => {
      acc[curr.type_id] = (acc[curr.type_id] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Check if there are at least 3 types with 3 or more tasks
    const typesWithThreeTasks = Object.values(typeTaskCounts).filter(
      (count) => count >= 3
    )

    if (typesWithThreeTasks.length >= 3) {
      await unlockAchievement(achievementData.id, achievementData.name)
    }
  }

  const checkTaskStreakAchievement = async (
    achievementsMap: Record<string, AchievementWithUnlock>
  ) => {
    if (!user.value) return

    const achievementData = achievementsMap[TASK_STREAK_ACHIEVEMENT.name]
    if (!achievementData || achievementData.unlocked_at) return

    const { data: mostRecentTask } = await supabase
      .from("task_history")
      .select("task_id, completed_at")
      .eq("profile_id", user.value.id)
      .order("completed_at", { ascending: false })
      .limit(1)
      .single()

    if (!mostRecentTask) return

    // Get all completions of this task in the last 7 days
    const sevenDaysAgo = subDays(new Date(), 7)

    const { data: recentCompletions } = await supabase
      .from("task_history")
      .select("completed_at")
      .eq("profile_id", user.value.id)
      .eq("task_id", mostRecentTask.task_id)
      .gte("completed_at", sevenDaysAgo.toISOString())
      .order("completed_at", { ascending: true })

    if (!recentCompletions?.length) return

    // Check if there's at least one completion per day for the last 7 days
    const dailyCompletions = new Set()
    recentCompletions.forEach((completion) => {
      const date = new Date(completion.completed_at!).toDateString()
      dailyCompletions.add(date)
    })

    if (dailyCompletions.size >= 7) {
      await unlockAchievement(achievementData.id, achievementData.name)
    }
  }

  return {
    checkAchievements,
  }
}
