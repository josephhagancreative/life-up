<template>
  <ion-page>
    <ion-content>
      <ion-tabs>
        <ion-router-outlet />
        <ion-tab-bar slot="bottom" selected-tab="home">
          <ion-tab-button tab="home" href="/tabs/home">
            <ion-icon :icon="ioniconsPersonCircle" />
            <ion-label>Dashboard</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="tasks" href="/tabs/tasks">
            <ion-icon :icon="ioniconsRibbon" />
            <ion-label>Tasks</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="stats" href="/tabs/stats">
            <ion-icon :icon="ioniconsStatsChart" />
            <ion-label>Stats</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="settings" href="/tabs/settings">
            <ion-icon :icon="ioniconsSettings" />
            <ion-label>Settings</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>
<script lang="ts" setup></script>
