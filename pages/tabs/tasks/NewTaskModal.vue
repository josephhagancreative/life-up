<template>
  <ion-modal :is-open="isOpen" @ionModalWillPresent="resetForm">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ isEdit ? "Edit Task" : "Add Task" }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="handleClose">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="content">
        <ion-select
          label="Task Type"
          label-placement="stacked"
          fill="outline"
          placeholder="Select a type"
          mode="md"
          v-model="formFields.selectedTaskType"
        >
          <ion-select-option v-for="type of taskTypes" :value="type.id">{{
            type.name
          }}</ion-select-option>
          <ion-select-option :value="'new'">Add a type</ion-select-option>
        </ion-select>
        <ion-input
          v-if="formFields.selectedTaskType === 'new'"
          label="New Task Type"
          label-placement="stacked"
          fill="outline"
          mode="md"
          placeholder="Enter type name"
          v-model="formFields.taskTypeName"
        ></ion-input>
        <ion-input
          label="Task"
          label-placement="stacked"
          fill="outline"
          mode="md"
          placeholder="Enter task"
          v-model="formFields.taskName"
        ></ion-input>
        <ion-input
          type="number"
          label="Experience"
          label-placement="stacked"
          fill="outline"
          mode="md"
          placeholder="Enter XP value"
          v-model="formFields.xpValue"
        ></ion-input>
        <div class="button-container">
          <ion-button expand="block" @click="handleSubmit"
            >{{ isEdit ? "Update" : "Add" }} Task</ion-button
          >
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import type { TaskType, Task } from "~/types/tables"
import { cloneDeep } from "lodash"

const user = useSupabaseUser()

const props = defineProps<{
  taskTypes: TaskType[]
  taskToEdit?: Task
  refetchTaskTypes: () => Promise<void>
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

const resetForm = () => {
  if (!isEdit.value) {
    formFields.value = cloneDeep(defaultFormFields)
  }
}

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
      type_id: String(formFields.value.selectedTaskType),
    })
    .eq("id", props.taskToEdit!.id)

  if (!error) {
    await props.refetchTaskTypes()
    handleClose()
  }
}

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
      await props.refetchTaskTypes()
    }
  }
  const taskName = props.taskTypes?.find((type) => type.id === taskType)?.name
  const isOneTimeTask = taskName === ONE_TIME_STRING
  const newTask = await supabase.from("tasks").insert({
    profile_id: user.value.id,
    type_id: taskType as string,
    name: formFields.value.taskName,
    experience: formFields.value.xpValue,
    is_one_time: isOneTimeTask,
  })
  if (newTask.status === 201) {
    await props.refetchTaskTypes()
    isOpen.value = false
  }
}
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%;
  justify-content: space-between;
  padding: 1rem;
}

.button-container {
  margin-top: auto;
}
</style>
