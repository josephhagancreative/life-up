import type { Achievement } from "~/types/tables"

export const useAchievements = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  type AchievementWithUnlock = Achievement & {
    unlocked_at: string | null
  }

  const achievements = ref<AchievementWithUnlock[]>([])

  const fetchAchievements = async () => {
    if (!user.value) return

    const { data, error } = await supabase
      .from("achievements")
      .select(
        `
        id,
        name,
        img_url,
        description,
        created_at,
        profile_achievements!left (
          unlocked_at,
          profile_id
        )
      `
      )
      .eq("profile_achievements.profile_id", user.value.id)
      .returns<any[]>()

    if (error) return

    achievements.value =
      data?.map((item) => ({
        id: item.id,
        name: item.name,
        img_url: item.img_url,
        description: item.description,
        created_at: item.created_at,
        unlocked_at: item.profile_achievements?.[0]?.unlocked_at ?? null,
      })) ?? []
  }

  // Initial fetch
  onMounted(() => {
    fetchAchievements()
  })

  return {
    achievements,
    fetchAchievements,
  }
}
