<template>
  <ion-page>
    <Header v-if="showHeader" />
    <slot />
  </ion-page>
</template>

<script setup lang="ts">
type Props = { showHeader?: boolean }
withDefaults(defineProps<Props>(), {
  showHeader: true,
})
</script>
