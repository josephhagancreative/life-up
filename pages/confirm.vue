<template>
  <ion-page>
    <ion-content>
      <div class="container">
        <ion-spinner color="primary" name="crescent" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["auth-confirmation"],
})
const user = useSupabaseUser()

setTimeout(() => {
  if (!user.value) {
    navigateTo("/login")
  } else {
    navigateTo("/")
  }
}, 3000)
</script>

<style scoped>
.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

ion-spinner {
  width: 50px;
  height: 50px;
}
</style>
