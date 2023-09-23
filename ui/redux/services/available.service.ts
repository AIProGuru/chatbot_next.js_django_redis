import {createApi} from "@reduxjs/toolkit/query/react"
import {axiosBaseQuery} from "@/redux/config/axios"
import getConfig from "next/config"
const {publicRuntimeConfig} = getConfig()

export type CreateAvailableProps = {
	title: AvailableTitle[]
	description: string
	daysToExpiration: number
}

export enum AvailableTitle {
	drinks = "DRINKS",
	knowEachOther = "KNOW_EACH_OTHER",
	touchOnly = "TOUCH_ONLY",
	fullSex = "FULL_SEX",
}

type AvailableTodayResponse = {
	count: number
	near_me: number
	next: any
	previous: any
	results: AvailableProfiles[]
}

export type AvailableProfiles = {
	created: string
	description: string
	expiration_date: string
	id: number
	last_popup_time: number
	profile: AvailableProfile
	title: AvailableTitle[]
}

type AvatarImage = {
	id: string
	profile_id: string
	s3_url: string
	type: string
}

export type AvailableProfile = {
	about: string
	couple_nickname: string
	id: string
	is_online: boolean
	location: {
		id: number
		settlement_id: number
		title: string
	}
	profile_type: string
	verified: boolean
	man: AvailableProfileDetails
	woman: AvailableProfileDetails
	avatar_image: AvatarImage
	subscription: Subscription 
}

type Subscription = {
	subscription_date_to: string
	subscription_type: string
}

type AvailableProfileDetails = {
	age: number
	id: number
	nickname: string
}

export type ChangeAvailableTodayProps = {
	availableId: number
	isEdit?: boolean
	isPopup?: boolean
	title?: string[]
	description?: string
	popup?: boolean
	status: string
}

type AvailableTodayProps = {
	page: number
	pageSize: number
	nickname?: string | null
	is_near_me?: boolean | null
	settlement?: string | null
	profile_type?: string | null
	is_online?: boolean | null
	title?: string | null
	verified?: boolean | null
	hosted?: string | null
}

type SelfAvailableTodayProps = {
	profileId: string
}

export type SelfAvailable = {
	available: {
		created: string
		description: string
		expiration_date: string
		id: number
		last_popup_time: number
		profile: string
		title: AvailableTitle[]
		status: string
	}
	available_block_time: number
}

export type ProfileAvailable = {
	created: string
	description: string
	expiration_date: string
	id: number
	last_popup_time: number
	profile: string
	title: AvailableTitle[]
}

type DeleteAvailableTodayProps = {
	availableId: number
}

type ProfileAvailableProps = {
	profile_id: string
}

export const availableApi = createApi({
	baseQuery: axiosBaseQuery({
		baseURL: publicRuntimeConfig?.apiUrl as string,
	}),
	reducerPath: "availableToday",
	endpoints: (build) => ({
		createAvailable: build.mutation<any, CreateAvailableProps>({
			query: (arg) => {
				const {title, description, daysToExpiration} = arg

				return {
					url: `api/profiles/available-today/`,
					method: "post",
					data: {
						title: title,
						description: description,
						days_to_expiration: daysToExpiration,
					},
				}
			},
		}),
		getAvailableToday: build.query<
			AvailableTodayResponse,
			AvailableTodayProps
		>({
			query: (arg) => {
				const {
					page,
					pageSize,
					nickname,
					is_near_me,
					settlement,
					profile_type,
					title,
					is_online,
					verified,
					hosted,
				} = arg

				return {
					url: `api/profiles/available-today/`,
					method: "get",
					params: {
						page: page,
						page_size: pageSize,
						nickname: nickname,
						is_near_me: is_near_me,
						settlement: settlement,
						profile_type: profile_type,
						title: title,
						is_online: is_online,
						verified: verified,
						hosted: hosted,
					},
				}
			},
		}),
		getSelfAvailableToday: build.query<SelfAvailable, any>({
			query: (arg) => {
				return {
					url: `api/profiles/available-today/current/`,
					method: "get",
				}
			},
		}),
		getProfileAvailableToday: build.query<
			ProfileAvailable,
			ProfileAvailableProps
		>({
			query: (arg) => {
				const {profile_id} = arg
				return {
					url: `api/profiles/available-today/profile/${profile_id}/`,
					method: "get",
				}
			},
		}),
		changeAvailableToday: build.mutation<any, ChangeAvailableTodayProps>({
			query: (arg) => {
				const {
					isEdit,
					isPopup,
					availableId,
					title,
					description,
					popup,
					status,
				} = arg

				const data = {}

				if (isEdit) {
					Object.assign(data, {
						title: title,
						description: description,
						popup: popup,
						status: status,
					})
				}

				if (isPopup) {
					Object.assign(data, {
						popup: popup,
					})
				}

				return {
					url: `api/profiles/available-today/${availableId}/`,
					method: "put",
					data: data,
				}
			},
		}),
		deleteAvailableToday: build.mutation<any, DeleteAvailableTodayProps>({
			query: (arg) => {
				const {availableId} = arg

				return {
					url: `api/profiles/available-today/${availableId}/`,
					method: "delete",
				}
			},
		}),
	}),
})

export const {
	useCreateAvailableMutation,
	useGetAvailableTodayQuery,
	useLazyGetAvailableTodayQuery,
	useGetSelfAvailableTodayQuery,
	useLazyGetSelfAvailableTodayQuery,
	useGetProfileAvailableTodayQuery,
	useLazyGetProfileAvailableTodayQuery,
	useChangeAvailableTodayMutation,
	useDeleteAvailableTodayMutation,
} = availableApi
