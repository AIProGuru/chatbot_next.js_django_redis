import {
	configureStore,
	isRejectedWithValue,
	Middleware,
	MiddlewareAPI,
} from "@reduxjs/toolkit"

import {
	otpCheckReducer,
	otpStatusReducer,
	registerUserDataReducer,
	signInDataReducer,
	userProfileSaveStep1Reducer,
	userProfileSaveStep2Reducer,
	userProfileSaveStep3Reducer,
	userUpdateProfileReducer,
} from "./reducers/userProfileSaveReducer"
import {
	userProfileTypesReducer,
	userProfileReducer,
	regionsReducer,
	relationsReducer,
	languagesReducer,
	experiencesReducer,
	bodyStructuresReducer,
	suitsReducer,
	preferSpacesReducer,
	availableReducer,
	bodyHeirReducer,
	sexualOrientationsReducer,
	skinTonesReducer,
	mostImpressiveReducer,
	smokingTypesReducer,
	chestSizesReducer,
	favoritesReducer,
	actsReducer,
	stagesReducer,
	alcoholsReducer,
	smokingPrefersReducer,
	hostedReducer,
	areaReducer,
} from "./reducers/userProfileReducer"

import {eventsApi} from "./services/events.service"
import AuthSlice from "./slices/AuthSlice"
import {setupListeners} from "@reduxjs/toolkit/query"
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux"
import {usersApi} from "./services/users.service"
import {anonApi} from "@/services/anonymous.service"
import AnonEventSignUpSlice from "@/redux/slices/AnonEventSignUpSlice"
import SignUpSlice from "@/redux/slices/SignUpSlice"
import RegisterProfileSlice from "@/redux/slices/RegisterProfileSlice"
import {imageApi} from "./services/images.service"
import {chatApi} from "./services/chat.service"
import {paymentApi} from "./services/payment.service"
import {recommendationsApi} from "@/services/recommendations.service"
import {authApi} from "@/redux/services"
import EditProfileSlice from "@/redux/slices/EditProfileSlice"
import {availableApi} from "./services/available.service"
import FiltersSlice from "@/redux/slices/FiltersSlice"
import FiltersAvailableTodaySlice from "@/redux/slices/FiltersAvailableTodaySlice"
import {createWrapper} from "next-redux-wrapper"
import {supportApi} from "@/services/support.service"
import {blogApi} from "./services/blog.service"
// import NotificationManagerSlice from "@/redux/slices/NotificationManagerSlice"
import {staticApi} from "@/services/static.service"
import TryChatSlice from "@/redux/slices/TryChatSlice"
import UserInfoSlice from "./slices/UserInfoSlice"
import { subscriptionApi } from "./services/subscription.service"

export const rtkQueryErrorLogger: Middleware =
	(api: MiddlewareAPI) => (next) => (action) => {
		// RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
		if (isRejectedWithValue(action)) {
		// 	console.warn("We got a rejected action!")
		}

		return next(action)
	}

export function setUpStore() {
	const store = configureStore({
		reducer: {
			favorites: favoritesReducer,
			acts: actsReducer,
			stages: stagesReducer,
			alcohols: alcoholsReducer,
			smokingPrefers: smokingPrefersReducer,
			hosted: hostedReducer,
			regions: regionsReducer,
			area: areaReducer,
			suits: suitsReducer,
			relations: relationsReducer,
			languages: languagesReducer,
			bodyStructures: bodyStructuresReducer,
			bodyHeir: bodyHeirReducer,
			sexualOrientations: sexualOrientationsReducer,
			skinTones: skinTonesReducer,
			mostImpressive: mostImpressiveReducer,
			smokingTypes: smokingTypesReducer,
			chestSizes: chestSizesReducer,
			preferSpaces: preferSpacesReducer,
			experiences: experiencesReducer,
			available: availableReducer,
			userProfileTypes: userProfileTypesReducer,
			userProfile: userProfileReducer,
			registerUserData: registerUserDataReducer,
			userProfileSaveStep1: userProfileSaveStep1Reducer,
			userProfileSaveStep2: userProfileSaveStep2Reducer,
			userProfileSaveStep3: userProfileSaveStep3Reducer,
			userUpdateProfile: userUpdateProfileReducer,
			signInData: signInDataReducer,
			otpStatus: otpStatusReducer,
			otpCheck: otpCheckReducer,
			[eventsApi.reducerPath]: eventsApi.reducer,
			[usersApi.reducerPath]: usersApi.reducer,
			[anonApi.reducerPath]: anonApi.reducer,
			[imageApi.reducerPath]: imageApi.reducer,
			[chatApi.reducerPath]: chatApi.reducer,
			[recommendationsApi.reducerPath]: recommendationsApi.reducer,
			[paymentApi.reducerPath]: paymentApi.reducer,
			[authApi.reducerPath]: authApi.reducer,
			[availableApi.reducerPath]: availableApi.reducer,
			[supportApi.reducerPath]: supportApi.reducer,
			[blogApi.reducerPath]: blogApi.reducer,
			[staticApi.reducerPath]: staticApi.reducer,
			[subscriptionApi.reducerPath]: subscriptionApi.reducer,
			auth: AuthSlice,
			anonEventSignUp: AnonEventSignUpSlice,
			SignUpSlice: SignUpSlice,
			RegisterProfileSlice: RegisterProfileSlice,
			EditProfileSlice: EditProfileSlice,
			FiltersSlice: FiltersSlice,
			FiltersAvailableTodaySlice: FiltersAvailableTodaySlice,
			// NotificationManagerSlice: NotificationManagerSlice,
			TryChatSlice: TryChatSlice,
			UserInfoSlice: UserInfoSlice,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				// serializableCheck: false,
			}).concat([
				eventsApi.middleware,
				usersApi.middleware,
				anonApi.middleware,
				imageApi.middleware,
				chatApi.middleware,
				recommendationsApi.middleware,
				paymentApi.middleware,
				authApi.middleware,
				availableApi.middleware,
				supportApi.middleware,
				blogApi.middleware,
				staticApi.middleware,
				subscriptionApi.middleware,
				rtkQueryErrorLogger,
			]),
	})

	setupListeners(store.dispatch)

	return store
}

export const store = setUpStore()

export type AppStore = ReturnType<typeof setUpStore>
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const wrapper = createWrapper<AppStore>(setUpStore, {
	debug: false,
	serializeState: (state) => JSON.stringify(state),
	deserializeState: (state) => JSON.parse(state),
})
