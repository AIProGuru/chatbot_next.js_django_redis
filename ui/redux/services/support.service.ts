import {createApi} from "@reduxjs/toolkit/query/react"
import {axiosBaseQuery} from "@/redux/config/axios"
import getConfig from "next/config"
import {clearObject} from "@/app/utils"
const {publicRuntimeConfig} = getConfig()

type NewReportProps = {
	reported_profile: string
	title: string
	description: string
	reasons: number[]
}

type FreezeProps = {
	description: string
	reasons: string[]
}

type FeedbackSubjectResponse = {
	count: number
	next: string
	previous: string
	results: Subject[]
}

type ReportReasonsResponse = {
	count: number
	next: string
	next_url: string
	previous: string
	previous_url: string
	page_links: any
	results: Reason[]
}

export type Subject = {
	id: number
	title: string
}

export type Reason = {
	id: number
	title: string
}

type NewFeedbackProps = {
	email: string | null
	phone: string | null
	full_name: string | null
	description: string | null
	subject_type: number | null
}

export const supportApi = createApi({
	baseQuery: axiosBaseQuery({
		baseURL: publicRuntimeConfig?.apiUrl as string,
	}),
	reducerPath: "support",
	tagTypes: [],
	endpoints: (build) => ({
		getReportReasons: build.query<ReportReasonsResponse, any>({
			query: (arg) => {
				return {
					url: `api/profiles/report/reasons/`,
					method: "get",
				}
			},
		}),
		newReport: build.mutation<any, NewReportProps>({
			query: (arg) => {
				const {reported_profile, title, description, reasons} = arg

				return {
					url: `api/profiles/report/create/`,
					method: "post",
					data: {
						reported_profile: reported_profile,
						title: title,
						description: description,
						reasons: reasons,
					},
				}
			},
		}),
		freeze: build.mutation<any, FreezeProps>({
			query: (arg) => {
				const {description, reasons} = arg

				return {
					url: `api/profiles/freeze/`,
					method: "post",
					data: {
						description: description,
						reasons: reasons,
					},
				}
			},
		}),
		unfreeze: build.mutation<any, any>({
			query: (arg) => {
				return {
					url: `api/profiles/unfreeze/`,
					method: "post",
				}
			},
		}),
		getFeedbackSubjects: build.query<FeedbackSubjectResponse, any>({
			query: (arg) => {
				return {
					url: `public/feedback-subjects/`,
					method: "get",
				}
			},
		}),
		newFeedback: build.mutation<any, NewFeedbackProps>({
			query: (arg) => {
				const {email, phone, full_name, description, subject_type} = arg

				const data = clearObject({
					email: email,
					phone: phone,
					full_name: full_name,
					description: description,
					subject_type: subject_type,
				})

				return {
					url: `public/feedback/`,
					method: "post",
					data: data,
				}
			},
		}),
	}),
})

export const {
	useGetReportReasonsQuery,
	useLazyGetReportReasonsQuery,
	useNewReportMutation,
	useFreezeMutation,
	useUnfreezeMutation,
	useGetFeedbackSubjectsQuery,
	useLazyGetFeedbackSubjectsQuery,
	useNewFeedbackMutation,
} = supportApi
