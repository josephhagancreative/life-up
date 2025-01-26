<template>
  <PageContainer>
    <ion-content class="ion-padding">
      <div class="page-container">
        <h1>Stats</h1>
        <div v-if="achievements" class="achievements-grid">
          <div
            v-for="achievement in achievements"
            :key="achievement.id"
            class="achievement-item"
            :class="{ 'achievement-locked': !achievement.unlocked_at }"
          >
            <img
              :src="achievement.img_url ?? ''"
              :alt="achievement.name"
              style="width: 50px; height: 50px; object-fit: contain"
            />
            <p class="achievement-name">{{ achievement.name }}</p>
          </div>
        </div>
      </div>
    </ion-content>
  </PageContainer>
</template>

<script lang="ts" setup>
import type { IProfileAchievement } from "~/types/achievements"

const supabase = useSupabaseClient()
const user = useSupabaseUser()

type Achievement = IProfileAchievement["achievements"] & {
  unlocked_at: string | null
}

const { data: achievements } = useAsyncData<Achievement[]>(
  "achievements",
  async () => {
    if (!user.value) return []

    const { data, error } = await supabase
      .from("profile_achievements")
      .select(
        `
      unlocked_at,
      achievements!inner (
        id,
        name,
        img_url,
        description
      )
    `
      )
      .eq("profile_id", user.value.id)
      .returns<IProfileAchievement[]>()

    if (error) return []

    return (
      data?.map((item) => ({
        id: item.achievements.id,
        name: item.achievements.name,
        img_url: item.achievements.img_url,
        description: item.achievements.description,
        unlocked_at: item.unlocked_at,
      })) ?? []
    )
  }
)
</script>

<style scoped>
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
  padding: 1rem 0;
}

.achievement-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.achievement-name {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--ion-color-medium);
}

.achievement-locked {
  opacity: 0.5;
  filter: grayscale(100%);
}
</style>
