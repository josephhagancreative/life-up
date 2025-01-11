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
    <ion-content class="ion-padding" v-if="userData">
      <h1 class="header">Welcome {{ userData.username }}</h1>
      <p class="experience-header">
        Total Experience: {{ userData.experience }}
      </p>
      <div class="ion-content-scroll-host task-history-container">
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

const supabase = useSupabaseClient()
const user = useSupabaseUser()

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
</style>
