<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
      <ion-refresher-content> </ion-refresher-content>
    </ion-refresher>
    <ion-content class="ion-padding ion-content-scroll-host" v-if="userData">
      <h1 class="header">Welcome {{ userData.username }}</h1>
      <p class="experience-header">Level:{{ currentLevel }}</p>
      <p class="experience-header">
        Total Experience: {{ userData.experience }}
      </p>
      <div class="experience-bar-container">
        <progress-bar
          :currentNumber="userData.experience"
          :maxNumber="nextLevel.xpRequired"
        />
      </div>
      <p class="experience-header">
        XP until level {{ nextLevel.level }}: {{ nextLevel.xpRequired }}
      </p>
      <div class="task-history-container">
        <p>History:</p>
        <div class="task-history" v-for="task in taskHistories" :key="task.id">
          <div class="text-container">
            <p class="date">{{ formatToLocalDate(task.completed_at!) }}</p>
            <span class="task">{{ task.tasks.name }}</span>
          </div>
          <span>+{{ task.experience_earned }}xp</span>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import type { Profile, Task, TaskHistory } from "~/types/tables"

type AllLevels = { level: number; xpRequired: number }

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
    (level) => level.level === currentLevel.value
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

const { data: taskHistories } = useAsyncData("taskHistories", async () => {
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
})

type IonicRefresher = {
  target: HTMLIonRefresherElement
}
const handleRefresh = async (event: IonicRefresher) => {
  await refreshUserData()
  event.target.complete()
}

function calculateLevels(
  baseXP: number,
  maxLevel: number,
  growthFactor: number
) {
  const levels = [{ level: 1, xpRequired: 0 }] // Level 1 starts at 0 XP
  for (let n = 2; n <= maxLevel; n++) {
    const xpDifference = baseXP * Math.pow(Math.log2(n), growthFactor)
    const totalXP = Math.round(
      xpDifference + levels[levels.length - 1].xpRequired
    )
    levels.push({ level: n, xpRequired: totalXP })
  }
  return levels
}

function getCurrentLevel(levels: AllLevels[], currentXp: number): number {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (currentXp >= levels[i].xpRequired) {
      return levels[i].level
    }
  }
  return 1
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
