import {createApi} from "@reduxjs/toolkit/query/react"
import {axiosBaseQuery} from "../config/axios"
import getConfig from "next/config"
import {HYDRATE} from "next-redux-wrapper"
import {ProfileAvatar} from "@/services/images.service"
import {Subscription} from "../slices/UserInfoSlice"
// import {clearObject} from "@/app/utils"
const {publicRuntimeConfig} = getConfig()

type AddFavoriteProps = {
	data: AddFavoriteData
}

type AddFavoriteData = {
	profile: string
}

type GetFavoritesProps = {
	page: number
	pageSize: number
}

export type GetFavoriteProfilesResponse = {
	count: number
	next: string
	next_url: string
	page_links: any[]
	previous: any
	previous_url: any
	results: FavoriteResultItem[]
}

export type FavoriteResultItem = {
	added: string
	id: number
	profile: FavoriteProfileItem
	user: string
}

export type FavoriteProfileItem = {
	about: string | null
	can_send_messages: boolean
	couple_nickname: string | null
	id: string
	is_online: boolean
	location: {
		[x: string]: any
	}
	man: {
		[x: string]: any
	}
	woman: {
		[x: string]: any
	}
	profile_type: string
	user_username: string
	verified: boolean
}

type IsFavoriteProfileProps = {
	profileId: string
}

export type IsFavoriteProfileResponse = {
	count: number
	next: any
	next_url: any
	page_links: any[]
	previous: any
	previous_url: any
	results: any[]
}

type RemoveFavoritesProps = {
	profileId: string
}

type GetFavoritesByProfilesIDsProps = {
	profiles_ids: string[]
}

export type FavoriteProfile = {
	added: string
	id: number
	profile: string
}

type RemoveImageProps = {
	imageId: number
}

type RemovePeekProps = {
	profileId: string
}

type GetUserProfilesProps = {
	query?: string
	page: number
	pageSize: number
}

export type GetUserProfilesResponse = {
	current_profile_id: string
	email: string
	first_name: string
	id: string
	is_online: boolean
	last_event_date?: string
	last_name: string
	last_online: string
	main_profile_id?: number
	phone?: string
	profiles: any[]
	register: number
	subscription_id: number
	subscription_type: string
	username: string
}

type UpdateImageProps = {
	imageId: number
	data: {
		profile: string
		file_name: string
		id: number
		is_hidden: boolean
		is_main: boolean
		url: string
	}
}

type GetRecentlyProps = {
	profileId: string
}

type GetPeekProps = {
	page: number
	pageSize: number
}

type GetBlockProfilesProps = {
	page: number
	pageSize: number
	blocking_profile: string
}

type ProfileIsBlockProps = {
	page: number
	pageSize: number
	profile_id: string
}

export type ProfileIsBlockResponse = {
	detail: boolean
}

type GetProfileDataProps = {
	profileId: string | string[] | undefined
}

export type GetProfileDataResponse = {
	profile_type: string
	woman: {
		age?: number
		[x: string]: any
	}
	man: {
		age?: number
		[x: string]: any
	}
	[x: string]: any
}

type GetInfoByUuidProps = {
	profiles_ids: string[]
	page?: number
	pageSize?: number
}

type GetInfoByUuidOptimisedProps = {
	profileId: string
}

export type GetInfoByUUIDResponse = {
	count: number
	next: any
	next_url: any
	page_links: string[]
	previous: any
	previous_url: any
	results: UserProfile[]
}

export type UserProfile = {
	about: string
	couple_nickname: string
	id: string
	is_online: boolean
	location: UserProfileLocation
	man: UserProfileSubProfile
	woman: UserProfileSubProfile
	profile_type: string
	user_username: string
	verified: boolean
	subscription: SubscriptionType
}

type UserProfileLocation = {
	id: number
	title: string
}

type SubscriptionType = {
	subscription_type: string
	subscription_date_to: string
}

