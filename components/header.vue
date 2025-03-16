<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button />
      </ion-buttons>
      <header class="header">
        <div class="logo">
          <icon name="i:logo" size="36" alt="Logo" class="icon" />
        </div>
        <div class="user-profile" v-if="userData">
          <div class="text-container">
            <p class="text -user">{{ userData?.username }}</p>
            <p class="text -xp">XP: {{ userData?.experience }}</p>
          </div>
          <div class="experience-bar-container">
            <progress-wheel
              :initialNumber="currentLevel.xpRequired"
              :currentNumber="userData.experience"
              :maxNumber="nextLevel.xpRequired"
              :level="currentLevel.level"
              :size="35"
            />
          </div>
        </div>
      </header>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts" setup>
const { userData, currentLevel, nextLevel } = useApp()
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 1rem;
}

.logo {
  display: flex;
  align-items: center;
  color: var(--ion-color-primary-shade);
}

.img {
  max-width: 40px;
  height: auto;
  width: 100%;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.text-container {
  display: flex;
  flex-direction: column;
  justify-content: center;

  > .text {
    margin: 0;
    margin-right: 0.25rem;

    &.-user {
      font-size: 1.1rem;
      font-weight: bold;
      color: var(--ion-color-primary-shade);
    }

    &.-xp {
      font-size: 0.9rem;
      color: var(--ion-color-medium-shade);
    }
  }
}
</style>
