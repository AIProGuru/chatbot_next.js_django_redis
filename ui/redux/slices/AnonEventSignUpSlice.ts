import {createSlice, PayloadAction} from "@reduxjs/toolkit"

type AnonEventSignUpPayload = {
	userId?: string | undefined
	price_select?: number | undefined
	payment_method?: "CARD" | "CASH" | undefined
	is_paired_event?: boolean | undefined
	totalPrice?: number | undefined
	price_without_discount?: number | undefined
	discount?: string | undefined
	only_discount?: string | undefined
	subscription_select?: boolean | undefined
	age_man?: number | undefined
	age_woman?: number | undefined
	nickname_man?: string | undefined
	nickname_woman?: string | undefined
	profile_type?: string | undefined
	checkbox_register_me_on_site?: boolean | undefined
	phone_number?: number | undefined
	otp_code?: number | undefined
	signature?: string | undefined
	visitor_id: string | undefined
	title_events: string | undefined
	notifications: string | undefined
}

const initialState = {
	userId: null,
	price_select: null,
	payment_method: null,
	is_paired_event: null,
	totalPrice: null,
	price_without_discount: null,
	discount: null,
	only_discount: null,
	subscription_select: null,
	nickname: {
		woman: null,
		man: null,
	},
	age: {
		woman: null,
		man: null,
	},
	profile_type: null,
	checkbox_register_me_on_site: null,
	phone_number: null,
	otp_code: null,
	signature: null,
	visitor_id: null,
	title_events: null,
	notifications: null,
}

const AnonEventSignUpSlice = createSlice({
	name: "anonEventSignUp",
	initialState,
	reducers: {
		saveAnonStep1: (state, action: any) => {
			action.payload.age_man && (state.age!.man = action.payload.age_man)
			action.payload.age_woman &&
				(state.age!.woman = action.payload.age_woman)
			action.payload.nickname_man &&
				(state.nickname!.man = action.payload.nickname_man)
			action.payload.nickname_woman &&
				(state.nickname!.woman = action.payload.nickname_woman)
			action.payload.profile_type &&
				(state.profile_type = action.payload.profile_type)
		},
		saveAnonStep2: (state, action: any) => {
			action.payload.phone_number &&
				(state.phone_number = action.payload.phone_number)
			action.payload.notifications &&
				(state.notifications = action.payload.notifications)
			action.payload.checkbox_register_me_on_site &&
				(state.checkbox_register_me_on_site =
					action.payload.checkbox_register_me_on_site)
		},
		saveAnonStep3: (state, action: any) => {
			action.payload.otp_code &&
				(state.otp_code = action.payload.otp_code)
			action.payload.signature &&
				(state.signature = action.payload.signature)
		},
		saveAnonStep4: (state, action: any) => {
			action.payload.price_select &&
				(state.price_select = action.payload.price_select)
			action.payload.payment_method &&
				(state.payment_method = action.payload.payment_method)
			action.payload.totalPrice &&
				(state.totalPrice = action.payload.totalPrice)
			action.payload.price_without_discount &&
				(state.price_without_discount =
					action.payload.price_without_discount)
			action.payload.discount &&
				(state.discount = action.payload.discount)
			action.payload.only_discount &&
				(state.only_discount = action.payload.only_discount)
			action.payload.is_paired_event &&
				(state.is_paired_event = action.payload.is_paired_event)
			action.payload.subscription_select &&
				(state.subscription_select = action.payload.subscription_select)
		},
		saveAnonStep5: (state, action: any) => {
			action.payload.visitor_id &&
				(state.visitor_id = action.payload.visitor_id)
			action.payload.title_events &&
				(state.title_events = action.payload.title_events)
		},
		saveAnonUserId: (state, action: any) => {
			action.payload.userId && (state.userId = action.payload.userId)
		},
	},
})

export const {
	saveAnonStep1,
	saveAnonStep2,
	saveAnonStep3,
	saveAnonStep4,
	saveAnonStep5,
	saveAnonUserId,
} = AnonEventSignUpSlice.actions
export default AnonEventSignUpSlice.reducer