type UserProfileSubProfile = {
	age: number
	birthday_day: number
	birthday_month: number
	body_hair?: number
	chest_size?: number
	body_structure: number
	height: number
	id: number
	most_impressive: number
	nickname: string
	sexual_orientation: number
	skin: number
	smoking: number
}

type DeleteProfileProps = {
	profileId: string | string[] | undefined
}

type GetProfilePercentageProps = {
	profileId: string | string[] | undefined
}

type ProfilePartialUpdateProps = {
	body: {
		about?: string
		nickname?: string
	}
}

type GetUsersProfilesProps = {
	page: number
	pageSize: number
	nickname?: string | null
	is_near_me?: boolean | null
	settlement?: string | null
	profile_type?: string | null
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
	is_online?: boolean | null
	last_online?: string | null
	verified?: boolean | null
	sort_by?: string | null
}

export type GetUsersProfilesResponse = {
	count: number
	next: string
	next_url: string
	page_links: any[]
	previous: any
	previous_url: any
	results: UserProfileFull[]
}

export type UserProfileFull = {
	about: string
	alcohol: number
	can_send_messages: string[]
	couple_nickname: string
	experience: number
	hosted: number
	id: string
	is_favorite: boolean
	is_online: boolean
	last_online: string
	location: any
	man: any
	nearest_settlement: any
	profile_type: string
	relation: number
	smoking_prefer: number
	user_username: string
	verified: boolean
	woman: any
	subscription: SubscriptionOnProfileAd
}

export type SubscriptionOnProfileAd = {
	subscription_date_to: string | null
	subscription_type: string
}

type BlockingProfileProps = {
	uuid: string
}

export type GetUserProfilesInfo = {
	current_profile_id: string
	email: string
	id: string
	phone: string
	profiles: UserProfilesInfoProfile[]
	subscription: Subscription
	username: string
	subscription_date_to: string
	trial: boolean
	freeze: boolean
	register: number
}

export type UserProfilesInfoProfile = {
	couple_nickname: string
	id: string
	profile_type: string
	man: UserProfilesInfoSubProfile
	woman: UserProfilesInfoSubProfile
}

type UserProfilesInfoSubProfile = {
	age: number
	id: number
	nickname: string
}

export type CanSendMessage = {
	can_send_messages: string[]
	id: string
}

type SetCanSendMessageProps = {
	profileTypesList: string[]
}

type GetRecentlyProfilesResponse = {
	count: number
	next: string
	next_url: string
	page_links: any[]
	previous: any
	previous_url: any
	results: RecentlyItem[]
}

export type RecentlyItem = {
	created: string
	id: number
	profile: UserProfile
}

type GetProfilesWithImagesProps = {
	profiles_ids: string[]
}

export type ProfilesWithImagesResponse = {
	images: ProfileAvatar[]
	profiles: UserProfile[]
}

export type SendLocationProps = {
	lat: number
	lon: number
}

