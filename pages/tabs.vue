<template>
  <ion-page>
    <ion-content>
      <ion-tabs>
        <ion-router-outlet />
        <ion-tab-bar slot="bottom" selected-tab="home">
          <ion-tab-button tab="home" href="/tabs/home">
            <ion-icon :icon="ioniconsGrid" />
          </ion-tab-button>
          <ion-tab-button tab="tasks" href="/tabs/tasks">
            <ion-icon :icon="ioniconsCheckmarkCircle" />
          </ion-tab-button>
          <ion-tab-button tab="stats" href="/tabs/stats">
            <ion-icon :icon="ioniconsTrophy" />
          </ion-tab-button>
          <ion-tab-button tab="settings" href="/tabs/settings">
            <ion-icon :icon="ioniconsPersonCircle" />
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>
<script lang="ts" setup></script>
