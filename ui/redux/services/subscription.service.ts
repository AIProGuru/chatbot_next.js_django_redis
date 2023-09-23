import {createApi} from "@reduxjs/toolkit/query/react"
import {axiosBaseQuery} from "@/redux/config/axios"
import getConfig from "next/config"
import {clearObject} from "@/app/utils"
const {publicRuntimeConfig} = getConfig()

type SubscriptionsResponse = {
	total: number
	page: number
	size: number
	items: Subscription[]
}

export type SubPrices = {
	id: string
	is_active: boolean
	price: number
	step: number
	subscription_id: string
	time_cycle: string
	time_duration: number
	cycle_description: string
}

export type Subscription = {
	button_label: string
	description: string
	id: string
	is_active: boolean
	prices: SubPrices[]
	title: string
	type: string
	type_description: string
}

export const subscriptionApi = createApi({
	baseQuery: axiosBaseQuery({
		baseURL: publicRuntimeConfig?.apiUrl as string,
	}),
	reducerPath: "subscription",
	tagTypes: [],
	endpoints: (build) => ({
		getSubscriptions: build.query<SubscriptionsResponse, any>({
			query: (arg) => {
				return {
					url: `api/subscription/`,
					method: "get",
				}
			},
		}),
	}),
})

export const {useGetSubscriptionsQuery, useLazyGetSubscriptionsQuery} =
	subscriptionApi
