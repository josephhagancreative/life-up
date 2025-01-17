import type { AllLevels } from "~/types/user"

export function calculateLevels(
  baseXP: number,
  maxLevel: number,
  growthFactor: number
) {
  const levels = [{ level: 1, xpRequired: 0 }]
  for (let n = 2; n <= maxLevel; n++) {
    const xpDifference = baseXP * Math.pow(Math.log2(n), growthFactor)
    const totalXP = Math.round(
      xpDifference + levels[levels.length - 1].xpRequired
    )
    levels.push({ level: n, xpRequired: totalXP })
  }
  return levels
}

export function getCurrentLevel(levels: AllLevels[], currentXp: number) {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (currentXp >= levels[i].xpRequired) {
      return levels[i]
    }
  }
  return { level: 1, xpRequired: 0 }
}
