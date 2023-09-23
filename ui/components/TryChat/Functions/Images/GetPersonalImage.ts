import {ProfileAvatar} from "@/services/images.service"
import {UserProfile} from "@/services/users.service"

const GetPersonalImage = (profile: UserProfile, images: ProfileAvatar[]) => {
	if (profile) {
		const search = images.find((s) => s.profile_id === profile.id)

		if (search) {
			return search.s3_url
		}

		return `/profiles/avatar_${profile.profile_type.toLowerCase()}_64.png`
	}

	return "/profiles/avatar_couple_64.png"
}

export {GetPersonalImage}
