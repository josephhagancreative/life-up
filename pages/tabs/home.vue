<template>
  <PageContainer>
    <ion-content class="ion-padding ion-content-scroll-host" v-if="userData">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content refreshing-spinner="crescent" color="primary" />
      </ion-refresher>
      <h1 class="header">Welcome {{ userData.username ?? "...you" }}</h1>
      <p class="experience-header">
        Level: <span class="number">{{ currentLevel.level }}</span>
      </p>
      <p class="experience-header">
        Total XP: <span class="number">{{ userData.experience }}</span>
      </p>
      <div class="experience-bar-container">
        <progress-bar
          :initialNumber="currentLevel.xpRequired"
          :currentNumber="userData.experience"
          :maxNumber="nextLevel.xpRequired"
        />
      </div>
      <div class="task-history-container">
        <h3>History</h3>
        <p class="empty-text" v-if="!taskHistories?.length">
          No task history yet!
        </p>
        <ion-item-sliding
          class="task-history"
          v-for="task in taskHistories"
          :key="task.id"
        >
          <ion-item>
            <div class="task-history-item">
              <div class="text-container">
                <p class="date">{{ formatToLocalDate(task.completed_at!) }}</p>
                <span class="task">{{ task.tasks.name }}</span>
              </div>
              <span>+{{ task.experience_earned }}xp</span>
            </div>
          </ion-item>
          <ion-item-options>
            <ion-item-option>
              <ion-button
                color="danger"
                size="large"
                @click="handleDeleteTaskHistory(task)"
              >
                <ion-icon slot="icon-only" :icon="ioniconsTrashBin" />
              </ion-button>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </div>
    </ion-content>
  </PageContainer>
</template>

<script lang="ts" setup>
import type { ITaskHistory } from "~/types/taskHistory"

const {
  userData,
  refreshUserData,
  currentLevel,
  nextLevel,
  userDeleteTaskHistory,
  taskHistories,
  refetchHistories,
  deleteTaskHistory,
} = useApp()

type IonicRefresher = {
  target: HTMLIonRefresherElement
}
const handleRefresh = async (event: IonicRefresher) => {
  await refreshUserData()
  await refetchHistories()
  event.target.complete()
}

const handleDeleteTaskHistory = async (task: ITaskHistory) => {
  await deleteTaskHistory(task.id)
  await userDeleteTaskHistory(
    userData.value?.experience! - task.experience_earned
  )
  await refreshUserData()
  await refetchHistories()
}
</script>

<style lang="css" scoped>
.header {
  text-align: center;
}

.experience-header {
  text-align: center;
  font-size: 1.2rem;
  margin: 0.5rem;
  margin-bottom: 1rem;

  > .number {
    color: var(--ion-color-primary-shade);
    font-weight: bold;
  }
}

.task-history-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0.5rem;
  border-radius: 0.25rem;
  padding: 0 0.5rem;
  border: 1px solid var(--line-color);
  background-color: var(--off-white);
  margin-top: 1rem;
  padding-bottom: 1rem;

  > h3 {
    color: var(--ion-color-primary-shade);
    font-weight: bold;
    font-size: 1.2rem;
    letter-spacing: 1px;
  }
}

.task-history {
  border-radius: 0.25rem;
  border: 1px solid var(--ion-color-primary-shade);
}

.task-history-item {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
}

ion-item {
  --inner-border-width: 0px;
  --padding-start: 0px;
}

ion-item-option::part(native) {
  background-color: var(--ion-color-danger);
  --inner-border-width: 0px;
  padding: 0;
}

.text-container {
  display: flex;
  flex-direction: column;

  > .date {
    margin: 0;
    margin-bottom: 0.4rem;
    color: var(--ion-color-primary-shade);
  }

  > .task {
    font-weight: 500;
  }
}

.experience-bar-container {
  width: 100%;
  padding: 0 1rem 1.5rem;
}

ion-refresher-content {
  --color: var(--ion-color-primary);
}
</style>
