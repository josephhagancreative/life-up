import type { UserProfile } from "~/types/user"

export const useApp = () => {
  const {
    userData,
    refreshUserData,
    currentLevel,
    nextLevel,
    userDeleteTaskHistory,
  } = useUser()

  const { achievements, fetchAchievements } = useAchievements()

  const { checkAchievements } = useProfileAchievements(
    currentLevel,
    refreshUserData
  )

  const { taskHistories, addTaskHistory, refetchHistories, deleteTaskHistory } =
    useTaskHistory()

  const { fetchTaskTypes, completeTask, deleteTask } = useTasks(
    userData as Ref<UserProfile>,
    addTaskHistory,
    checkAchievements,
    fetchAchievements
  )

  return {
    userData,
    refreshUserData,
    currentLevel,
    nextLevel,
    userDeleteTaskHistory,
    achievements,
    fetchAchievements,
    fetchTaskTypes,
    completeTask,
    deleteTask,
    taskHistories,
    addTaskHistory,
    refetchHistories,
    deleteTaskHistory,
    checkAchievements,
  }
}
