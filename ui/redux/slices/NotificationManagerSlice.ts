import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {
	lsGetItem,
	lsNotificationsManagerStorage,
} from "@/components/ui/Functions/AppLocalStorage"

const defaultValues = JSON.parse(lsGetItem(lsNotificationsManagerStorage)) || {}

interface State {
	suit?: string | null
}

const initialState: State = {
	suit: defaultValues.suit || null,
}

const NotificationManagerSlice = createSlice({
	name: "NotificationManagerSlice",
	initialState,
	reducers: {
		setNMSuit: (state, action: PayloadAction<{suit: string}>) => {
			state.suit = action.payload.suit
		},
	},
})

export const {setNMSuit} = NotificationManagerSlice.actions
export default NotificationManagerSlice.reducer
