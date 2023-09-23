import {authService, profileService} from "../services"
import {profileConstants} from "../constants/actionTypes"

const universalAction = (
	service: any,
	request_type: string,
	success_type: string,
	error_type: string
) => {
	return (dispatch: any) => {
		dispatch(request())
		return service.then(
			(data: any) => {
				// console.log(success_type, data)
				data && dispatch(success(data.data))
			},
			(error: any) => {
				dispatch(failure(error))
			}
		)
	}

	function request() {
		return {type: request_type}
	}

	function success(data: any) {
		return {type: success_type, data}
	}

	function failure(error: any) {
		return {type: error_type, error}
	}
}

// const getLocations = () => {
//     return universalAction(
//         profileService.getLocations(),
//         profileConstants.GET_LOCATIONS_TYPES_REQUEST,
//         profileConstants.GET_LOCATIONS_TYPES_SUCCESS,
//         profileConstants.GET_LOCATIONS_TYPES_FAILURE,
//     )
// }

const getRegions = (query: string, pageSize: number, page: number) => {
	return universalAction(
		profileService.getRegions(query, pageSize, page),
		profileConstants.GET_REGIONS_TYPES_REQUEST,
		profileConstants.GET_REGIONS_TYPES_SUCCESS,
		profileConstants.GET_REGIONS_TYPES_FAILURE
	)
}

const getArea = () => {
	return universalAction(
		profileService.getArea(),
		profileConstants.GET_AREA_TYPES_REQUEST,
		profileConstants.GET_AREA_TYPES_SUCCESS,
		profileConstants.GET_AREA_TYPES_FAILURE
	)
}

const getRelations = () => {
	return universalAction(
		profileService.getRelations(),
		profileConstants.GET_RELATIONS_TYPES_REQUEST,
		profileConstants.GET_RELATIONS_TYPES_SUCCESS,
		profileConstants.GET_RELATIONS_TYPES_FAILURE
	)
}

const getSuits = () => {
	return universalAction(
		profileService.getSuits(),
		profileConstants.GET_SUITS_TYPES_REQUEST,
		profileConstants.GET_SUITS_TYPES_SUCCESS,
		profileConstants.GET_SUITS_TYPES_FAILURE
	)
}

