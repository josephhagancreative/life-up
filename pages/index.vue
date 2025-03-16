<template>
  <ion-page>
    <ion-content>
      <div class="page-container">
        <nuxt-img src="/LifeUpLogoColor.png" />
        <h1 class="title">LifeUp</h1>
        <p class="copy">Level up your life with with this habit tracker!</p>
        <ion-spinner v-if="loading" color="primary" name="crescent" />
        <ion-button class="button" v-else @click="handleLogin"
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
    console.error(error)
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
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > .title {
    font-size: 2rem;
  }

  > .copy {
    text-align: center;
    font-size: 1.2rem;
  }

  > .button {
    --background: transparent;
    --border-width: 2px;
    --border-style: solid;
    --border-color: transparent;
    --ripple-color: #6de292;
    background: linear-gradient(white, white) padding-box,
      linear-gradient(160deg, #6de292 0%, #3989f0 100%) border-box;
    border: 3px solid transparent;
    border-radius: var(--border-radius);
    color: var(--ion-color-dark-shade);
  }
}

ion-spinner {
  width: 50px;
  height: 50px;
}
</style>
