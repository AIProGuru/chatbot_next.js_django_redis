import {createSlice, PayloadAction} from "@reduxjs/toolkit"
// import {
// 	lsUserInfoStorage,
// 	lsGetItem,
// } from "@/components/ui/Functions/AppLocalStorage"
import {
	GetUserProfilesInfo,
	UserProfilesInfoProfile,
} from "@/services/users.service"

export type Subscription = {
	subscription: string
	expired: boolean
}

export type UserInfo = {
	register: number | null
	current_profile_id: string | null
	email: string | null
	id: string | null
	phone: string | null
	profiles: UserProfilesInfoProfile[] | null
	subscription: Subscription | null
	username: string | null
	subscription_date_to: string | null
	trial: boolean | null
	freeze: boolean | null
}

interface State {
	// userInfo: GetUserProfilesInfo
	userInfo: UserInfo
	[x: string]: any
}
 
const initialState: State = {
	userInfo: {
		register: null,
		current_profile_id: null,
		email: null,
		id: null,
		phone: null,
		profiles: null,
		subscription: null,
		username: null,
		subscription_date_to: null,
		trial: null,
		freeze: null
	},
}
 
const UserInfoSlice = createSlice({
	name: "UserInfoSlice",
	initialState,
	reducers: {
		updateUserInfo: (
			state,
			action: PayloadAction<{value: GetUserProfilesInfo}>
		) => {
			state.userInfo = action.payload.value
		},
		// lockUserInfo: (state, action: PayloadAction<{state: boolean}>) => {
		// 	state.lock = action.payload.state
		// },
		// reloadUserInfoFromLS: () => {
		// 	const defaultValues =
		// 		JSON.parse(lsGetItem("UserInfoStorage")) || initialState
		// 	return defaultValues
		// },
		// resetUserInfo: () => initialState,
	},
})

export const {updateUserInfo} = UserInfoSlice.actions
export default UserInfoSlice.reducer
