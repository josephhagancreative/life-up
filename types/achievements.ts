import type { Achievement, ProfileAchievement } from "./tables"

export type IProfileAchievement = ProfileAchievement & {
  achievements: Pick<Achievement, "id" | "name" | "img_url" | "description">
}
