<template>
  <PageContainer>
    <ion-content class="ion-padding">
      <div class="page-container">
        <h2>Stats</h2>
        <div class="stats-container">
          <p>Total Completed Tasks: {{ totalCompletedTasks }}</p>
        </div>
        <h2>Achievements</h2>
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
              style="width: 75px; height: 75px; object-fit: contain"
            />
            <p class="achievement-name">
              {{ achievement.unlocked_at ? achievement.name : "???" }}
            </p>
          </div>
        </div>
      </div>
    </ion-content>
  </PageContainer>
</template>

<script lang="ts" setup>
const { achievements, fetchAchievements, totalCompletedTasks } = useApp()

onIonViewWillEnter(() => {
  fetchAchievements()
})
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

  > img {
    border-radius: 100%;
    -webkit-filter: contrast(0) sepia(100%) hue-rotate(190deg) saturate(2000%)
      brightness(100%);
    filter: contrast(0) sepia(100%) hue-rotate(190deg) saturate(2000%)
      brightness(100%);
    opacity: 0.8;
  }
}
</style>
