import {createApi} from "@reduxjs/toolkit/dist/query/react"
import {axiosBaseQuery} from "@/redux/config/axios"
import getConfig from "next/config"
import {HYDRATE} from "next-redux-wrapper"
const {publicRuntimeConfig} = getConfig()

type GetEventsProps = {
	page: number
	pageSize: number
}

type GetEventProps = {
	eventId: string | string[] | undefined
}

type PaymentCheckEventProps = {
	paymentId: string | string[] | undefined
}

type GetProfileProps = {
	profileId: string | string[] | undefined
}

type RegisterUserToEventProps = {
	eventId: string
	data: UserData
}

export type UserData = {
	otp_code?: number
	phone_number?: number
	user_id?: string
	profile_type?: string
	email?: string
	username?: string
	subscription?: boolean
	registration_date?: string
	man_nickname?: string
	woman_nickname?: string
	man_age?: number
	woman_age?: number
	status?: string
	visited?: boolean
	price?: number
}

export const anonApi = createApi({
	baseQuery: axiosBaseQuery({
		// baseURL: process.env.apiUrl as string
		baseURL: publicRuntimeConfig?.apiUrl as string,
	}),
	reducerPath: "anon",
	tagTypes: ["Profile", "Profiles"],
	extractRehydrationInfo(action, {reducerPath}) {
		if (action.type === HYDRATE) {
			return action.payload[reducerPath]
		}
	},
	endpoints: (build) => ({
		// get events
		anonGetEvents: build.query<any, GetEventsProps>({
			query: (arg) => {
				const {page, pageSize} = arg

				return {
					method: "get",
					url: `public/events/`,
					params: {
						page: page,
						page_size: pageSize,
					},
				}
			},
		}),
		// get event by id
		anonGetEvent: build.query<any, GetEventProps>({
			query: (arg) => {
				const {eventId} = arg

				return {
					method: "get",
					url: `public/events/${eventId}/`,
				}
			},
		}),
		// get all available tickets and prices
		anonGetEventsPrice: build.query<any, any>({
			query: (arg) => {
				const {eventId} = arg

				return {
					method: "get",
					url: `public/events/event-price-list/${eventId}/`,
				}
			},
		}),
		anonGetPairedEventPrice: build.query<any, GetEventProps>({
			query: (arg) => {
				const {eventId} = arg

				return {
					method: "get",
					url: `public/event/paired-prices-event/${eventId}`,
				}
			},
		}),
		// anon user registration to event
		anonRegisterUserToEvent: build.mutation<any, RegisterUserToEventProps>({
			query: (arg) => {
				const {eventId, data} = arg

				return {
					method: "post",
					url: `public/events/user-registration-event/${eventId}/`,
					data: data,
				}
			},
		}),
		anonGetProfilesMainInfo: build.query<any, GetEventsProps>({
			query: (arg) => {
				const {page, pageSize} = arg

				return {
					method: "get",
					url: `public/main-profile-info/`,
					params: {
						page: page,
						page_size: pageSize,
					},
				}
			},
		}),
		// get profile by id
		anonGetProfile: build.query<any, GetProfileProps>({
			query: (arg) => {
				const {profileId} = arg

				return {
					method: "get",
					url: `public/profile/${profileId}/`,
				}
			},
		}),
		paymentCheckEvent: build.query<any, PaymentCheckEventProps>({
			query: (arg) => {
				const {paymentId} = arg

				return {
					method: "get",
					url: `api/events/price/checkout/${paymentId}/`,
				}
			},
		}),
		getPublicProfileAvatars: build.mutation<any, any>({
			query: (arg) => {
				const {profileIds} = arg

				return {
					url: `public/images/images_list/`,
					method: "post",
					data: {
						profile_ids: profileIds,
					},
				}
			},
		}),
		seoBlogs: build.query<any, any>({
			query: (arg) => {
				return {
					method: "get",
					url: `public/blog/blog-seo/`,
				}
			},
		}),
		seoActicles: build.query<any, any>({
			query: (arg) => {
				return {
					method: "get",
					url: `public/blog/article-seo/`,
				}
			},
		}),
		seoForum: build.query<any, any>({
			query: (arg) => {
				return {
					method: "get",
					url: `public/blog/forum-seo/`,
				}
			},
		}),
		seoSection: build.query<any, any>({
			query: (arg) => {
				return {
					method: "get",
					url: `public/blog/section-seo/`,
				}
			},
		}),
	}),
})

export const {
	useAnonGetEventsQuery,
	useAnonGetEventQuery,
	useAnonGetEventsPriceQuery,
	useAnonGetPairedEventPriceQuery,
	useAnonRegisterUserToEventMutation,
	useAnonGetProfilesMainInfoQuery,
	useAnonGetProfileQuery,
	usePaymentCheckEventQuery,
	useGetPublicProfileAvatarsMutation,
	useSeoBlogsQuery,
	useSeoActiclesQuery,
	useSeoForumQuery,
	useSeoSectionQuery,
	util: {getRunningOperationPromises},
} = anonApi

// export endpoints for use in SSR
export const {
	anonGetEvent,
	anonGetEventsPrice,
	getPublicProfileAvatars,
	seoForum,
	seoBlogs,
	seoActicles,
	seoSection,
} = anonApi.endpoints
