import type { UserProfile } from "~/types/user"

export async function incrementExperience(
  user: Ref<UserProfile | null | undefined>,
  targetXP: number
) {
  if (!user.value) {
    throw new Error("User data is null or undefined")
  }
  const INCREMENT_DURATION = 1000
  const currentXP = user.value.experience
  const difference = targetXP - currentXP
  const incrementCount = 20
  const incrementInterval = INCREMENT_DURATION / incrementCount

  for (let i = 1; i <= incrementCount; i++) {
    const nextXP = Math.round(currentXP + (difference * i) / incrementCount)
    user.value.experience = nextXP
    await new Promise((resolve) => setTimeout(resolve, incrementInterval))
  }

  user.value.experience = targetXP
}