const getLanguages = () => {
	const rsf = profileConstants.getRSF(profileConstants.GET_LANGUAGES)
	return universalAction(
		profileService.getLanguages(),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const getAvailable = () => {
	const rsf = profileConstants.getRSF(profileConstants.GET_AVAILABLE)
	return universalAction(
		profileService.getAvailable(),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const getPreferSpaces = () => {
	const rsf = profileConstants.getRSF(profileConstants.GET_PREFER_SPACES)
	return universalAction(
		profileService.getPreferSpaces(),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const getExperiences = () => {
	const rsf = profileConstants.getRSF(profileConstants.GET_EXPERIENCES)
	return universalAction(
		profileService.getExperiences(),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const getProfile = () => {
	return universalAction(
		profileService.getProfile(),
		profileConstants.GET_PROFILE_REQUEST,
		profileConstants.GET_PROFILE_SUCCESS,
		profileConstants.GET_PROFILE_FAILURE
	)
}

const getProfileTypes = () => {
	return universalAction(
		profileService.getProfileTypes(),
		profileConstants.GET_PROFILES_TYPES_REQUEST,
		profileConstants.GET_PROFILES_TYPES_SUCCESS,
		profileConstants.GET_PROFILES_TYPES_FAILURE
	)
}

const getBodyStructures = () => {
	const rsf = profileConstants.getRSF(profileConstants.GET_BODY_STRUCTURES)
	return universalAction(
		profileService.getBodyStructures(),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const getBodyHair = () => {
	const rsf = profileConstants.getRSF(profileConstants.GET_BODY_HEIR)
	return universalAction(
		profileService.getBodyHair(),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const getSexualOrientation = () => {
	const rsf = profileConstants.getRSF(profileConstants.GET_SEXUAL_ORIENTATION)
	return universalAction(
		profileService.getSexualOrientations(),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const getSkinTones = () => {
	const rsf = profileConstants.getRSF(profileConstants.GET_SKIN_TONES)
	return universalAction(
		profileService.getSkinTones(),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const getMostImpressive = () => {
	const rsf = profileConstants.getRSF(profileConstants.GET_MOST_IMPRESSIVE)
	return universalAction(
		profileService.getMostImpressive(),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const getSmokingTypes = () => {
	const rsf = profileConstants.getRSF(profileConstants.GET_SMOKING_TYPE)
	return universalAction(
		profileService.getSmokingTypes(),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const getChestSizes = () => {
	const rsf = profileConstants.getRSF(profileConstants.GET_CHEST_SIZE)
	return universalAction(
		profileService.getChestSizes(),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const getFavorites = () => {
	const rsf = profileConstants.getRSF(profileConstants.GET_FAVORITES)
	return universalAction(
		profileService.getFavorites(),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const getActs = () => {
	const rsf = profileConstants.getRSF(profileConstants.GET_ACTS)
	return universalAction(
		profileService.getActs(),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const getStages = () => {
	const rsf = profileConstants.getRSF(profileConstants.GET_STAGES)
	return universalAction(
		profileService.getStages(),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const getAlcohols = () => {
	const rsf = profileConstants.getRSF(profileConstants.GET_ALCOHOLS)
	return universalAction(
		profileService.getAlcohols(),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const getSmokingPrefers = () => {
	const rsf = profileConstants.getRSF(profileConstants.GET_SMOKING_PREFER)
	return universalAction(
		profileService.getSmokingPrefers(),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const getHosted = () => {
	const rsf = profileConstants.getRSF(profileConstants.GET_HOSTED)
	return universalAction(
		profileService.getHosted(),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const registerUser = (data: any) => {
	const rsf = profileConstants.getRSF(profileConstants.REGISTRATION)
	return universalAction(
		authService.registerUser(data),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const saveProfileStep1 = (data: any, profileId: number) => {
	const rsf = profileConstants.getRSF(profileConstants.SAVE_PROFILE1)
	return universalAction(
		profileService.saveProfileStep1(data, profileId),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const saveProfileStep2 = (data: any, profileId: number) => {
	const rsf = profileConstants.getRSF(profileConstants.SAVE_PROFILE2)
	return universalAction(
		profileService.saveProfileStep2(data, profileId),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const saveProfileStep3 = (data: any, profileId: number) => {
	const rsf = profileConstants.getRSF(profileConstants.SAVE_PROFILE3)
	return universalAction(
		profileService.saveProfileStep3(data, profileId),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const updateProfile = (profileId: string, step: number, data: any) => {
	const rsf = profileConstants.getRSF(profileConstants.UPDATE_PROFILE)
	return universalAction(
		profileService.updateProfile(profileId, step, data),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const signIn = (data: any) => {
	const rsf = profileConstants.getRSF(profileConstants.SIGN_IN)
	return universalAction(
		authService.signIn(data),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const signInPhone = (data: any) => {
	const rsf = profileConstants.getRSF(profileConstants.SIGN_IN)
	return universalAction(
		authService.signInPhone(data),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const sendOTPPhone = (phone: string, via: string) => {
	const rsf = profileConstants.getRSF(profileConstants.SEND_OTP_PHONE)
	return universalAction(
		authService.sendOTPPhone(phone, via),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

const checkOTPPhone = (phone: string, otp: number) => {
	const rsf = profileConstants.getRSF(profileConstants.CHECK_OTP_PHONE)
	return universalAction(
		authService.checkOTPPhone(phone, otp),
		rsf.request,
		rsf.success,
		rsf.failure
	)
}

export const userProfileActions = {
	getActs,
	getFavorites,
	getStages,
	getAlcohols,
	getSmokingPrefers,
	getHosted,
	getProfile,
	getProfileTypes,
	getRelations,
	// getLocations,
	getRegions,
	getArea,
	getSuits,
	getLanguages,
	getAvailable,
	getPreferSpaces,
	getExperiences,
	getBodyStructures,
	getBodyHair,
	getSexualOrientation,
	getSkinTones,
	getMostImpressive,
	getSmokingTypes,
	getChestSizes,

	registerUser,
	saveProfileStep1,
	saveProfileStep2,
	saveProfileStep3,
	updateProfile,

	signIn,
	signInPhone,
	sendOTPPhone,
	checkOTPPhone,
}
