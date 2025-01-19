export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()

  if (to.path === "/confirm" && user.value) {
    return navigateTo("/")
  }
})
