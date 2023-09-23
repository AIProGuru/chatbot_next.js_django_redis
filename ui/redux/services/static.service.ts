import {createApi} from "@reduxjs/toolkit/query/react"
import {axiosBaseQuery} from "@/redux/config/axios"
import getConfig from "next/config"
import {HYDRATE} from "next-redux-wrapper"
const {publicRuntimeConfig} = getConfig()

export type BodyStructuresResponse = {
	id: number
	title: string
}

export type SmokingTypesResponse = {
	id: number
	title: string
}

export type SexualOrientationsResponse = {
	id: number
	title: string
	profile_type: string
}

export type SettlementsResponse = {
	count: number
	next: any
	next_url: any
	page_links: any[]
	previous: any
	previous_url: any
	results: Settlement[]
}

export type Settlement = {
	id: number
	title: string
}

export type RegionsResponse = {
	count: number
	next: any
	next_url: any
	page_links: any[]
	previous: any
	previous_url: any
	results: Region[]
}
export type AreasResponse = {
	count: number
	next: any
	next_url: any
	page_links: any[]
	previous: any
	previous_url: any
	results: Area[]
}

export type Region = {
	id: number
	settlement_id: number
	title: string
}

export type Language = {
	code: string
	id: number
	title: string
}

export type Area = {
	id: number
	title: string
}

type RegionsParams = {
	search: string
	settlement_id: number
	page: number
	page_size: number
}

export const staticApi = createApi({
	baseQuery: axiosBaseQuery({
		baseURL: publicRuntimeConfig?.apiUrl as string,
	}),
	reducerPath: "staticApi",
	keepUnusedDataFor: 900,
	tagTypes: [
		"BodyStructures",
		"Settlements",
		"SexualOrientations",
		"Languages",
		"Regions",
		"Areas",
	],
	extractRehydrationInfo(action, {reducerPath}) {
		if (action.type === HYDRATE) {
			return action.payload[reducerPath]
		}
	},
	endpoints: (build) => ({
		getBodyStructures: build.query<BodyStructuresResponse, any>({
			query: () => {
				return {
					method: "get",
					url: `api/profiles/body-structure/`,
				}
			},
			providesTags: ["BodyStructures"],
		}),
		getSmokingTypes: build.query<BodyStructuresResponse, any>({
			query: () => {
				return {
					method: "get",
					url: `api/profiles/type-smoking/`,
				}
			},
		}),
		getSettlements: build.query<SettlementsResponse, any>({
			query: () => {
				return {
					method: "get",
					url: `api/profiles/settlement/`,
				}
			},
			providesTags: ["Settlements"],
		}),
		getSexualOrientations: build.query<SexualOrientationsResponse, any>({
			query: () => {
				return {
					method: "get",
					url: `api/profiles/sexual-orientation/`,
				}
			},
			providesTags: ["SexualOrientations"],
		}),
		getLanguages: build.query<Language[], any>({
			query: () => {
				return {
					method: "get",
					url: `api/profiles/language/`,
				}
			},
			providesTags: ["Languages"],
		}),
		getRegions: build.query<RegionsResponse, RegionsParams>({
			query: (arg) => {
				const {search, settlement_id, page, page_size} = arg
				return {
					method: "get",
					url: `api/profiles/location/`, //?search=${query}&page_size=${pageSize}&page=${page}
					params: {
						search: search,
						settlement_id: settlement_id,
						page: page,
						page_size: page_size,
					},
				}
			},
			providesTags: ["Regions"],
		}),
		getAreas: build.query<AreasResponse, any>({
			query: () => {
				return {
					method: "get",
					url: `api/profiles/settlement/`,
				}
			},
			providesTags: ["Areas"],
		}),
	}),
})

export const {
	useGetBodyStructuresQuery,
	useLazyGetBodyStructuresQuery,
	useLazyGetSmokingTypesQuery,
	useGetSettlementsQuery,
	useLazyGetSettlementsQuery,
	useGetSexualOrientationsQuery,
	useLazyGetSexualOrientationsQuery,
	useGetLanguagesQuery,
	useLazyGetLanguagesQuery,
	useGetRegionsQuery,
	useLazyGetRegionsQuery,
	useGetAreasQuery,
	useLazyGetAreasQuery,
} = staticApi
