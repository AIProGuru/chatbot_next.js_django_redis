import {createApi} from "@reduxjs/toolkit/query/react"
import {axiosBaseQuery} from "@/redux/config/axios"
import getConfig from "next/config"
const {publicRuntimeConfig} = getConfig()

type ImageProps = {
	type: "MAIN" | "PRIVATE" | "AVATAR" | "VALIDATION"
	s3_url: string
	s3_bucket_path: string
}

type AddImageProps = {
	profileId: string
	body: ImageProps[]
}

type GetProfileImagesProps = {
	myProfileId: string
	profileId: string
}

type RequestPrivateImagesProps = {
	myProfileId: string
	profileId: string
}

type GetProfileAvatarsProps = {
	profileIds: string[]
}

export type ProfileAvatar = {
	id: string
	last_modified_date: string
	moderated: boolean
	moderation_results: any
	name: any
	profile_id: string
	s3_bucket: any
	s3_bucket_path: string
	s3_url: string
	status: string
	type: string
	upload_date: string
	verdict: string
}

type GetRequestsProfileProps = {
	myProfileId: string
}

type DeleteImageProps = {
	imageId: string
	profileId: string
}

type ChangeStatusRequestProps = {
	requestId: string
	status: "APPROVED" | "DISAPPROVED"
}

export const imageApi = createApi({
	baseQuery: axiosBaseQuery({
		baseURL: publicRuntimeConfig?.apiUrl as string,
	}),
	reducerPath: "image",
	tagTypes: ["ProfileImages", "ProfileAvatars"],
	endpoints: (build) => ({
		addProfileImage: build.mutation<any, AddImageProps>({
			query: (arg) => {
				const {profileId, body} = arg

				return {
					url: `api/images/${profileId}`,
					method: "post",
					data: body,
				}
			},
		}),
		getProfileImages: build.mutation<any, GetProfileImagesProps>({
			query: (arg) => {
				const {myProfileId, profileId} = arg

				return {
					url: `api/images/profile/images_list`,
					method: "post",
					data: {
						profile_id: myProfileId,
						requesting_profile_id: profileId,
					},
				}
			},
		}),
		getProfileAvatars: build.mutation<
			ProfileAvatar[],
			GetProfileAvatarsProps
		>({
			query: (arg) => {
				const {profileIds} = arg

				return {
					url: `api/images/avatars/images_list`,
					method: "post",
					data: {
						profile_ids: profileIds,
					},
				}
			},
		}),
		getProfileAvatarsOptimised: build.query<ProfileAvatar, any>({
			query: (arg) => {
				const {profileId} = arg

				return {
					url: `api/images/avatars/${profileId}`,
					method: "get",
				}
			},
			providesTags: ["ProfileAvatars"],
		}),
		requestPrivateImagesProfile: build.mutation<
			any,
			RequestPrivateImagesProps
		>({
			query: (arg) => {
				const {myProfileId, profileId} = arg

				return {
					url: `api/images/request`,
					method: "post",
					data: {
						days_to_expiration: 1,
						profile_id: myProfileId,
						requesting_profile_id: profileId,
					},
				}
			},
		}),
		approveRequestProfile: build.mutation<any, RequestPrivateImagesProps>({
			query: (arg) => {
				const {myProfileId, profileId} = arg

				return {
					url: `api/images/request/profile/approve_request`,
					method: "post",
					data: {
						days_to_expiration: 1,
						profile_id: myProfileId,
						requesting_profile_id: profileId,
					},
				}
			},
		}),
		getRequestsProfile: build.query<any, any>({
			query: (arg) => {
				const {} = arg

				return {
					url: `api/images/request`,
					method: "get",
				}
			},
		}),
		deleteImage: build.mutation<any, DeleteImageProps>({
			query: (arg) => {
				const {imageId, profileId} = arg

				return {
					url: `api/images/image/delete`,
					method: "delete",
					data: {
						image_id: imageId,
						profile_id: profileId,
					},
				}
			},
		}),
		changeStatusRequest: build.mutation<any, ChangeStatusRequestProps>({
			query: (arg) => {
				const {requestId, status} = arg

				return {
					url: `api/images/request`,
					method: "put",
					data: {
						request_id: requestId,
						status: status,
					},
				}
			},
		}),
		// ask private photos
		askPrivatePhotosStatus: build.mutation<any, any>({
			query: (arg) => {
				const {profile_id, requesting_profile_id} = arg

				return {
					url: `api/images/request/validate`,
					method: "post",
					data: {
						profile_id: profile_id,
						requesting_profile_id: requesting_profile_id,
					},
				}
			},
		}),
		// send private photos
		sendPrivatePhotosStatus: build.mutation<any, any>({
			query: (arg) => {
				const {profile_id, requesting_profile_id} = arg

				return {
					url: `api/images/request/profile/validate-approve-request`,
					method: "post",
					data: {
						profile_id: profile_id,
						requesting_profile_id: requesting_profile_id,
					},
				}
			},
		}),
		changeTypeImages: build.mutation<any, any>({
			query: (arg) => {
				const {imageId, profileId, newType} = arg

				return {
					url: `api/images/image/update`,
					method: "put",
					data: {
						id: imageId,
						profile_id: profileId,
						type: newType
					},
				}
			},
		}),
	}),
})

export const {
	useAddProfileImageMutation,
	useGetProfileImagesMutation,
	useGetProfileAvatarsMutation,
	useGetProfileAvatarsOptimisedQuery,
	useLazyGetProfileAvatarsOptimisedQuery,
	useRequestPrivateImagesProfileMutation,
	useGetRequestsProfileQuery,
	useApproveRequestProfileMutation,
	useLazyGetRequestsProfileQuery,
	useDeleteImageMutation,
	useChangeStatusRequestMutation,
	useAskPrivatePhotosStatusMutation,
	useSendPrivatePhotosStatusMutation,
	useChangeTypeImagesMutation,
} = imageApi
