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
          <ion-input
            label="Enter Username"
            placeholder="Username"
            v-model="username"
          ></ion-input>
          <ion-button @click="signInWithOtp">Login</ion-button>
        </ion-item>
        {{ email }}
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient()
const config = useRuntimeConfig()
const email = ref("")
const username = ref("")

const signInWithOtp = async () => {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: "example-password",
    options: {
      emailRedirectTo: config.public.baseUrl as string,
      data: {
        username: username.value,
      },
    },
  })
  if (error) console.log(error)
}
</script>

<style></style>
