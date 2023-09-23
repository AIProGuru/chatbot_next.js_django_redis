import {createSlice, PayloadAction} from "@reduxjs/toolkit"

interface InitialStateProps {
	step: number
	username: string
	password: string
	email: string
	phone: string
	send_me_updates: boolean
}

const initialState: InitialStateProps = {
	step: 0,
	username: "",
	password: "",
	email: "",
	phone: "",
	send_me_updates: false,
}

const SignUpSlice = createSlice({
	name: "SignUpSlice",
	initialState,
	reducers: {
		saveSignUpData: (
			state,
			action: PayloadAction<{userData: InitialStateProps}>
		) => {
			if (action && action.payload.userData) {
				state.username = action.payload.userData.username
				state.password = action.payload.userData.password
				state.email = action.payload.userData.email
				state.send_me_updates = action.payload.userData.send_me_updates
				state.step = 1
			}
		},
		savePhoneNumber: (state, action: PayloadAction<{phone: string}>) => {
			if (action && action.payload.phone) {
				state.phone = action.payload.phone
				state.step = 2
			}
		},
	},
})

export const {saveSignUpData, savePhoneNumber} = SignUpSlice.actions
export default SignUpSlice.reducer
