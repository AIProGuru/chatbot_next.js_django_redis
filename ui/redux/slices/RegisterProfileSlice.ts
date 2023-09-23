import {createSlice, PayloadAction} from "@reduxjs/toolkit"

interface InitialStateProps {
	profile_type: string
}

const initialState: InitialStateProps = {
	profile_type: "",
}

const RegisterProfileSlice = createSlice({
	name: "RegisterProfileSlice",
	initialState,
	reducers: {
		saveProfileType: (state, action: PayloadAction<InitialStateProps>) => {
			if (action && action.payload.profile_type) {
				state.profile_type = action.payload.profile_type
			}
		},
	},
})

export const {saveProfileType} = RegisterProfileSlice.actions
export default RegisterProfileSlice.reducer
