<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" v-if="userData">
      <p>Welcome {{ userData.username }}</p>
      <p>Total Experience: {{ userData.experience }}</p>
      <p>History:</p>
      <p v-for="task in taskHistories" :key="task.id">
        {{ formatToLocalDate(task.completed_at!) }} - {{ task.tasks.name }} -
        {{ task.experience_earned }}xp
      </p>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import type { Profile, Task, TaskHistory } from "~/types/tables"

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const { data: userData } = useAsyncData("user", async () => {
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
    .single<Pick<Profile, "username" | "avatar_url" | "email" | "experience">>()

  return data
})

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
    .limit(10)

  return data as Array<TaskHistory & { tasks: Pick<Task, "id" | "name"> }>
})
</script>
