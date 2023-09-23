import {createApi} from "@reduxjs/toolkit/query/react"
import {axiosBaseQuery} from "@/redux/config/axios"
import getConfig from "next/config"
const {publicRuntimeConfig} = getConfig()

type GetProfileRecommendationsProps = {
	profileId: string | string[] | undefined
}

type GetProfileRecommendationsResponse = {
	[x: string]: any
}

type UpdateRecommendationProps = {
	data: {
		id: string
		profile_id: string
		status: string
	}
}

type CreateRecommendationProps = {
	data: {
		profile_id: string
		recommending_profile_id: string
		recommendation: string
	}
}

type GetAwaitingProfileRecommendationsProps = {
	profileId: string | string[] | undefined
}

export type Recommendation = {
	created_time: string
	id: string
	last_modified_time: string
	profile_id: string
	recommendation: string
	recommending_profile_id: string
	status: string
}

export const recommendationsApi = createApi({
	baseQuery: axiosBaseQuery({
		baseURL: publicRuntimeConfig?.apiUrl as string,
	}),
	reducerPath: "recommendations",
	tagTypes: ["AwaitingRecommendations"],
	endpoints: (build) => ({
		getProfileRecommendations: build.query<
			GetProfileRecommendationsResponse[],
			GetProfileRecommendationsProps
		>({
			query: (arg) => {
				const {profileId} = arg

				return {
					url: `api/recommendation/${profileId}`,
					method: "get",
				}
			},
		}),
		updateRecommendation: build.mutation<any, UpdateRecommendationProps>({
			query: (arg) => {
				const {data} = arg

				return {
					url: `api/recommendation/update`,
					method: "put",
					data: data,
				}
			},
			invalidatesTags: ["AwaitingRecommendations"],
		}),
		createRecommendation: build.mutation<any, CreateRecommendationProps>({
			query: (arg) => {
				const {data} = arg

				return {
					url: `api/recommendation/create`,
					method: "post",
					data: data,
				}
			},
		}),
		getAwaitingProfileRecommendations: build.query<
			Recommendation[],
			GetAwaitingProfileRecommendationsProps
		>({
			query: (arg) => {
				const {profileId} = arg

				return {
					url: `api/recommendation/profile_recommendations/${profileId}`,
					method: "get",
				}
			},
			providesTags: ["AwaitingRecommendations"],
		}),
	}),
})

export const {
	useGetProfileRecommendationsQuery,
	useLazyGetProfileRecommendationsQuery,
	useUpdateRecommendationMutation,
	useCreateRecommendationMutation,
	useGetAwaitingProfileRecommendationsQuery,
	useLazyGetAwaitingProfileRecommendationsQuery,
} = recommendationsApi
