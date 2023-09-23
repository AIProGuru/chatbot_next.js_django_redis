// base query (especially for axios)
import {BaseQueryFn} from "@reduxjs/toolkit/dist/query/react"
import {AxiosRequestConfig} from "axios"
import axiosInstance from "@/app/axiosInstance"

export const axiosBaseQuery =
	(
		{baseURL}: {baseURL: string} = {baseURL: ""}
	): BaseQueryFn<
		{
			url: string
			method: AxiosRequestConfig["method"]
			headers?: AxiosRequestConfig["headers"]
			params?: AxiosRequestConfig["params"]
			data?: AxiosRequestConfig["data"]
		},
		unknown,
		unknown
	> =>
	async ({url, method, headers, params, data}, {getState}) => {
		try {
			const result = await axiosInstance({
				url: baseURL + url,
				method: method,
				params: params,
				data: data,
				headers: headers,
			})

			return {data: result.data}
		} catch (axiosError) {
			// todo: something wrong with errors, maybe we don't need to type it as AxiosError
			// const err = axiosError as AxiosError

			const err: any = axiosError

			return {
				error: {
					status: err.response?.status,
					data: err.response?.data,
					message: err?.response?.data.detail,
				},
			}
		}
	}
