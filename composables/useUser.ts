import { calculateLevels, getCurrentLevel } from "~/helpers/user"
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

  const userDeleteTaskHistory = async (xp: number) => {
    return await supabase
      .from("profiles")
      .update({ experience: xp })
      .eq("id", user.value!.id)
      .select()
  }

  return {
    userData,
    refreshUserData,
    currentLevel,
    nextLevel,
    userDeleteTaskHistory,
  }
}
