import {createApi} from "@reduxjs/toolkit/query/react"
import {axiosBaseQuery} from "@/redux/config/axios"
import getConfig from "next/config"
const {publicRuntimeConfig} = getConfig()


type TCGetUnreadCountResponse = {
	unread_room_count: number
}

export const chatApi = createApi({
	baseQuery: axiosBaseQuery({
		// baseURL: process.env.apiUrl as string,
		baseURL: publicRuntimeConfig?.apiUrl as string,
	}),
	reducerPath: "chat",
	tagTypes: [],
	endpoints: (build) => ({
		getTryChatUnreadCount: build.query<TCGetUnreadCountResponse, any>({
			query: (arg) => {
				const {} = arg

				return {
					url: `api/chat/get_unread_count`,
					method: "get",
				}
			},
		}),
	}),
})

export const {
	useGetTryChatUnreadCountQuery,
	useLazyGetTryChatUnreadCountQuery,
} = chatApi
