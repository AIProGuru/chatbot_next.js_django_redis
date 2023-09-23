import axiosInstance from "../../app/axiosInstance"
import {accountTypes, profileManWomanTypes} from "@/app/constants"
import {clearObject} from "@/app/utils"
import {ProfileDataStep2} from "@/components/@types/App/Redux/Services/ProfileDataStep2"

export const profileService = {
	getProfileTypes,
	getProfile,
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
	getSexualOrientations,
	getSkinTones,
	getMostImpressive,
	getSmokingTypes,
	getChestSizes,
	getFavorites,
	getActs,
	getStages,
	getAlcohols,
	getHosted,
	getSmokingPrefers,
	saveProfileStep1,
	saveProfileStep2,
	saveProfileStep3,
	updateProfile,
}

// function makeHeaders(locale: string) {
//     return {
//         "Accept-Language": `${locale}`
//     }
// }

function getHosted() {
	return axiosInstance.get("/api/profiles/hosted/")
}

function getSmokingPrefers() {
	return axiosInstance.get("/api/profiles/smoking-prefer/")
}

function getAlcohols() {
	return axiosInstance.get("/api/profiles/alcohol/")
}

function getStages() {
	return axiosInstance.get("/api/profiles/stage/")
}

function getActs() {
	return axiosInstance.get("/api/profiles/act/")
}

function getFavorites() {
	return axiosInstance.get("/api/profiles/favorite/")
}

function getProfileTypes() {
	return axiosInstance.get("/api/profiles/profile-type/")
	//     , {
	//     headers: makeHeaders(locale)
	// })
}

function getRelations() {
	return axiosInstance.get("/api/profiles/relation/")
}

function getSuits() {
	return axiosInstance.get("/api/profiles/suit/")
}

// function getLocations() {
//     return axiosInstance.get('/api/profiles/location/')
// }

function getRegions(query: string, pageSize: number, page: number) {
	// return axiosInstance.get(`/api/profiles/settlement/?search=${query}&page_size=${pageSize}&page=${page}`)
	return axiosInstance.get(
		`/api/profiles/location/?search=${query}&page_size=${pageSize}&page=${page}`
	)
}
function getArea() {
	return axiosInstance.get(`/api/profiles/settlement/`)
}

function getLanguages() {
	return axiosInstance.get("/api/profiles/language/")
}

function getAvailable() {
	return axiosInstance.get("/api/profiles/available/")
}

function getPreferSpaces() {
	return axiosInstance.get("/api/profiles/prefer-space/")
}

function getExperiences() {
	return axiosInstance.get("/api/profiles/experience/")
}

function getBodyStructures() {
	return axiosInstance.get("/api/profiles/body-structure/")
}

function getBodyHair() {
	return axiosInstance.get("/api/profiles/body-hair/")
}

function getSexualOrientations() {
	return axiosInstance.get("/api/profiles/sexual-orientation/")
}

function getSkinTones() {
	return axiosInstance.get("/api/profiles/skin-tone/")
}

function getMostImpressive() {
	return axiosInstance.get("/api/profiles/most-impressive/")
}

function getSmokingTypes() {
	return axiosInstance.get("/api/profiles/type-smoking/")
}

function getChestSizes() {
	return axiosInstance.get("/api/profiles/chest-size/")
}

function getProfile() {
	return axiosInstance.get(
		// `/api/profile-stage/${userId}/?userId=${userId}`
		`/api/profiles/profile-stage/`
		// `/api/profile-stage/`
	)
}

const getSelectedIds = (arr: any) => {
	const ids = []
	for (const key of Object.keys(arr)) {
		if (arr[key]) ids.push(key.split("_")[1])
	}
	return ids
}

function saveProfileStep1(formData: any, profileId: number) {
	const {accountType, suit} = formData

	const suitsIds = getSelectedIds(suit)

	const regionId = (formData && formData.region && formData.region.id) || 0
	// const locationId = formData && formData.region && formData.region.location && formData.region.location.id || 0

	let data: any = {
		// user: userId,
		suits_ids: suitsIds,
		profile_type: accountType,
		// location: formData.location,
		// region: regionId //formData.region,
		// location: locationId, // but Idk, because data coming from "/settlements", and contain locations + settlements, maybe we need to put it in settlements
		// region: regionId
		// location: (regionId !== 1) ? regionId
	}

	if (regionId !== 1) {
		data["location"] = regionId
	}

	if (accountTypes.useWomanAge(accountType))
		data["woman_age_value"] = formData.womanAge
	if (accountTypes.useManAge(accountType))
		data["man_age_value"] = formData.manAge
	if (accountTypes.isCouple(accountType)) data["relation"] = formData.relation

	data = clearObject(data)

	// return

	return axiosInstance.put(
		// `/api/profiles/profile-stage1/`, data
		`/api/profiles/profile/${profileId}/create/1/`,
		data
	)
}

