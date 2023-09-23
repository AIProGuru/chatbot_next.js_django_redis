import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {
	lsFiltersAvailableStorage,
	lsGetItem,
} from "@/components/ui/Functions/AppLocalStorage"

const defaultValues = JSON.parse(lsGetItem(lsFiltersAvailableStorage)) || {}

interface State {
	lock?: boolean //
	nickname?: string | null
	location?: string | null
	is_near_me?: boolean //
	profile_type?: string //
	title?: string //
	is_online?: boolean //
	verified?: boolean
	hosted?: string
	[x: string]: any
}

const initialState: State = {
	lock: defaultValues.lock || false,
	nickname: null,
	location: defaultValues.location || null,
	is_near_me: defaultValues.is_near_me || false,
	profile_type: defaultValues.profile_type || "",
	title: defaultValues.title || "",
	is_online: defaultValues.is_online || false,
	verified: defaultValues.verified || false,
	hosted: defaultValues.hosted || "",
}

const FiltersAvailableTodaySlice = createSlice({
	name: "FiltersAvailableTodaySlice",
	initialState,
	reducers: {
		updateAvailableFilter: (
			state,
			action: PayloadAction<{filter: string; value: any}>
		) => {
			if (action.payload.filter !== "lock") {
				state[action.payload.filter] = action.payload.value
			}
		},
		lockAvailableFilters: (
			state,
			action: PayloadAction<{state: boolean}>
		) => {
			state.lock = action.payload.state
		},
		reloadAvailableFiltersFromLS: () => {
			const defaultValues =
				JSON.parse(lsGetItem("filtersAvailableStorage")) || initialState
			return defaultValues
		},
		resetAvailableFilter: () => initialState,
	},
})

export const {
	updateAvailableFilter,
	lockAvailableFilters,
	resetAvailableFilter,
	reloadAvailableFiltersFromLS,
} = FiltersAvailableTodaySlice.actions
export default FiltersAvailableTodaySlice.reducer
