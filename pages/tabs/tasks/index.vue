<template>
  <PageContainer>
    <ion-content>
      <div class="task-container">
        <div v-for="type of taskTypesData" class="task-type">
          <h3>{{ type.name }}</h3>
          <div v-for="task of type.tasks" class="task-item">
            <span> {{ task.name }} +{{ task.experience }}xp </span>
            <ion-button
              shape="round"
              color="success"
              @click="completeTask(task)"
            >
              <ion-icon
                slot="icon-only"
                color="light"
                :icon="ioniconsCheckmark"
              ></ion-icon>
            </ion-button>
          </div>
        </div>
        <NewTaskModal @added-task="refetchTasks" v-model="isOpen" />
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

const setOpen = (open: boolean) => (isOpen.value = open)

const isOpen = ref(false)

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
        is_recurring,
        recurrence_interval,
        created_at,
        updated_at
      )
    `
      )
      .eq("profile_id", user.value.id)

    if (error) {
      console.error("Error fetching task types with tasks:", error)
      return
    }

    return data as Array<TaskType & { tasks: Task[] }>
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
    }
  }
}
</script>

<style scoped>
.task-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--line-color);
  background-color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
}
</style>

<style>
ion-toast.task-complete-toast {
  --background: #fff;
  --box-shadow: 3px 3px 10px 0 rgba(0, 0, 0, 0.2);
  --border-width: 5px;
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
