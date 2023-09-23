import {createApi} from "@reduxjs/toolkit/query/react"
import {axiosBaseQuery} from "@/redux/config/axios"
import getConfig from "next/config"
const {publicRuntimeConfig} = getConfig()

type PaymentProps = {
	id: string
	type: "event" | "subscription"
}

type PaymentSubProps = {
	id: string
}

type UserSubWithPrice = {
		username: string
		subscription_type: string
		date_to: string
		sent_to_user_store: false
		id: number
		payment: {
			subscription_price_id: string
			checkout_data: SubSelfPrices
		}
}

export type SubSelfPrices = {
	id: string
	is_active: boolean
	price: number
	step: number
	subscription: Subscription
	time_cycle: string
	time_duration: number
}

export type Subscription = {
	description: string
	title: string
	type: string
}

export const paymentApi = createApi({
	baseQuery: axiosBaseQuery({
		baseURL: publicRuntimeConfig?.apiUrl as string,
	}),
	reducerPath: "payment",
	endpoints: (build) => ({
		getUrlPayment: build.mutation<any, PaymentProps>({
			query: (arg) => {
				const {id, type} = arg

				return {
					url: `public/payments/get_payment_url/`,
					method: "post",
					data: {
						id: id,
						type: type,
					},
				}
			},
		}),
		getUrlSubPayment: build.mutation<any, PaymentSubProps>({
			query: (arg) => {
				const {id} = arg

				return {
					url: `api/payment/recurring_payment/get_payment_url/`,
					method: "post",
					data: {
						subscription_id: id,
					},
				}
			},
		}),
		getUserSubscription: build.query<UserSubWithPrice, any>({
			query: (arg) => {
				return {
					url: `api/payment/paid_subscription/`,
					method: "get",
				}
			},
		}),
	}),
})

export const {
	useGetUrlPaymentMutation,
	useGetUrlSubPaymentMutation,
	useGetUserSubscriptionQuery,
	useLazyGetUserSubscriptionQuery,
} = paymentApi
