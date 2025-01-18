declare module "#app" {
  interface NuxtApp {
    $themeColor: Ref<AppThemeColors>
    $setThemeColor: (theme: AppThemeColors) => void
  }
}

export {}
