<template>
  <PageContainer>
    <ion-content>
      <div class="task-container">
        <h1>Tasks</h1>
        <p class="empty-text text-center" v-if="!taskTypes?.length">
          No tasks yet!
        </p>
        <div v-for="type of taskTypes" class="task-type">
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
          @added-task="fetchTaskTypes"
          @updated-task="fetchTaskTypes"
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
import type { Task } from "~/types/tables"
import NewTaskModal from "./NewTaskModal.vue"

const { fetchTaskTypes, completeTask, deleteTask, taskTypes } = useApp()

const isOpen = ref(false)
const taskToEdit = ref<Task | undefined>()

const setOpen = (open: boolean) => {
  isOpen.value = open
  if (!open) {
    taskToEdit.value = undefined
  }
}

const onDelete = async (task: Task) => {
  const success = await deleteTask(task)
  if (success) {
    await fetchTaskTypes()
  }
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
