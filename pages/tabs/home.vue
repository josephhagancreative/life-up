<template>
  <PageContainer>
    <ion-content class="ion-padding ion-content-scroll-host" v-if="userData">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <h1 class="header">Welcome {{ userData.username }}</h1>
      <p class="experience-header">Level:{{ currentLevel.level }}</p>
      <p class="experience-header">
        Total Experience: {{ userData.experience }}
      </p>
      <div class="experience-bar-container">
        <progress-bar
          :initialNumber="currentLevel.xpRequired"
          :currentNumber="userData.experience"
          :maxNumber="nextLevel.xpRequired"
        />
      </div>
      <div class="task-history-container">
        <p>History:</p>
        <div class="task-history" v-for="task in taskHistories" :key="task.id">
          <div class="text-container">
            <p class="date">{{ formatToLocalDate(task.completed_at!) }}</p>
            <span class="task">{{ task.tasks.name }}</span>
          </div>
          <span>+{{ task.experience_earned }}xp</span>
          <ion-button
            color="danger"
            shape="round"
            @click="handleDeleteTaskHistory(task)"
          >
            <ion-icon slot="icon-only" :icon="ioniconsTrashBin" />
          </ion-button>
        </div>
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
} = useUser()

const { taskHistories, refetchHistories, deleteTaskHistory } = useTaskHistory()

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
}

.task-history-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0 0.5rem;
}

.task-history {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.25rem;
  padding: 0.5rem;
  border: 1px solid grey;
}

.text-container {
  display: flex;
  flex-direction: column;

  > .date {
    margin: 0;
    margin-bottom: 0.4rem;
    color: darkslategray;
  }

  > .task {
    font-weight: 500;
  }
}

.experience-bar-container {
  width: 100%;
  padding: 1rem;
}
</style>
