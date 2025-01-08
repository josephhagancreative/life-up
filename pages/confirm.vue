<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div>Waiting for login...</div>
      {{ user }}
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
const user = useSupabaseUser()

if (user.value) {
  console.log("user value!")
  navigateTo("/")
}

watch(
  user,
  () => {
    if (user.value) {
      return navigateTo("/")
    }
  },
  { immediate: true }
)
</script>

<style></style>
