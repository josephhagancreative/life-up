<template>
  <div
    class="circle-container"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg class="progress-circle" :viewBox="`0 0 ${size} ${size}`">
      <path class="circle-bg" :style="{ strokeWidth }" :d="circlePath" />
      <path
        class="circle"
        :style="{
          strokeDasharray: `${
            circumference * (percentage / 100)
          } ${circumference}`,
          strokeWidth,
        }"
        :d="circlePath"
      />
    </svg>
    <div class="text-container">
      <span class="level-text" :style="{ fontSize }">{{ level ?? "" }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { round } from "lodash"

type Props = {
  initialNumber: number
  maxNumber: number
  currentNumber: number
  level?: number
  size?: number
}
const props = withDefaults(defineProps<Props>(), {
  size: 40,
})

const strokeWidth = computed(() => props.size / 9)
const radius = computed(() => props.size / 2 - strokeWidth.value / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const circlePath = computed(() => {
  const r = radius.value
  const center = props.size / 2
  return `
    M ${center} ${center - r}
    a ${r} ${r} 0 1 1 0 ${2 * r}
    a ${r} ${r} 0 1 1 0 -${2 * r}
  `
})

const fontSize = computed(() => `${props.size / 2.4}px`)

const percentage = computed(() => {
  const totalDifference = props.maxNumber - props.initialNumber
  const currentDifference = props.currentNumber - props.initialNumber
  if (totalDifference <= 0) return 0
  return round((currentDifference / totalDifference) * 100)
})
</script>

<style scoped>
.circle-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-circle {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.circle-bg {
  fill: none;
  stroke: #ddd;
}

.circle {
  fill: none;
  stroke: var(--ion-color-primary);
  stroke-linecap: round;
  stroke-dasharray: 0, 100;
  transition: stroke-dasharray 0.1s ease;
}

.text-container {
  position: absolute;
  text-align: center;
}

.level-text {
  font-size: 1rem;
  font-weight: bold;
  color: var(--ion-color-medium-shade);
}
</style>