export const usersApi = createApi({
	baseQuery: axiosBaseQuery({
		// baseURL: process.env.apiUrl as string
		baseURL: publicRuntimeConfig?.apiUrl as string,
	}),
	extractRehydrationInfo(action, {reducerPath}) {
		if (action.type === HYDRATE) {
			return action.payload[reducerPath]
		}
	},
	reducerPath: "users",
	tagTypes: [
		"UserList",
		"ProfileList",
		"Profile",
		"FavoriteProfile",
		"IsFavorite",
		"CurrentProfile",
		"ProfileProgress",
		"UserProfilesInfo",
		"CanSendMessage",
		"ProfileInfoByUUID",
	],
	endpoints: (build) => ({
		getUsers: build.query<any, any>({
			query: (arg) => {
				const {page, pageSize} = arg

				return {
					url: "api/profiles/user-info/",
					method: "get",
					params: {
						page: page,
						page_size: pageSize,
					},
				}
			},
			providesTags: [{type: "UserList", id: "list"}],
		}),
		getUserProfiles: build.query<
			GetUserProfilesResponse,
			GetUserProfilesProps
		>({
			query: (arg) => {
				const {query, page, pageSize} = arg

				return {
					url: "api/profiles/my-profiles/",
					method: "get",
					params: {
						search: query,
						page: page,
						page_size: pageSize,
					},
				}
			},
			providesTags: [{type: "ProfileList", id: "list"}],
		}),
		getUserCurrentProfileID: build.query<any, any>({
			query: (arg) => {
				return {
					url: `api/profiles/my-current-profile-id/`,
					method: "get",
				}
			},
		}),
		getProfileData: build.query<
			GetProfileDataResponse,
			GetProfileDataProps
		>({
			query: (arg) => {
				const {profileId} = arg

				return {
					url: `api/profiles/profile/${profileId}/`,
					method: "get",
				}
			},
			providesTags: ["Profile"],
		}),
		createEmptyProfile: build.mutation<any, any>({
			query: (arg) => {
				const {body} = arg

				return {
					url: "api/profiles/profile-stage/create/",
					method: "post",
					data: body,
				}
			},
			invalidatesTags: ["ProfileList", "Profile"],
		}),
		setCurrentProfile: build.mutation<any, any>({
			query: (arg) => {
				const {profileId} = arg

				return {
					url: `api/profiles/set-current/${profileId}/`,
					method: "get",
					data: {},
				}
			},
			invalidatesTags: ["CurrentProfile"],
		}),
		getUsersProfiles: build.query<any, GetUsersProfilesProps>({
			query: (arg) => {
				const {
					page,
					pageSize,
					is_near_me,
					settlement,
					profile_type,
					man_age,
					woman_age,
					man_height,
					woman_height,
					man_body_type,
					woman_body_type,
					man_sexual_orientation,
					woman_sexual_orientation,
					man_smoking_habits,
					woman_smoking_habits,
					is_online,
					last_online,
				} = arg

				const params = {
					page,
					pageSize,
					is_near_me,
					settlement,
					profile_type,
					man_age,
					woman_age,
					man_height,
					woman_height,
					man_body_type,
					woman_body_type,
					man_sexual_orientation,
					woman_sexual_orientation,
					man_smoking_habits,
					woman_smoking_habits,
					is_online,
					last_online,
				}

				return {
					url: `api/profiles/profile/`,
					method: "get",
					params: params,
				}
			},
			providesTags: [{type: "Profile", id: "list"}],
		}),
		getUsersProfilesMainInfo: build.query<
			GetUsersProfilesResponse,
			GetUsersProfilesProps
		>({
			query: (arg) => {
				const {
					page,
					pageSize,
					nickname,
					is_near_me,
					settlement,
					profile_type,
					man_age,
					woman_age,
					man_height,
					woman_height,
					man_body_type,
					woman_body_type,
					man_sexual_orientation,
					woman_sexual_orientation,
					man_smoking_habits,
					woman_smoking_habits,
					is_online,
					last_online,
					verified,
					sort_by,
				} = arg

				const params = {
					page,
					pageSize,
					nickname,
					is_near_me,
					settlement,
					profile_type,
					man_age,
					woman_age,
					man_height,
					woman_height,
					man_body_type,
					woman_body_type,
					man_sexual_orientation,
					woman_sexual_orientation,
					man_smoking_habits,
					woman_smoking_habits,
					is_online,
					last_online,
					verified,
					sort_by,
				}

				return {
					url: `api/profiles/main-info/`,
					method: "get",
					params: params,
				}
			},
			providesTags: [{type: "Profile", id: "list"}],
		}),
		getFavoriteProfiles: build.query<
			GetFavoriteProfilesResponse,
			GetFavoritesProps
		>({
			query: (arg) => {
				const {page, pageSize} = arg

				return {
					url: `api/profiles/user-activity/favorite/`,
					method: "get",
					params: {
						page: page,
						page_size: pageSize,
					},
				}
			},
			providesTags: [{type: "ProfileList", id: "list"}],
		}),
		getIsFavoriteProfile: build.query<
			IsFavoriteProfileResponse,
			IsFavoriteProfileProps
		>({
			query: (arg) => {
				const {profileId} = arg

				return {
					url: `api/profiles/user-activity/favorite/`,
					method: "get",
					params: {
						profile_id: profileId,
					},
				}
			},
			providesTags: [{type: "IsFavorite", id: "list"}],
		}),
		addToFavoriteProfile: build.mutation<any, AddFavoriteProps>({
			query: (arg) => {
				const {data} = arg

				return {
					method: "post",
					url: `api/profiles/user-activity/favorite/`,
					data: data,
				}
			},
			invalidatesTags: ["ProfileList"],
		}),
		RemoveFromFavoriteProfile: build.mutation<any, RemoveFavoritesProps>({
			query: (arg) => {
				const {profileId} = arg

				return {
					method: "delete",
					url: `api/profiles/user-activity/favorite/${profileId}/`,
				}
			},
			invalidatesTags: ["ProfileList"],
		}),
		RemoveFromFavoriteProfileByProfileId: build.mutation<
			any,
			RemoveFavoritesProps
		>({
			query: (arg) => {
				const {profileId} = arg

				return {
					method: "delete",
					url: `api/profiles/user-activity/favorite/delete-by-profile-id/${profileId}/`,
				}
			},
			invalidatesTags: ["ProfileList"],
		}),
		getFavoritesByProfilesIDs: build.mutation<
			FavoriteProfile[],
			GetFavoritesByProfilesIDsProps
		>({
			query: (arg) => {
				const {profiles_ids} = arg

				return {
					url: `api/profiles/user-activity/favorite/by-profiles-id/`,
					method: "post",
					data: {
						profiles_ids: profiles_ids,
					},
				}
			},
		}),
		getRecentlyProfiles: build.query<GetRecentlyProfilesResponse, any>({
			keepUnusedDataFor: 0,
			query: (arg) => {
				const {page, pageSize} = arg

				return {
					method: "get",
					url: `api/profiles/user-activity/recently-seen/`,
					params: {
						page: page,
						page_size: pageSize,
					},
				}
			},
			// providesTags: [{type: "ProfileList", id: "list"}],
		}),
		RemoveImageProfile: build.mutation<any, RemoveImageProps>({
			query: (arg) => {
				const {imageId} = arg

				return {
					method: "delete",
					url: `api/profiles/profile-image/${imageId}/`,
				}
			},
			invalidatesTags: ["ProfileList"],
		}),
		UpdateImageProfile: build.mutation<any, UpdateImageProps>({
			query: (arg) => {
				const {imageId, data} = arg

				return {
					method: "put",
					url: `api/profiles/profile-image/${imageId}/`,
					data: data,
				}
			},
			invalidatesTags: ["ProfileList"],
		}),
		updatePeekProfile: build.query<any, any>({
			query: (arg) => {
				return {
					method: "get",
					url: `api/profiles/user-activity/peek-at-me/update/`,
				}
			},
		}),
		getPeekProfiles: build.query<any, GetPeekProps>({
			query: (arg) => {
				const {page, pageSize} = arg

				return {
					url: `api/profiles/user-activity/peek-at-me/`,
					method: "get",
					params: {
						page: page,
						page_size: pageSize,
					},
				}
			},
			providesTags: ["ProfileList"],
		}),
		getPeekCount: build.query<any, any>({
			query: (arg) => {
				return {
					url: `api/profiles/user-activity/peek-at-me/count/`,
					method: "get",
				}
			},
			providesTags: ["ProfileList"],
		}),
		RemoveFromPeekProfile: build.mutation<any, RemovePeekProps>({
			query: (arg) => {
				const {profileId} = arg

				return {
					method: "delete",
					url: `api/profiles/user-activity/${profileId}/`,
				}
			},
			invalidatesTags: ["ProfileList"],
		}),
		getInfoByUuid: build.mutation<
			GetInfoByUUIDResponse,
			GetInfoByUuidProps
		>({
			query: (arg) => {
				const {profiles_ids, page, pageSize} = arg

				const data = {
					profiles_ids: profiles_ids,
				}

				if (page) {
					Object.assign(data, {page: page})
				}

				if (pageSize) {
					Object.assign(data, {page_size: pageSize})
				}

				return {
					method: "post",
					url: `public/profiles-by-uuid/`,
					data: data,
				}
			},
		}),
		getInfoByUuidOptimised: build.query<
			UserProfile,
			GetInfoByUuidOptimisedProps
		>({
			query: (arg) => {
				const {profileId} = arg

				return {
					url: `public/profile-by-uuid/${profileId}/`,
					method: "get",
				}
			},
			providesTags: ["ProfileInfoByUUID"],
		}),
		deleteProfile: build.mutation<any, DeleteProfileProps>({
			query: (arg) => {
				const {profileId} = arg

				return {
					url: `api/profiles/profile/${profileId}/`,
					method: "delete",
				}
			},
			invalidatesTags: ["ProfileList"],
		}),
		profilePartialUpdate: build.mutation<any, ProfilePartialUpdateProps>({
			query: (arg) => {
				const {body} = arg

				return {
					url: `api/profiles/partial-update/`,
					method: "put",
					data: body,
				}
			},
			invalidatesTags: ["ProfileList", "Profile", "ProfileProgress"],
		}),
		getProfilePercentage: build.query<any, GetProfilePercentageProps>({
			query: (arg) => {
				const {profileId} = arg

				return {
					url: `api/profiles/percentage-filled/${profileId}/`,
					method: "get",
				}
			},
			providesTags: ["ProfileProgress"],
		}),
		getBlockProfiles: build.query<any, GetBlockProfilesProps>({
			query: (arg) => {
				const {page, pageSize, blocking_profile} = arg

				return {
					url: "api/profiles/report/blocking/",
					method: "get",
					params: {
						page: page,
						page_size: pageSize,
						blocking_profile: blocking_profile,
					},
				}
			},
		}),
		blockingProfile: build.mutation<any, BlockingProfileProps>({
			query: (arg) => {
				const {uuid} = arg

				return {
					url: "api/profiles/report/blocking/",
					method: "post",
					data: {
						blocking_profile: uuid,
					},
				}
			},
		}),
		unBlockingProfile: build.mutation<any, BlockingProfileProps>({
			query: (arg) => {
				const {uuid} = arg

				return {
					url: `api/profiles/report/blocking/${uuid}`,
					method: "delete",
				}
			},
		}),
		profileIsBlock: build.query<any, ProfileIsBlockProps>({
			query: (arg) => {
				const {page, pageSize, profile_id} = arg

				return {
					url: `api/profiles/report/is-profile-blocked/${profile_id}/`,
					method: "get",
					params: {
						page: page,
						page_size: pageSize,
					},
				}
			},
		}),
		getUserProfilesInfo: build.query<GetUserProfilesInfo, any>({
			query: (arg) => {
				return {
					url: `api/profiles/user-profiles-info/`,
					method: "get",
					// params: {}
				}
			},
			providesTags: [{type: "UserProfilesInfo", id: "list"}],
		}),
		getCanSendMessage: build.query<CanSendMessage, any>({
			query: (arg) => {
				return {
					url: `api/profiles/can-send-message/`,
					method: "get",
				}
			}, 
			providesTags: ["CanSendMessage"],
		}),
		setCanSendMessage: build.mutation<any, SetCanSendMessageProps>({
			query: (arg) => {
				const {profileTypesList} = arg

				return {
					url: `api/profiles/can-send-message/update/`,
					method: "put",
					data: {
						can_send_messages: profileTypesList,
					},
				}
			},
			// invalidatesTags: ['CanSendMessage']
		}),
		getCanRecieveNotify: build.query<CanSendMessage, any>({
			query: (arg) => {
				return {
					url: `api/events/mailing/notification-management`,
					method: "get",
				}
			},
			providesTags: ["CanSendMessage"],
		}),
		setCanRecieveNotify: build.mutation<any, SetCanSendMessageProps>({
			query: (arg) => {
				const {profileTypesList} = arg

				return {
					url: `api/events/mailing/notification-management`,
					method: "post",
					data: profileTypesList,
				}
			},
			// invalidatesTags: ['CanSendMessage']
		}),
		getProfilesWithImages: build.mutation<
			ProfilesWithImagesResponse,
			GetProfilesWithImagesProps
		>({
			query: (arg) => {
				const {profiles_ids} = arg

				return {
					url: `api/profiles/profile-with-images/`,
					method: "post",
					data: {
						profiles_ids: profiles_ids,
					},
				}
			},
		}),
		sendLocation: build.mutation<any, SendLocationProps>({
			query: ({lat, lon}) => {
				return {
					url: "api/profiles/partial-update/",
					method: "put",
					data: {
						lat,
						lon,
					},
				}
			},
		}),
	}),
})

