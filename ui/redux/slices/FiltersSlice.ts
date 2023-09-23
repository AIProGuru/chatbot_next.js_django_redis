import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {
	lsFiltersStorage,
	lsGetItem,
} from "@/components/ui/Functions/AppLocalStorage"

const defaultValues = JSON.parse(lsGetItem(lsFiltersStorage)) || {}

interface State {
	lock?: boolean //
	nickname?: string | null
	is_near_me?: boolean //
	location?: string | null
	profile_type?: string //
	man_age?: string | null
	woman_age?: string | null
	man_height?: string | null
	woman_height?: string | null
	man_body_type?: string | null
	woman_body_type?: string | null
	man_sexual_orientation?: string | null
	woman_sexual_orientation?: string | null
	man_smoking_habits?: string | null
	woman_smoking_habits?: string | null
	is_online?: boolean //
	verified?: boolean
	[x: string]: any
}

const initialState: State = {
	lock: defaultValues.lock || false,
	nickname: null,
	is_near_me: defaultValues.is_near_me || false,
	location: defaultValues.location || null,
	profile_type: defaultValues.profile_type || "",
	man_age: defaultValues.man_age || null,
	woman_age: defaultValues.woman_age || null,
	man_height: defaultValues.man_height || null,
	woman_height: defaultValues.woman_height || null,
	man_body_type: defaultValues.man_body_type || null,
	woman_body_type: defaultValues.woman_body_type || null,
	man_sexual_orientation: defaultValues.man_sexual_orientation || null,
	woman_sexual_orientation: defaultValues.woman_sexual_orientation || null,
	man_smoking_habits: defaultValues.man_smoking_habits || null,
	woman_smoking_habits: defaultValues.woman_smoking_habits || null,
	is_online: defaultValues.is_online || false,
	verified: defaultValues.verified || false,
	sort_by: defaultValues.sort_by || null,
}

const FiltersSlice = createSlice({
	name: "FiltersSlice",
	initialState,
	reducers: {
		updateFilter: (
			state,
			action: PayloadAction<{filter: string; value: any}>
		) => {
			if (action.payload.filter !== "lock") {
				state[action.payload.filter] = action.payload.value
			}
		},
		lockFilters: (state, action: PayloadAction<{state: boolean}>) => {
			state.lock = action.payload.state
		},
		reloadFiltersFromLS: () => {
			const defaultValues =
				JSON.parse(lsGetItem("filtersStorage")) || initialState
			return defaultValues
		},
		resetFilter: () => initialState,
	},
})

export const {updateFilter, lockFilters, resetFilter, reloadFiltersFromLS} =
	FiltersSlice.actions
export default FiltersSlice.reducer
