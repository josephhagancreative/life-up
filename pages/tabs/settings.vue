<template>
  <PageContainer>
    <ion-content>
      <div class="page-container">
        <h1>Settings</h1>
        <div class="settings-section">
          <h2>Account</h2>
          <ion-list>
            <ion-item>
              <ion-input
                label="Username:"
                placeholder="username"
                v-model="username"
              />
              <ion-button @click="updateProfile" :disabled="loading">
                {{ loading ? "Loading" : "Update" }}
              </ion-button>
            </ion-item>
          </ion-list>
        </div>
        <div class="settings-section">
          <h2>Theme</h2>
          <div class="button-container">
            <button
              v-for="color in themeColors"
              :class="`btn -${color}`"
              @click="$setThemeColor(color)"
            >
              <ion-icon slot="icon-only" />
            </button>
          </div>
        </div>
        <div class="settings-section">
          <ion-button
            class="sign-out-button"
            color="danger"
            @click="signOut"
            :disabled="loading"
          >
            Sign Out
          </ion-button>
        </div>
      </div>
    </ion-content>
  </PageContainer>
</template>

<script lang="ts" setup>
import type { AppThemeColors } from "~/types/theme"

const supabase = useSupabaseClient()
const { $setThemeColor } = useNuxtApp()
const { refreshUserData, userData } = useApp()

const loading = ref(false)
const username = ref("")
const user = useSupabaseUser()

const themeColors: AppThemeColors[] = [
  "red",
  "orange",
  "yellow",
  "pink",
  "mauve",
  "blue",
  "teal",
  "green",
  "slate",
]

watchEffect(() => {
  if (userData.value?.username) {
    username.value = userData.value.username
  }
})

async function updateProfile() {
  try {
    loading.value = true
    if (!user.value) return

    const updates = {
      id: user.value.id,
      username: username.value,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("profiles").upsert(updates)
    if (error) throw error
    await refreshUserData()
  } catch (error) {
    alert(error)
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
    alert(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-container {
  padding: 1rem;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.settings-section {
  margin-bottom: 1rem;

  &:last-child {
    margin-top: auto;
    margin-bottom: 0.5rem;
  }
}

.button-container {
  display: flex;
  gap: 0.25rem;
}

.btn {
  width: 35px;
  height: 35px;
  border-radius: 0.25rem;

  &.-red {
    background-color: var(--theme-red);
    border: 3px solid var(--theme-red-shade);
    &:hover {
      background-color: var(--theme-red-tint);
    }
    &:active {
      background-color: var(--theme-red-shade);
    }
  }
  &.-orange {
    background-color: var(--theme-orange);
    border: 3px solid var(--theme-orange-shade);
    &:hover {
      background-color: var(--theme-orange-tint);
    }
    &:active {
      background-color: var(--theme-orange-shade);
    }
  }
  &.-yellow {
    background-color: var(--theme-yellow);
    border: 3px solid var(--theme-yellow-shade);
    &:hover {
      background-color: var(--theme-yellow-tint);
    }
    &:active {
      background-color: var(--theme-yellow-shade);
    }
  }
  &.-pink {
    background-color: var(--theme-pink);
    border: 3px solid var(--theme-pink-shade);
    &:hover {
      background-color: var(--theme-pink-tint);
    }
    &:active {
      background-color: var(--theme-pink-shade);
    }
  }
  &.-mauve {
    background-color: var(--theme-mauve);
    border: 3px solid var(--theme-mauve-shade);
    &:hover {
      background-color: var(--theme-mauve-tint);
    }
    &:active {
      background-color: var(--theme-mauve-shade);
    }
  }
  &.-blue {
    background-color: var(--theme-blue);
    border: 3px solid var(--theme-blue-shade);
    &:hover {
      background-color: var(--theme-blue-tint);
    }
    &:active {
      background-color: var(--theme-blue-shade);
    }
  }
  &.-teal {
    background-color: var(--theme-teal);
    border: 3px solid var(--theme-teal-shade);
    &:hover {
      background-color: var(--theme-teal-tint);
    }
    &:active {
      background-color: var(--theme-teal-shade);
    }
  }
  &.-green {
    background-color: var(--theme-green);
    border: 3px solid var(--theme-green-shade);
    &:hover {
      background-color: var(--theme-green-tint);
    }
    &:active {
      background-color: var(--theme-green-shade);
    }
  }
  &.-slate {
    background-color: var(--theme-slate);
    border: 3px solid var(--theme-slate-shade);
    &:hover {
      background-color: var(--theme-slate-tint);
    }
    &:active {
      background-color: var(--theme-slate-shade);
    }
  }
}

.sign-out-button {
  width: 100%;
  margin-top: 2rem;
}
</style>
