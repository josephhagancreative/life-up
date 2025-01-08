<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-input
            label="Enter Email"
            placeholder="Email"
            v-model="email"
          ></ion-input>
          <ion-button @click="handleLogin">Login</ion-button>
        </ion-item>
        {{ email }}
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient()
const loading = ref(false)
const email = ref("")

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithOtp({ email: email.value })
    if (error) throw error
    alert("Check your email for the login link!")
  } catch (error) {
    alert(error.error_description || error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style></style>
