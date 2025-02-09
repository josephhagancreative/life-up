import { incrementExperience } from "~/mutations/user"
import type { Task, TaskType } from "~/types/tables"

export const useTasks = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const { userData } = useUser()
  const { addTaskHistory } = useTaskHistory()
  const { checkAchievements } = useProfileAchievements()
  const { fetchAchievements } = useAchievements()

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

  const completeTask = async (task: Task) => {
    if (!user.value || !userData.value) {
      return
    }
    const createdTaskHistory = await addTaskHistory(task)
    if (createdTaskHistory.status === 201) {
      const toast = await toastController.create({
        header: "Task Completed: ",
        message: `Completed ${task.name}! New XP: ${
          userData.value.experience + task.experience
        }`,
        duration: 5000,
        cssClass: "task-complete-toast",
        swipeGesture: "vertical",
      })
      await toast.present()
      const targetXP = userData.value.experience + task.experience
      const userRef = ref(userData.value)
      await incrementExperience(userRef, targetXP)
      await checkAchievements()
      await fetchAchievements()
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

  return {
    fetchTaskTypes,
    completeTask,
    deleteTask,
  }
}
