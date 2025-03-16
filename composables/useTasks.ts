import { incrementExperience } from "~/mutations/user"
import type { Task, TaskType } from "~/types/tables"
import type { UserProfile } from "~/types/user"

export const useTasks = (
  userData: Ref<UserProfile>,
  addTaskHistory: (task: Task) => Promise<any>,
  checkAchievements: () => Promise<void>
) => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const taskTypes = ref<(TaskType & { tasks: Task[] })[] | null>(null)

  const fetchTaskTypes = async () => {
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
          type_id,
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

    taskTypes.value = data as Array<TaskType & { tasks: Task[] }>

    const oneTimeIndex = taskTypes.value.findIndex(
      (type) => type.name === ONE_TIME_STRING
    )
    if (oneTimeIndex > -1) {
      const [oneTime] = taskTypes.value.splice(oneTimeIndex, 1)
      taskTypes.value.unshift(oneTime)
    }

    taskTypes.value.forEach((taskType) => {
      taskType.tasks = taskType.tasks || []
      taskType.tasks.sort((a, b) => a.name.localeCompare(b.name))
    })
  }

  const completeTask = async (task: Task) => {
    if (!user.value || !userData?.value) {
      return
    }
    const createdTaskHistory = await addTaskHistory(task)
    if (createdTaskHistory.status === 201) {
      const toast = await toastController.create({
        header: "Task Completed: ",
        message: `Completed ${task.name}!`,
        duration: 5000,
        cssClass: "task-complete-toast",
        swipeGesture: "vertical",
      })
      await toast.present()
      const targetXP = userData.value.experience + task.experience
      const userRef = ref(userData.value)
      await incrementExperience(userRef, targetXP)
      await fetchTaskTypes()
      await checkAchievements()
      return true
    }
    return false
  }

  const deleteTask = async (task: Task) => {
    const { error } = await supabase
      .from("tasks")
      .update({ is_active: false })
      .eq("id", task.id)

    if (error) {
      console.error("Error deactivating task:", error)
      return false
    }
    return true
  }

  onMounted(() => {
    fetchTaskTypes()
  })

  return {
    fetchTaskTypes,
    completeTask,
    deleteTask,
    taskTypes,
  }
}
