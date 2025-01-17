import type { Profile } from "./tables"

export type UserProfile = Pick<
  Profile,
  "username" | "avatar_url" | "email" | "experience"
>

export type AllLevels = { level: number; xpRequired: number }
