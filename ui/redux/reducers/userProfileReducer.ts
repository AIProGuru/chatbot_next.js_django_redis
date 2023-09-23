import {profileConstants} from "../constants/actionTypes"

export const userProfileTypesReducer = (state = {}, action: any) => {
	switch (action.type) {
		case profileConstants.GET_PROFILES_TYPES_REQUEST:
			return {loading: true}
		case profileConstants.GET_PROFILES_TYPES_SUCCESS:
			return {data: action.data}
		case profileConstants.GET_PROFILES_TYPES_FAILURE:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const userProfileReducer = (state = {}, action: any) => {
	const rsf_profile1 = profileConstants.getRSF(profileConstants.SAVE_PROFILE1)
	const rsf_profile2 = profileConstants.getRSF(profileConstants.SAVE_PROFILE2)
	switch (action.type) {
		case profileConstants.GET_PROFILE_REQUEST:
			return {loading: true}
		case profileConstants.GET_PROFILE_SUCCESS:
			return {...action.data}
		case rsf_profile1.success:
			return {
				...state,
				stage: 2,
				profile_type: action.data.profile_type,
			}
		case rsf_profile2.success:
			return {
				...state,
				stage: 3,
			}
		case profileConstants.GET_PROFILE_FAILURE:
			return {error: action.error}
		default:
			return {...state}
	}
}

// export const locationsReducer = (state = {data: [],}, action: any) => {
//     export const locationsReducer = (state = {}, action: any) => {
//     //export const favoritesReducer = (state = {}, action: any) => {
//     switch (action.type) {
//         case profileConstants.GET_LOCATIONS_TYPES_REQUEST:
//             return {loading: true,};
//         case profileConstants.GET_LOCATIONS_TYPES_SUCCESS:
//             return {data: action.data,};
//         case profileConstants.GET_LOCATIONS_TYPES_FAILURE:
//             return {error: action.error,};
//         default:
//             return {...state};
//     }
// };

// export const regionsReducer = (state = {data: [],}, action: any) => {
export const regionsReducer = (state = {}, action: any) => {
	switch (action.type) {
		case profileConstants.GET_REGIONS_TYPES_REQUEST:
			return {loading: true}
		case profileConstants.GET_REGIONS_TYPES_SUCCESS:
			return {data: action.data}
		case profileConstants.GET_REGIONS_TYPES_FAILURE:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const areaReducer = (state = {}, action: any) => {
	switch (action.type) {
		case profileConstants.GET_AREA_TYPES_REQUEST:
			return {loading: true}
		case profileConstants.GET_AREA_TYPES_SUCCESS:
			return {data: action.data}
		case profileConstants.GET_AREA_TYPES_FAILURE:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const suitsReducer = (state = {}, action: any) => {
	switch (action.type) {
		case profileConstants.GET_SUITS_TYPES_REQUEST:
			return {loading: true}
		case profileConstants.GET_SUITS_TYPES_SUCCESS:
			return {data: action.data}
		case profileConstants.GET_SUITS_TYPES_FAILURE:
			return {error: action.error}
		default:
			return {...state}
	}
}

// export const relationsReducer = (state = {data: [],}, action: any) => {
export const relationsReducer = (state = {}, action: any) => {
	switch (action.type) {
		case profileConstants.GET_RELATIONS_TYPES_REQUEST:
			return {loading: true}
		case profileConstants.GET_RELATIONS_TYPES_SUCCESS:
			return {data: action.data}
		case profileConstants.GET_RELATIONS_TYPES_FAILURE:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const languagesReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.GET_LANGUAGES)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const availableReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.GET_AVAILABLE)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const preferSpacesReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.GET_PREFER_SPACES)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const experiencesReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.GET_EXPERIENCES)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}
export const bodyStructuresReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.GET_BODY_STRUCTURES)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const bodyHeirReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.GET_BODY_HEIR)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const sexualOrientationsReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.GET_SEXUAL_ORIENTATION)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const skinTonesReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.GET_SKIN_TONES)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const mostImpressiveReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.GET_MOST_IMPRESSIVE)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const smokingTypesReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.GET_SMOKING_TYPE)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const chestSizesReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.GET_CHEST_SIZE)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const favoritesReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.GET_FAVORITES)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const actsReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.GET_ACTS)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const stagesReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.GET_STAGES)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const alcoholsReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.GET_ALCOHOLS)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const smokingPrefersReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.GET_SMOKING_PREFER)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const hostedReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.GET_HOSTED)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}
