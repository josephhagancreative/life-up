<template>
  <PageContainer>
    <ion-content>
      <div class="task-container">
        <h1>Tasks</h1>
        <p class="empty-text text-center" v-if="!taskTypesData?.length">
          No tasks yet!
        </p>
        <div v-for="type of taskTypesData" class="task-type">
          <h3>{{ type.name }}</h3>
          <ion-item-sliding v-for="task of type.tasks">
            <ion-item-options side="start">
              <ion-item-option color="warning" @click="onEdit(task)">
                <ion-icon slot="icon-only" :icon="ioniconsPencil"></ion-icon>
              </ion-item-option>
            </ion-item-options>

            <ion-item class="task-item">
              <span> {{ task.name }} +{{ task.experience }}xp </span>
              <ion-button
                shape="round"
                color="success"
                @click="completeTask(task)"
                slot="end"
              >
                <ion-icon
                  slot="icon-only"
                  color="light"
                  :icon="ioniconsCheckmark"
                ></ion-icon>
              </ion-button>
            </ion-item>

            <ion-item-options side="end">
              <ion-item-option color="danger" @click="onDelete(task)">
                <ion-icon slot="icon-only" :icon="ioniconsTrash"></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </div>
        <NewTaskModal
          @added-task="refetchTasks"
          @updated-task="refetchTasks"
          v-model="isOpen"
          :task-to-edit="taskToEdit"
          @update:model-value="setOpen"
        />
      </div>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="setOpen(true)">
          <ion-icon :icon="ioniconsAdd"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </PageContainer>
</template>

<script lang="ts" setup>
import type { TaskType, Task } from "~/types/tables"
import NewTaskModal from "./NewTaskModal.vue"
import { incrementExperience } from "~/mutations/user"

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const { userData, userCompleteTask } = useUser()
const { addTaskHistory } = useTaskHistory()

const setOpen = (open: boolean) => {
  isOpen.value = open
  if (!open) {
    taskToEdit.value = undefined
  }
}

const isOpen = ref(false)

const taskToEdit = ref<Task | undefined>()

const onUpdatedTask = () => {
  taskToEdit.value = undefined
  refetchTasks()
}

const { data: taskTypesData, refresh: refetchTasks } = useAsyncData(
  "taskTypesWithTasks",
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
      created_at,
      tasks (
        id,
        name,
        experience,
        priority,
        deadline,
        is_active,
        is_recurring,
        is_one_time,
        recurrence_interval,
        created_at,
        updated_at
      )
    `
      )
      .eq("profile_id", user.value.id)
      .filter("tasks.is_active", "eq", true)
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching task types with tasks:", error)
      return
    }

    const filteredData = data.filter((task) => task.tasks.length) as Array<
      TaskType & { tasks: Task[] }
    >

    filteredData.forEach((taskType) => {
      taskType.tasks.sort((a, b) => a.name.localeCompare(b.name))
    })

    return filteredData
  }
)

const completeTask = async (task: Task) => {
  if (!user.value) {
    return
  }
  const updatedUser = await userCompleteTask(task)
  if (updatedUser.status === 200 && updatedUser.data) {
    const createdTaskHistory = await addTaskHistory(task)
    if (createdTaskHistory.status === 201) {
      const toast = await toastController.create({
        header: "Task Completed: ",
        message: `Completed ${task.name}! New XP: ${updatedUser.data[0].experience}`,
        duration: 5000,
        cssClass: "task-complete-toast",
        swipeGesture: "vertical",
      })
      await toast.present()
      const targetXP = updatedUser.data[0].experience
      if (!userData.value) {
        return
      }
      await incrementExperience(userData, targetXP)
      await refetchTasks()
    }
  }
}

const onDelete = async (task: Task) => {
  const { error } = await supabase
    .from("tasks")
    .update({ is_active: false })
    .eq("id", task.id)

  if (error) {
    console.error("Error deactivating task:", error)
    return
  }
  await refetchTasks()
}

const onEdit = (task: Task) => {
  taskToEdit.value = task
  isOpen.value = true
}
</script>

<style scoped>
.task-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
  margin-bottom: 4rem;
}

.task-type {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: var(--off-white);
  border: 1px solid var(--line-color);
  border-radius: 1rem;
  padding: 0.5rem;

  > h3 {
    margin-left: 0.25rem;
    font-weight: bold;
    font-size: 1.2rem;
  }
}

.task-item {
  --padding-start: 0.75rem;
  --padding-end: 0;
  --padding-top: 0.5rem;
  --padding-bottom: 0.5rem;
  --border-radius: 1rem;
  --background: white;
  --inner-border-width: 0px;
  margin: 0;

  ion-button {
    --border-radius: 50%;
    min-width: 40px;
    min-height: 40px;
    width: 40px;
    height: 40px;
    --padding-start: 0;
    --padding-end: 0;
    margin: 0;
  }
}

ion-item-sliding {
  border: 1px solid var(--line-color);
  border-radius: 1rem;
  margin: 0.25rem 0;
  overflow: hidden;
  padding: 0;
}
</style>

<style>
ion-toast.task-complete-toast {
  --background: #fff;
  --box-shadow: 3px 3px 10px 0 rgba(0, 0, 0, 0.2);
  --border-width: 2px;
  --border-style: solid;
  --border-color: var(--ion-color-success-tint);

  &::part(header) {
    color: var(--ion-color-success-shade);
  }

  &::part(message) {
    font-weight: bold;
  }
}
</style>
