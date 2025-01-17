<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button />
      </ion-buttons>
      <header class="header">
        <div class="user-profile" v-if="userData">
          <span>{{ userData?.username }}</span>
          <span>Lvl: {{ currentLevel.level }}</span>
          <span>XP: {{ userData?.experience }}</span>
        </div>
      </header>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts" setup>
const { userData, refreshUserData, currentLevel, nextLevel } = useUser()
</script>

<style scoped>
.header {
  display: flex;
  justify-content: flex-end;
  padding: 0 1rem;
}

.user-profile {
  display: flex;
  gap: 0.25rem;
}
</style>
