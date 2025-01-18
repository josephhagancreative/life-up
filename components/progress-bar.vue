<template>
  <div class="container">
    <div class="inner" :style="{ width: `${percentage}%` }" />
    <div class="text-container">
      <span>{{ initialNumber }}</span>
      <span>{{ maxNumber }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { round } from "lodash"

const props = defineProps<{
  initialNumber: number
  maxNumber: number
  currentNumber: number
}>()

const percentage = computed(() => {
  const totalDifference = props.maxNumber - props.initialNumber
  const currentDifference = props.currentNumber - props.initialNumber
  if (totalDifference <= 0) return 0
  return round((currentDifference / totalDifference) * 100)
})
</script>

<style scoped>
.container {
  width: 100%;
  height: 10px;
  background-color: var(--light-grey);
  outline: 1px solid var(--mid-grey);
  border-radius: 0.2rem;
}

.inner {
  width: 1px;
  height: 10px;
  background-color: var(--ion-color-primary);
  border-radius: 0.2rem;
}

.text-container {
  display: flex;
  justify-content: space-between;
  margin-top: 0.2rem;
  color: var(--ion-color-primary-tint);
}
</style>
