import {createSlice, PayloadAction} from "@reduxjs/toolkit"

type AuthPayload = {
	jwt: string
	captcha: string
}

const initialState: AuthPayload = {
	jwt: "",
	captcha: "",
}

const AuthSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		toggleLoggedIn: (state, action: PayloadAction<AuthPayload>) => {
			if (action && action.payload.jwt) {
				state.jwt = action.payload.jwt
			}
		},
		saveCaptcha: (state, action: PayloadAction<{captcha: string}>) => {
			state.captcha = action.payload.captcha
		},
	},
})

export const {toggleLoggedIn, saveCaptcha} = AuthSlice.actions
export default AuthSlice.reducer
