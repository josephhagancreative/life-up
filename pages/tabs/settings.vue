<template>
  <PageContainer>
    <ion-content>
      <div class="page-container">
        <h1>Settings</h1>
        <div>
          <h2>Account</h2>
          <ion-button router-link="/account">Account Page</ion-button>
        </div>
        <div>
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
      </div>
    </ion-content>
  </PageContainer>
</template>
<script lang="ts" setup>
import type { AppThemeColors } from "~/types/theme"

const { $setThemeColor } = useNuxtApp()
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
</script>

<style scoped>
.page-container {
  padding: 0 1rem;
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
</style>
