export const usePopup = () => {
  const showAchievement = async (achievement: { name: string }) => {
    const toast = await toastController.create({
      message: `Achievement Unlocked: ${achievement.name}`,
      duration: 3000,
      position: "middle",
      cssClass: "achievement-toast",
      icon: ioniconsTrophyOutline,
      buttons: [
        {
          icon: ioniconsCloseOutline,
          role: "cancel",
        },
      ],
    })
    await toast.present()
  }
  const showError = async (text: string) => {
    const toast = await toastController.create({
      message: `Error: ${text}`,
      duration: 3000,
      position: "middle",
      cssClass: "error-toast",
      icon: ioniconsWarning,
      buttons: [
        {
          icon: ioniconsCloseOutline,
          role: "cancel",
        },
      ],
    })
    await toast.present()
  }

  return {
    showAchievement,
    showError,
  }
}
