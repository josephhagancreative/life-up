<template>
  <ion-button expand="block" @click="setOpen(true)">Add Task</ion-button>
  <ion-modal :is-open="isOpen">
    <ion-header>
      <ion-toolbar>
        <ion-title>Add Task</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="setOpen(false)">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-select
            label="Task Type"
            placeholder="Select a type"
            v-model="selectedTaskType"
          >
            <ion-select-option v-for="type of taskTypes" :value="type.id">{{
              type.name
            }}</ion-select-option>
            <ion-select-option :value="'new'">Add a type</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item v-if="selectedTaskType === 'new'">
          <ion-input
            label="New Task Type"
            placeholder="Enter type name"
            v-model="taskTypeName"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            label="Task"
            placeholder="Enter task"
            v-model="taskName"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            type="number"
            label="Experience"
            placeholder="Enter XP value"
            v-model="xpValue"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-button @click="handleAddTask">Add Task</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import type { TaskType } from "~/types/tables"

const emits = defineEmits<{
  (e: "addedTask"): void
}>()

const supabase = useSupabaseClient()

const isOpen = ref(false)
const selectedTaskType = ref()
const taskTypeName = ref("")
const taskName = ref("")
const xpValue = ref(0)

const setOpen = (open: boolean) => (isOpen.value = open)

watch(selectedTaskType, (oldVal, newVal) => {
  if (oldVal === "new" && newVal !== "new") {
    taskTypeName.value = ""
  }
})

const user = useSupabaseUser()

const { data: taskTypes } = useAsyncData("taskTypes", async () => {
  if (!user.value) {
    return
  }

  const { data, error } = await supabase
    .from("task_types")
    .select(
      `
      id,
      name,
      created_at
    `
    )
    .eq("profile_id", user.value.id)

  if (error) {
    console.error("Error fetching task types with tasks:", error)
    return
  }

  return data as Array<TaskType>
})

const handleAddTask = async () => {
  if (!user.value) {
    return
  }
  let taskType = selectedTaskType.value

  if (taskType === "new") {
    const addedTaskType = await supabase
      .from("task_types")
      .insert({
        name: taskTypeName.value,
        profile_id: user.value.id,
      })
      .select("id")
    if (addedTaskType.status === 201) {
      taskType = addedTaskType.data![0].id
    }
  }
  const newTask = await supabase.from("tasks").insert({
    profile_id: user.value.id,
    type_id: taskType,
    name: taskName.value,
    experience: xpValue.value,
  })
  if (newTask.status === 201) {
    emits("addedTask")
    isOpen.value = false
  }
}
</script>
