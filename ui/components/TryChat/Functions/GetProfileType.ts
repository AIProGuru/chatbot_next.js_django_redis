import {UserProfile} from "@/services/users.service"

const GetProfileType = (profile?: UserProfile) => {
	if (profile && profile.profile_type) {
		return profile.profile_type
	}

	return "undefined_profile_type"
}

export {GetProfileType}
