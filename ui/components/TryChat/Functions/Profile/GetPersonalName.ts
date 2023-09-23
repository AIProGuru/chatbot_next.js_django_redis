import {UserProfile} from "@/services/users.service"

const GetPersonalName = (profile: UserProfile) => {
	if (profile) {
		const username = profile.user_username

		switch (profile.profile_type) {
			case "WOMAN":
				return profile.woman.nickname
					? profile.woman.nickname
					: username

			case "MAN":
				return profile.man.nickname ? profile.man.nickname : username

			case "COUPLE":
				return profile.couple_nickname
					? profile.couple_nickname
					: username

			default:
				return username
		}
	}

	return ""
}

export {GetPersonalName}
