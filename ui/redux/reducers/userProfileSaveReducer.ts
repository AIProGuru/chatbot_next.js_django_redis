import {profileConstants} from "../constants/actionTypes"

export const registerUserDataReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.REGISTRATION)
	switch (action.type) {
		case rsf.request:
			return {saving: true}
		case rsf.success:
			return {success: true, data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const signInDataReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.SIGN_IN)
	switch (action.type) {
		case rsf.request:
			return {saving: true}
		case rsf.success:
			return {success: true, data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const otpStatusReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.SEND_OTP_PHONE)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {success: true, data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const otpCheckReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.CHECK_OTP_PHONE)
	switch (action.type) {
		case rsf.request:
			return {loading: true}
		case rsf.success:
			return {success: true, data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const userProfileSaveStep1Reducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.SAVE_PROFILE1)
	switch (action.type) {
		case rsf.request:
			return {saving: true}
		case rsf.success:
			return {success: true, data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const userProfileSaveStep2Reducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.SAVE_PROFILE2)
	switch (action.type) {
		case rsf.request:
			return {saving: true}
		case rsf.success:
			return {success: true, data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const userProfileSaveStep3Reducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.SAVE_PROFILE3)
	switch (action.type) {
		case rsf.request:
			return {saving: true}
		case rsf.success:
			return {success: true, data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}

export const userUpdateProfileReducer = (state = {}, action: any) => {
	const rsf = profileConstants.getRSF(profileConstants.UPDATE_PROFILE)
	switch (action.type) {
		case rsf.request:
			return {saving: true}
		case rsf.success:
			return {success: true, data: action.data}
		case rsf.failure:
			return {error: action.error}
		default:
			return {...state}
	}
}
