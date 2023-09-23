import {createSlice, PayloadAction} from "@reduxjs/toolkit"

interface initialStateProps {
	editMode: boolean
	chatMode: boolean
}

const initialState: initialStateProps = {
	editMode: false,
	chatMode: false,
}

const EditProfileSlice = createSlice({
	name: "EditProfileSlice",
	initialState,
	reducers: {
		toggleEditMode: (state, action: PayloadAction<{state: boolean}>) => {
			state.editMode = action.payload.state
		},
		toggleChatMode: (state, action: PayloadAction<{state: boolean}>) => {
			state.chatMode = action.payload.state
		},
	},
})

export const {toggleEditMode, toggleChatMode} = EditProfileSlice.actions
export default EditProfileSlice.reducer
