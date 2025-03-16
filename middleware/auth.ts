export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  // If user is not authenticated and trying to access protected routes
  if (!user.value && to.path.startsWith("/tabs")) {
    return navigateTo("/")
  }

  // If user is authenticated and trying to access auth pages
  if (user.value && to.path === "/") {
    return navigateTo("/tabs/home")
  }
})
