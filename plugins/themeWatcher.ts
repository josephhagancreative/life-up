import type { AppThemeColors } from "~/types/theme"

export default defineNuxtPlugin((nuxtApp) => {
  const themeColor = useCookie<string>("themeColor", {
    default: () => "teal",
    watch: true,
  })

  const setThemeColor = (newTheme: AppThemeColors) => {
    themeColor.value = newTheme
  }

  /**
   * Updates CSS variables in the :root style to use the theme colors dynamically.
   *
   * @param newColorVariable - The new color theme (e.g., "teal" or "mauve").
   */

  const updateThemeColor = (newColorVariable: AppThemeColors) => {
    const themeVariablesMap = {
      "--ion-color-primary": `--theme-${newColorVariable}`,
      "--ion-color-primary-rgb": `--theme-${newColorVariable}-rgb`,
      "--ion-color-primary-contrast": `--theme-${newColorVariable}-contrast`,
      "--ion-color-primary-contrast-rgb": `--theme-${newColorVariable}-contrast-rgb`,
      "--ion-color-primary-shade": `--theme-${newColorVariable}-shade`,
      "--ion-color-primary-tint": `--theme-${newColorVariable}-tint`,
    }

    const root = document.documentElement

    Object.entries(themeVariablesMap).forEach(([ionVar, themeVar]) => {
      const themeValue = getComputedStyle(root).getPropertyValue(themeVar)
      root.style.setProperty(ionVar, themeValue)
    })
  }

  watch(
    themeColor,
    (newTheme) => {
      updateThemeColor(newTheme as AppThemeColors)
    },
    {
      immediate: true,
    }
  )

  return {
    provide: {
      themeColor,
      setThemeColor,
    },
  }
})
