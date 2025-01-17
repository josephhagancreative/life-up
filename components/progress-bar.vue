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
  height: 20px;
  background-color: rgb(189, 189, 189);
  border: 1px solid rgb(189, 189, 189);
}

.inner {
  width: 10px;
  height: 19px;
  background: repeating-linear-gradient(
    45deg,
    #555555,
    #555555 10px,
    #3a3a3a 10px,
    #3a3a3a 20px
  );
}

.text-container {
  display: flex;
  justify-content: space-between;
  margin-top: 0.2rem;
}
</style>
