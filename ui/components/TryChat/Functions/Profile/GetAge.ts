import {UserProfile} from "@/services/users.service"

const GetAge = (
	profile: UserProfile,
	profileType: string
): number | undefined => {
	if (!profile) return undefined

	switch (profileType) {
		case "WOMAN":
			return (profile && profile.woman && profile.woman.age) || undefined

		case "MAN":
			return (profile && profile.man && profile.man.age) || undefined

		default:
			return undefined
	}
}

export {GetAge}
