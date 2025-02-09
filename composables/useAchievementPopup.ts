export const useAchievementPopup = () => {
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

  return {
    showAchievement,
  }
}
