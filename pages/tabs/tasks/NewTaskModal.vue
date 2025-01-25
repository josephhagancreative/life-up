<template>
  <ion-modal :is-open="isOpen">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ isEdit ? "Edit Task" : "Add Task" }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="handleClose">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-select
            label="Task Type"
            placeholder="Select a type"
            v-model="formFields.selectedTaskType"
          >
            <ion-select-option v-for="type of taskTypes" :value="type.id">{{
              type.name
            }}</ion-select-option>
            <ion-select-option :value="'new'">Add a type</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item v-if="formFields.selectedTaskType === 'new'">
          <ion-input
            label="New Task Type"
            placeholder="Enter type name"
            v-model="formFields.taskTypeName"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            label="Task"
            placeholder="Enter task"
            v-model="formFields.taskName"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            type="number"
            label="Experience"
            placeholder="Enter XP value"
            v-model="formFields.xpValue"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-button @click="handleSubmit"
            >{{ isEdit ? "Update" : "Add" }} Task</ion-button
          >
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import type { TaskType, Task } from "~/types/tables"
import { cloneDeep } from "lodash"

const emits = defineEmits<{
  (e: "addedTask"): void
  (e: "updatedTask"): void
}>()

const props = defineProps<{
  taskToEdit?: Task
}>()

const supabase = useSupabaseClient()
const isOpen = defineModel<boolean>()

const isEdit = computed(() => !!props.taskToEdit)

type FormFields = {
  selectedTaskType: string | number | null
  taskTypeName: string
  taskName: string
  xpValue: number
}

const defaultFormFields: FormFields = {
  selectedTaskType: null,
  taskTypeName: "",
  taskName: "",
  xpValue: 0,
}

const formFields = ref<FormFields>(defaultFormFields)

// Initialize form with edit data if available
watch(
  () => props.taskToEdit,
  (newTask) => {
    if (newTask) {
      formFields.value = {
        selectedTaskType: newTask.type_id,
        taskTypeName: "",
        taskName: newTask.name,
        xpValue: newTask.experience,
      }
    }
  },
  { immediate: true }
)

const handleClose = () => {
  isOpen.value = false
  formFields.value = cloneDeep(defaultFormFields)
}

const handleSubmit = async () => {
  if (!user.value) return

  if (isEdit.value) {
    await updateTask()
  } else {
    await createTask()
  }
}

const updateTask = async () => {
  const { error } = await supabase
    .from("tasks")
    .update({
      name: formFields.value.taskName,
      experience: formFields.value.xpValue,
      type_id: formFields.value.selectedTaskType,
    })
    .eq("id", props.taskToEdit?.id)

  if (!error) {
    emits("updatedTask")
    handleClose()
  }
}

const user = useSupabaseUser()

const { data: taskTypes, refresh: refetchTaskTypes } = useAsyncData(
  "taskTypes",
  async () => {
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
  }
)

const createTask = async () => {
  if (!user.value) {
    return
  }
  let taskType = formFields.value.selectedTaskType

  if (taskType === "new") {
    const addedTaskType = await supabase
      .from("task_types")
      .insert({
        name: formFields.value.taskTypeName,
        profile_id: user.value.id,
      })
      .select("id")
    if (addedTaskType.status === 201) {
      taskType = addedTaskType.data![0].id
    }
  }
  const taskName = taskTypes.value?.find((type) => type.id === taskType)?.name
  const isOneTimeTask = taskName === ONE_TIME_STRING
  const newTask = await supabase.from("tasks").insert({
    profile_id: user.value.id,
    type_id: taskType as string,
    name: formFields.value.taskName,
    experience: formFields.value.xpValue,
    is_one_time: isOneTimeTask,
  })
  if (newTask.status === 201) {
    emits("addedTask")
    isOpen.value = false
  }
}
</script>