function saveProfileStep2(formData: any, profileId: number) {
	// form data
	const {
		language,
		familyStatus,
		available,
		prefer: prefer_space,
		is_private_meetings_experience,
		is_multi_participant_experience,
		// is_going_out_on_saturday,
		// is_webcam,
		man,
		woman,
	} = formData

	// typed man & woman profile data
	const manProfile: ProfileDataStep2 = man
	const womanProfile: ProfileDataStep2 = woman

	// get selected language id's
	const languagesIds = getSelectedIds(language)

	// common data
	let data: any = {
		// user: userId,
		languages_ids: languagesIds,
		is_family_status: familyStatus === "preferCouples",
		prefer_space,
		available,
		is_private_meetings_experience,
		is_multi_participant_experience,
		// is_going_out_on_saturday,
		// is_webcam,
	}

	// objects for converted man & woman data
	const manData = {}
	const womanData = {}

	if (man) {
		Object.assign(manData, manData, {
			// birthday_month: manProfile.bMonth,
			height: manProfile.height,
			body_structure: manProfile.bodyStructure,
			body_hair: manProfile.bodyHeir,
			sexual_orientation: manProfile.sexualOrientation,
			skin: manProfile.skinTone,
			most_impressive: manProfile.mostImpressive,
			smoking: manProfile.smokingType,
			nickname: manProfile.nickname,
			age: manProfile?.age,
		})

		if (Number(manProfile.bDay) !== 0) {
			Object.assign(manData, manData, {
				birthday_day: manProfile.bDay,
			})
		}

		if (Number(manProfile.bMonth) !== 0) {
			Object.assign(manData, manData, {
				birthday_month: manProfile.bMonth,
			})
		}
	}

	if (woman) {
		Object.assign(womanData, womanData, {
			// birthday_month: womanProfile.bMonth,
			height: womanProfile.height,
			body_structure: womanProfile.bodyStructure,
			chest_size: womanProfile.chestSize,
			sexual_orientation: womanProfile.sexualOrientation,
			skin: womanProfile.skinTone,
			most_impressive: womanProfile.mostImpressive,
			smoking: womanProfile.smokingType,
			nickname: womanProfile.nickname,
			age: womanProfile?.age,
		})

		if (Number(womanProfile.bDay) !== 0) {
			Object.assign(womanData, womanData, {
				birthday_day: womanProfile.bDay,
			})
		}

		if (Number(womanProfile.bMonth) !== 0) {
			Object.assign(womanData, womanData, {
				birthday_month: womanProfile.bMonth,
			})
		}
	}

	// initialize objects in common data
	data[profileManWomanTypes.man] = {}
	data[profileManWomanTypes.woman] = {}

	// attach converted objects to common data
	Object.assign(
		data[profileManWomanTypes.man],
		data[profileManWomanTypes.man],
		manData
	)
	Object.assign(
		data[profileManWomanTypes.woman],
		data[profileManWomanTypes.woman],
		womanData
	)

	// clear data from empty and undefined fields
	data = clearObject(data)

	console.log(data)

	// make request
	// return axiosInstance.post(
	//     `/api/profiles/profile-stage2/`, data
	// )
	return axiosInstance.put(
		// `/api/profiles/profile-stage1/`, data
		`/api/profiles/profile/${profileId}/create/2/`,
		data
	)
}

function saveProfileStep3(formData: any, profileId: number) {
	const {
		favorite,
		act,
		stage,
		alcohol,
		smokingPrefer: smoking_prefer,
		experience,
		hosted,
		about,
		is_agree_terms,
		send_me_updates,
		phone,
		service,
	} = formData

	const favoriteIds = getSelectedIds(favorite)
	const actsIds = getSelectedIds(act)
	const stagesIds = getSelectedIds(stage)
	const serviceIds = getSelectedIds(service)

	let data: any = {
		// user: userId,
		favorites_ids: favoriteIds,
		acts_ids: actsIds,
		stages_ids: stagesIds,
		alcohol,
		smoking_prefer,
		experience,
		is_agree_terms,
		hosted,
		about,
		send_me_updates,
		// phone,
		message_types: serviceIds,
	}

	// const SelectedServices = []
	// for (const field in data) {
	//     if (field.startsWith("service_")) {
	//         if (data[field] === true) {
	//             const srv = field.toString().split("_")
	//             SelectedServices.push(srv[1])
	//             delete data[field]
	//         }
	//     }
	// }
	// data["message_type"] = SelectedServices

	data = clearObject(data)
	console.log(data)

	// return axiosInstance.post(
	//     `/api/profiles/profile-stage3/`, data
	// )

	return axiosInstance.put(
		// `/api/profiles/profile-stage1/`, data
		`/api/profiles/profile/${profileId}/create/3/`,
		data
	)
}

function updateProfile<T>(profileId: string, step: number, formData: T) {
	const data = clearObject(formData)

	return axiosInstance.put(
		`/api/profiles/profile/${profileId}/create/${step}/`,
		data
	)
}
