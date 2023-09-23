import {createApi} from "@reduxjs/toolkit/query/react"
import {GetEventsResponse} from "@/components/@types/Api/Events/GetEventsResponse"
import {GetEventsParams} from "@/components/@types/Api/Events/GetEventsParams"
import {axiosBaseQuery} from "../config/axios"
import getConfig from "next/config"
const {publicRuntimeConfig} = getConfig()

function convertDate(date: string) {
	return new Date(date).toLocaleString()
}

export const eventsApi = createApi({
	baseQuery: axiosBaseQuery({
		// baseURL: process.env.apiUrl as string
		baseURL: publicRuntimeConfig?.apiUrl as string,
	}),
	reducerPath: "events",
	tagTypes: [
		"Event",
		"EventList",
		"EventUsers",
		"EventSearchUsers",
		"EventImages",
		"Message",
		"MessageList",
		"MessageTypes",
		"MessageServiceTypes",
		"MessageRelatedFields",
	],
	endpoints: (build) => ({
		/**
		 * @param {page: number, pageSize: number} arg
		 */
		getEvents: build.query<GetEventsResponse, GetEventsParams>({
			query: (arg) => {
				const {page, pageSize} = arg

				return {
					url: "api/events/",
					method: "get",
					params: {page: page, page_size: pageSize},
				}
			},
			// transformResponse: (response: GetEventsResponse) => {
			// 	response.results = response.results.map((event) => ({
			// 		...event,
			// 		date: convertDate(event.date),
			// 		created_at: convertDate(event.created_at)
			// 	}))
			//
			// 	return response
			// },
			providesTags: (data) =>
				data
					? [
							...data.results.map((event: any) => ({
								type: "EventList" as const,
								id: event.id,
							})),
							{type: "EventList", id: "list"},
					  ]
					: [{type: "EventList", id: "list"}],
		}),
		// todo: need @types here
		getEvent: build.query<any, any>({
			query: (arg) => {
				const {eventId} = arg
				return {
					url: `api/events/${eventId}/`,
					method: "get",
				}
			},
			// transformResponse: (response: any) => {
			// 	if (response) {
			// 		response.date = convertDate(response.date)
			// 		response.created_at = convertDate(response.created_at)
			// 	}
			// 	return response
			// },
			providesTags: [{type: "Event", id: "list"}],
		}),
		// todo: need @types here
		getEventUsers: build.query<any, any>({
			query: (arg) => {
				const {eventId, page, pageSize, query} = arg
				return {
					url: `api/events/event-users/${eventId}/`,
					method: "get",
					params: {
						search: query,
						page: page,
						page_size: pageSize,
					},
				}
			},
			providesTags: [{type: "EventUsers", id: "list"}],
		}),
		// todo: need @types here
		searchUser: build.query<any, any>({
			query: (arg) => {
				const {query, page, pageSize} = arg

				return {
					url: `api/profiles/user-info/`,
					method: "get",
					params: {
						search: query || "",
						page: page,
						page_size: pageSize,
						// include_profiles: true
					},
				}
			},
			providesTags: [{type: "EventSearchUsers", id: "list"}],
		}),
		createEvent: build.mutation({
			query: (body) => ({url: "api/events/", method: "post", data: body}),
			invalidatesTags: ["Event"],
		}),
		deleteEvent: build.mutation<any, any>({
			query: (arg) => {
				const {eventId} = arg

				return {
					url: `api/events/${eventId}/`,
					method: "delete",
				}
			},
			invalidatesTags: ["EventList"],
		}),
		getMessages: build.query<any, any>({
			query: (arg) => {
				const {service, page, pageSize} = arg
				return {
					url: "api/events/message/",
					method: "get",
					params: {
						message_type: service,
						page: page,
						page_size: pageSize,
					},
				}
			},
			transformResponse: (response: any) => {
				response.results = response.results.map((message: any) => ({
					...message,
					real_send_date: convertDate(message.real_send_date),
				}))

				return response
			},
			providesTags: [{type: "MessageList", id: "list"}],
		}),
		getMessageServiceTypes: build.query<any, any>({
			query: (arg) => {
				return {
					url: "api/events/event-type/",
					method: "get",
				}
			},
			providesTags: [{type: "MessageServiceTypes", id: "list"}],
		}),
		getMessageTypes: build.query<any, any>({
			query: (arg) => {
				return {
					url: "api/events/event-message-type/",
					method: "get",
				}
			},
			providesTags: [{type: "MessageTypes", id: "list"}],
		}),
		addMessagesToEvent: build.mutation<any, any>({
			query: (arg) => {
				const {eventId, body} = arg

				return {
					url: `api/events/add-message-to-event/${eventId}/`,
					method: "post",
					data: body,
				}
			},
		}),
		addUserToEvent: build.mutation<any, any>({
			query: (arg) => {
				const {eventId, body} = arg

				return {
					url: `api/events/registration-user-event/${eventId}/`,
					method: "post",
					data: body,
				}
			},
		}),
		addImageToEvent: build.mutation<any, any>({
			query: (arg) => {
				const {eventId, imageType, fileName, url} = arg

				return {
					url: `api/events/image/`,
					method: "post",
					data: {
						image_type: imageType,
						file_name: fileName,
						url: url,
						event: eventId,
					},
				}
			},
		}),
		getEventImages: build.query<any, any>({
			query: (arg) => {
				const {eventId} = arg

				return {
					url: `api/events/event-image/${eventId}/`,
					method: "get",
				}
			},
			providesTags: [{type: "EventImages", id: "list"}],
		}),
		createMessage: build.mutation<any, any>({
			query: (arg) => {
				const {body} = arg

				return {
					url: `api/events/message/`,
					method: "post",
					data: body,
				}
			},
			invalidatesTags: ["MessageList"],
		}),
		getMessageRelatedFields: build.query<any, any>({
			query: (arg) => {
				const {page, pageSize, messageType} = arg

				return {
					url: "api/events/message/related_fields/",
					method: "get",
					params: {
						page: page,
						page_size: pageSize,
						message_type: messageType,
					},
				}
			},
			providesTags: [{type: "MessageRelatedFields", id: "list"}],
		}),
		getMessage: build.query<any, any>({
			query: (arg) => {
				const {id} = arg

				return {
					url: `api/events/message/${id}/`,
					method: "get",
				}
			},
			providesTags: [{type: "Message", id: "list"}],
		}),
		editMessage: build.mutation<any, any>({
			query: (arg) => {
				const {id, body} = arg

				return {
					url: `api/events/message/${id}/`,
					method: "put",
					data: body,
				}
			},
			invalidatesTags: ["Message", "MessageList"],
		}),
	}),
})

export const {
	useGetEventsQuery,
	useGetEventQuery,
	useGetEventUsersQuery,
	useSearchUserQuery,
	useCreateEventMutation,
	useDeleteEventMutation,
	useGetMessagesQuery,
	useGetMessageTypesQuery,
	useGetMessageServiceTypesQuery,
	useAddMessagesToEventMutation,
	useAddUserToEventMutation,
	useAddImageToEventMutation,
	useGetEventImagesQuery,
	useCreateMessageMutation,
	useGetMessageRelatedFieldsQuery,
	useGetMessageQuery,
	useEditMessageMutation,
} = eventsApi