export const {
	useGetUsersQuery,
	useGetUserProfilesQuery,
	useLazyGetUserProfilesQuery,
	useGetProfileDataQuery,
	useLazyGetProfileDataQuery,
	useCreateEmptyProfileMutation,
	useGetUsersProfilesQuery,
	useGetUserCurrentProfileIDQuery,
	useGetUsersProfilesMainInfoQuery,
	useLazyGetUsersProfilesMainInfoQuery,
	useGetFavoriteProfilesQuery,
	useLazyGetFavoriteProfilesQuery,
	useGetIsFavoriteProfileQuery,
	useLazyGetIsFavoriteProfileQuery,
	useAddToFavoriteProfileMutation,
	useRemoveFromFavoriteProfileMutation,
	useRemoveFromFavoriteProfileByProfileIdMutation,
	useGetFavoritesByProfilesIDsMutation,
	useGetRecentlyProfilesQuery,
	useLazyGetRecentlyProfilesQuery,
	useRemoveImageProfileMutation,
	useSetCurrentProfileMutation,
	useUpdateImageProfileMutation,
	useUpdatePeekProfileQuery,
	useLazyUpdatePeekProfileQuery,
	useGetPeekProfilesQuery,
	useLazyGetPeekProfilesQuery,
	useGetPeekCountQuery,
	useLazyGetPeekCountQuery,
	useRemoveFromPeekProfileMutation,
	useGetInfoByUuidMutation,
	useGetInfoByUuidOptimisedQuery,
	useLazyGetInfoByUuidOptimisedQuery,
	useDeleteProfileMutation,
	useProfilePartialUpdateMutation,
	useGetProfilePercentageQuery,
	useLazyGetProfilePercentageQuery,
	useGetBlockProfilesQuery,
	useLazyGetBlockProfilesQuery,
	useBlockingProfileMutation,
	useUnBlockingProfileMutation,
	useProfileIsBlockQuery,
	useLazyProfileIsBlockQuery,
	useGetUserProfilesInfoQuery,
	useLazyGetUserProfilesInfoQuery,
	useGetCanSendMessageQuery,
	useLazyGetCanSendMessageQuery,
	useLazyGetCanRecieveNotifyQuery,
	useSetCanSendMessageMutation,
	useSetCanRecieveNotifyMutation,
	useGetProfilesWithImagesMutation,
	useSendLocationMutation,
} = usersApi

export const {getInfoByUuid} = usersApi.endpoints
