<template>
  <ion-page>
    <ion-content>
      <div class="page-container">
        <ion-spinner v-if="loading" color="primary" name="crescent" />
        <ion-button v-else @click="handleLogin"
          >Login/Signup With Google</ion-button
        >
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient()
const loading = ref(false)
const config = useRuntimeConfig()

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${config.public.baseUrl}/confirm`,
      },
    })
    if (error) {
      console.error(error)
    }
  } catch (error) {
    console.error(error.error_description || error.message)
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
}
</script>

<style scoped>
.page-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

ion-spinner {
  width: 50px;
  height: 50px;
}
</style>
