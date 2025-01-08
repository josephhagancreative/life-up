<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/settings" />
        </ion-buttons>
        <ion-title>Account</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-input
            label="Enter Email"
            placeholder="Email"
            v-model="email"
            readonly
          />
        </ion-item>
        <ion-item>
          <ion-input
            label="Username"
            placeholder="username"
            v-model="username"
          />
        </ion-item>
        <ion-item>
          <ion-input
            label="Avatar Path"
            placeholder="Avatar Path"
            v-model="avatar_path"
          />
        </ion-item>

        <ion-button @click="updateProfile" :disabled="loading">{{
          loading ? "Loading ..." : "Update"
        }}</ion-button>
      </ion-list>

      <div>
        <ion-button class="button block" @click="signOut" :disabled="loading">
          Sign Out
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import type { Profile } from "~/database.types"

const supabase = useSupabaseClient()

const loading = ref(true)
const username = ref("")
const avatar_path = ref("")
const email = ref("")

loading.value = true
const user = useSupabaseUser()

const { data: userData } = useAsyncData("mountains", async () => {
  if (!user.value) {
    return
  }
  const { data } = await supabase
    .from("profiles")
    .select(`username, avatar_url`)
    .eq("id", user.value.id)
    .single<Pick<Profile, "username" | "avatar_url">>()

  email.value = user.value.email ?? ""

  if (data) {
    username.value = data.username!
    avatar_path.value = data.avatar_url!
  }

  loading.value = false
  return data
})

async function updateProfile() {
  try {
    loading.value = true
    const user = useSupabaseUser()

    if (!user.value) {
      return
    }

    const updates = {
      id: user.value.id,
      username: username.value,
      avatar_url: avatar_path.value,
      updated_at: new Date(),
    }

    const { error } = await supabase.from("profiles").upsert(updates, {
      returning: "minimal",
    })
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

async function signOut() {
  try {
    loading.value = true
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
    navigateTo("/")
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style></style>
