import axios from "axios"
import {getCookie, setCookie} from "cookies-next"
import {logoutUser} from "./utils"
import getConfig from "next/config"
const {publicRuntimeConfig} = getConfig()

export const axiosPublicInstance = axios.create({
	baseURL: publicRuntimeConfig?.apiUrl,
})

const axiosInstance = axios.create({
	baseURL: publicRuntimeConfig?.apiUrl,
	// @ts-ignore
	context: {},
})

export const authInstance = axios.create({
	baseURL: publicRuntimeConfig?.authUrl
})



// Request interceptors
axiosInstance.interceptors.request.use(
	config => {
		if (config && config.headers) {
			const accessToken = getCookie('accessToken')
			if (accessToken && typeof accessToken === "string") {
				config.headers['Authorization'] = accessToken
			}
		}

		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// Response interceptors
axiosInstance.interceptors.response.use(
	(response: any) => {
		// const refreshToken = getCookie('refreshToken')

		if (response && response.data && response.data['Refresh-Auth-Token']) {
			//  authInstance.post("/auth/refresh/", {refresh_token: refreshToken})
			// 	.then(({data}) => {
			// 		// debugger
			// 		// @ts-ignore
			// 		const {access_token: accessToken, refresh_token: refreshToken} = data
			// 		setCookies("accessToken", accessToken)
			// 		setCookies("refreshToken", refreshToken)
			// 		axiosInstance.defaults.headers.common["Authorization"] = accessToken
			// 	})
			// 	.catch(error => {
			// 		console.log("token refresh error", error)
			// 		logoutUser()
			// 	})
			doRefresh().then((r) => {
			})
		}

		return response
	},
	error => {
		const originalRequest = error.config

		if (error && error.response && error.response.data && error.response.data['Refresh-Auth-Token']) {
			doRefresh().then((r) => {
				console.log('doRefresh error done', r)
			})
		}

		if (error.response.status === 401 && !originalRequest._retry) {

			// const {ctx} = originalRequest.context
			// logoutUser(ctx)

			// // console.log('Refresh token')
			// originalRequest._retry = true
			//
			// const {ctx} = originalRequest.context
			//
			// const refreshToken = getCookie("refreshToken", ctx)
			// // console.log('refreshToken', refreshToken)
			// return authInstance.post("/auth/refresh/", {refresh_token: refreshToken})
			// 	.then(({data}) => {
			// 		// debugger
			// 		// @ts-ignore
			// 		const {access_token: accessToken, refresh_token: refreshToken} = data
			// 		setCookies("accessToken", accessToken, ctx)
			// 		setCookies("refreshToken", refreshToken, ctx)
			// 		// console.log('Success refresh token')
			// 		axiosInstance.defaults.headers.common["Authorization"] = accessToken
			// 		originalRequest.headers["Authorization"] = accessToken
			// 		return axiosInstance(originalRequest)
			// 	})
			// 	.catch(error => {
			// 		console.log("Error refresh token", error)
			// 		logoutUser(ctx)
			// 	})
		}
		return Promise.reject({...error})
	}
)

const doRefresh = (): Promise<string> => {
	return new Promise((resolve, reject) => {
		const refreshToken = getCookie('refreshToken')

		authInstance.post("/auth/refresh/", {refresh_token: refreshToken})
			.then(({data}) => {
				// debugger
				// @ts-ignore
				const {access_token: accessToken, refresh_token: refreshToken} = data
				// setCookie("accessToken", accessToken, {sameSite: "lax"})
				// setCookie("refreshToken", refreshToken, {sameSite: "lax"})
				setCookie("accessToken", accessToken)
				setCookie("refreshToken", refreshToken)
				axiosInstance.defaults.headers.common["Authorization"] = accessToken
				resolve(accessToken)
			})
			.catch(error => {
				logoutUser()
				reject()
			})
	})
}

export default axiosInstance

export {doRefresh}
