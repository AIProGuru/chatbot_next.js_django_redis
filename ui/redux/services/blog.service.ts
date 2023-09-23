import {createApi} from "@reduxjs/toolkit/dist/query/react"
import {axiosBaseQuery} from "@/redux/config/axios"
import getConfig from "next/config"
import {HYDRATE} from "next-redux-wrapper"
import {Logger} from "sass"

const {publicRuntimeConfig} = getConfig()

type RegisterBlogProps = {
	status: number
	title: string
	description: string
}

type GetBlogsProps = {
	page: number
	pageSize: number
	search: string
	current_profile_id: string
	ordering: "RECENT" | "MOST_POPULAR"
}

type GetBlogProps = {
	slug: string | undefined
}

type AddBlogProps = {
	idBlog: string | undefined
	content: string
}

type GetBlogCommentsProps = {
	idBlog: string | undefined
}

type GetArticlesProps = {
	page: number
	page_size: number
	section_id?: number
}

type GetSectionsProps = {
	page: number
	page_size: number
}

type GetArticlesResponse = {
	count: number
	next: string
	previous: string
	results: Article[]
}

export type Article = {
	article_image: ArticleImage[]
	article_type: number
	created: string
	id: number
	section: number
	section_id: number
	slug: string
	status: number
	text: string
	title: string
	updated: string
	section_name: string
}

type ArticleImage = {
	article: number
	file_name: string
	id: number
	src: string
	url: string
}

export type Section = {
	children: Section[]
	data: SectionData
	id: number
}

type SectionData = {
	heading: string
	image: ArticleImage
	name: string
	order_by: number
	section_type: number
	slug: string
	status: number
}

type GetArticleProps = {
	slug: string
}

type RegisterForumProps = {
	status: number
	title: string
	description: string
}

type GetForumsProps = {
	page: number
	pageSize: number
	search: string
	current_profile_id: string
	ordering: "RECENT" | "MOST_POPULAR"
}

type GetForumProps = {
	slug: string | undefined
}

type GetArticleResponse = Article

export const blogApi = createApi({
	baseQuery: axiosBaseQuery({
		// baseURL: process.env.apiUrl as string
		baseURL: publicRuntimeConfig?.apiUrl as string,
	}),
	reducerPath: "blog",
	tagTypes: ["Profile", "Profiles"],
	extractRehydrationInfo(action, {reducerPath}) {
		if (action.type === HYDRATE) {
			return action.payload[reducerPath]
		}
	},
	endpoints: (build) => ({
		// get events
		registerBlog: build.mutation<any, RegisterBlogProps>({
			query: (arg) => {
				const {title, description, status} = arg

				return {
					method: "post",
					url: `api/blog/blog/`,
					data: {
						status: status,
						title: title,
						text: description,
					},
				}
			},
		}),
		getBlogs: build.query<any, GetBlogsProps>({
			query: (arg) => {
				const {page, pageSize, search, current_profile_id, ordering} =
					arg

				return {
					method: "get",
					url: `public/blog/`,
					params: {
						page: page,
						page_size: pageSize,
						search: search,
						current_profile_id: current_profile_id,
						ordering: ordering,
					},
				}
			},
		}),
		getBlog: build.query<any, GetBlogProps>({
			query: (arg) => {
				const {slug} = arg

				return {
					method: "get",
					url: `public/blog/${slug}`,
				}
			},
		}),
		getAuthBlog: build.query<any, GetBlogProps>({
			query: (arg) => {
				const {slug} = arg

				return {
					method: "get",
					url: `api/blog/blog/${slug}/`,
				}
			},
		}),
		addComment: build.mutation<any, AddBlogProps>({
			query: (arg) => {
				const {idBlog, content} = arg

				return {
					method: "post",
					url: `api/blog/comment/`,
					data: {
						article: idBlog,
						content: content,
					},
				}
			},
		}),
		getComments: build.query<any, GetBlogCommentsProps>({
			query: (arg) => {
				const {idBlog} = arg

				return {
					method: "get",
					url: `public/comment/article/${idBlog}/`,
				}
			},
		}),
		getArticles: build.query<GetArticlesResponse, GetArticlesProps>({
			query: (arg) => {
				const {page, page_size, section_id} = arg

				return {
					url: `public/article/`,
					method: "get",
					params: {
						page: page,
						page_size: page_size,
						section_id: section_id,
					},
				}
			},
		}),
		getArticle: build.query<GetArticleResponse, GetArticleProps>({
			query: (arg) => {
				const {slug} = arg

				const {publicRuntimeConfig} = getConfig()
				const apiUrl = publicRuntimeConfig?.apiUrl

				return {
					url: `public/article/${slug}`,
					method: "get",
				}
			},
		}),
		getSections: build.query<Section[], GetSectionsProps>({
			query: (arg) => {
				const {page, page_size} = arg

				return {
					url: `public/section/`,
					method: "get",
					params: {
						page: page,
						page_size: page_size,
					},
				}
			},
		}),
		registerForum: build.mutation<any, RegisterForumProps>({
			query: (arg) => {
				const {title, description, status} = arg

				return {
					method: "post",
					url: `api/blog/forum/`,
					data: {
						status: status,
						title: title,
						text: description,
					},
				}
			},
		}),
		getForums: build.query<any, GetForumsProps>({
			query: (arg) => {
				const {page, pageSize, search, current_profile_id, ordering} =
					arg

				return {
					method: "get",
					url: `public/forum/`,
					params: {
						page: page,
						page_size: pageSize,
						search: search,
						current_profile_id: current_profile_id,
						ordering: ordering,
					},
				}
			},
		}),
		getForum: build.query<any, GetForumProps>({
			query: (arg) => {
				const {slug} = arg

				return {
					method: "get",
					url: `public/forum/${slug}`,
				}
			},
		}),
		getAuthForum: build.query<any, GetForumProps>({
			query: (arg) => {
				const {slug} = arg

				return {
					method: "get",
					url: `api/blog/forum/${slug}/`,
				}
			},
		}),
	}),
})

export const {
	useRegisterBlogMutation,
	useGetBlogsQuery,
	useLazyGetBlogsQuery,
	useGetBlogQuery,
	useLazyGetBlogQuery,
	useGetAuthBlogQuery,
	useLazyGetAuthBlogQuery,
	useAddCommentMutation,
	useGetCommentsQuery,
	useLazyGetCommentsQuery,
	useGetArticlesQuery,
	useLazyGetArticlesQuery,
	useGetArticleQuery,
	useLazyGetArticleQuery,
	useGetSectionsQuery,
	useLazyGetSectionsQuery,
	useRegisterForumMutation,
	useGetForumsQuery,
	useLazyGetForumsQuery,
	useGetForumQuery,
	useLazyGetForumQuery,
	useGetAuthForumQuery,
	useLazyGetAuthForumQuery,
	util: {getRunningOperationPromises},
} = blogApi

// export endpoints for use in SSR
export const {getBlogs, getForums, getBlog, getArticle, getForum, getSections} =
	blogApi.endpoints
