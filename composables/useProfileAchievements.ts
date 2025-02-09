import type { Achievement } from "~/types/tables"

export const useProfileAchievements = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const { currentLevel, refreshUserData } = useUser()

  const LEVEL_ACHIEVEMENTS = [
    { name: "Lvl 5", level: 5 },
    { name: "Lvl 10", level: 10 },
    { name: "Lvl 25", level: 25 },
    { name: "Lvl 50", level: 50 },
  ]

  const checkLevelAchievement = async () => {
    if (!user.value) return

    const { data: achievements } = await supabase
      .from("achievements")
      .select("id, name")
      .in(
        "name",
        LEVEL_ACHIEVEMENTS.map((a) => a.name)
      )

    if (!achievements?.length) return

    const { data: existingAchievements } = await supabase
      .from("profile_achievements")
      .select("achievement_id, unlocked_at")
      .eq("profile_id", user.value.id)
      .in(
        "achievement_id",
        achievements.map((a) => a.id)
      )

    for (const achievement of achievements) {
      const levelAchievement = LEVEL_ACHIEVEMENTS.find(
        (a) => a.name === achievement.name
      )
      if (!levelAchievement) continue

      const existingAchievement = existingAchievements?.find(
        (ea) => ea.achievement_id === achievement.id
      )

      if (existingAchievement?.unlocked_at) continue

      if (currentLevel.value.level >= levelAchievement.level) {
        await supabase
          .from("profile_achievements")
          .update({ unlocked_at: new Date().toISOString() })
          .eq("profile_id", user.value.id)
          .eq("achievement_id", achievement.id)
      }
    }
  }

  const checkAchievements = async () => {
    await refreshUserData()
    await checkLevelAchievement()
  }

  return {
    checkAchievements,
  }
}
