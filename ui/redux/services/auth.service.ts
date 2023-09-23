import {authInstance} from "@/app/axiosInstance"
import {clearObject} from "@/app/utils"
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
// import {axiosBaseQuery} from "@/redux/config/axios"
import getConfig from "next/config"
const {publicRuntimeConfig} = getConfig()

type ForgotPasswordProps = {
	email: string
}

type ResetPasswordProps = {
	token: string
	new_password: string
}

type EmailVerificationProps = {
	token: string
}

export const authApi = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: publicRuntimeConfig?.authUrl as string,
	}),
	reducerPath: "authApi",
	tagTypes: [],
	endpoints: (build) => ({
		registerUser: build.mutation<any, any>({
			query: (arg) => {
				const {formData} = arg

				const {otp} = formData

				const data = clearObject({
					...formData,
					otp_hash: otp,
				})

				return {
					url: `auth/register/`,
					method: "post",
					body: data,
				}
			},
		}),
		forgotPassword: build.query<any, ForgotPasswordProps>({
			query: (arg) => {
				const {email} = arg

				return {
					url: `auth/reset-password/${email}/`,
					method: "get",
				}
			},
		}),
		resetPassword: build.mutation<any, ResetPasswordProps>({
			query: (arg) => {
				const {token, new_password} = arg

				return {
					url: `auth/reset-password/`,
					method: "post",
					body: {
						token,
						new_password,
					},
				}
			},
		}),
		emailVerification: build.mutation<any, EmailVerificationProps>({
			query: (arg) => {
				const {token} = arg

				return {
					url: `auth/email-verification/`,
					method: "post",
					body: {
						token,
					},
				}
			},
		}),
		signIn: build.mutation<any, any>({
			query: (arg) => {
				const {password, username, recaptchaValue} = arg

				return {
					url: `auth/login/`,
					method: "post",
					body: {
						recaptcha_value: recaptchaValue,
						password: password,
						username: username,
						usernameEmail: username,
					},
				}
			},
		}),
		signInPhone: build.mutation<any, any>({
			query: (arg) => {
				const {phone, otp, recaptchaValue} = arg

				return {
					url: `auth/login/by-phone/`,
					method: "post",
					body: {
						recaptcha_value: recaptchaValue,
						phone: phone,
						otp: otp,
						otp_hash: otp,
					},
				}
			},
		}),
	}),
})

export const {
	useRegisterUserMutation,
	useForgotPasswordQuery,
	useLazyForgotPasswordQuery,
	useResetPasswordMutation,
	useEmailVerificationMutation,
	useSignInMutation,
	useSignInPhoneMutation,
} = authApi

export const {emailVerification} = authApi.endpoints

// old, but still in use somewhere
function registerUser(formData: any) {
	const {otp} = formData

	const data = clearObject({
		...formData,
		otp_hash: otp,
	})

	return authInstance.post(`/auth/register/`, data)
}

function signIn(formData: any) {
	const {usernameEmail: username} = formData
	const data = clearObject({
		...formData,
		username,
	})

	return authInstance.post(`/auth/login/`, data)
}

function signInPhone(formData: any) {
	const {otp} = formData
	const data = clearObject({
		...formData,
		otp_hash: otp,
	})

	return authInstance.post(`/auth/login/by-phone/`, data)
}

/**
 * This function call API and send OTP to the given phone number
 * @param phone - user phone number
 * @param via
 */
function sendOTPPhone(phone: string, via: string) {
	return authInstance.get(`/auth/send-otp/${phone}/`, {
		params: {
			via: via,
		},
	})
}

/**
 * This function check is given OTP code correct
 * @param phone - user phone number
 * @param otp - one time password code
 */
function checkOTPPhone(phone: string, otp: number) {
	return authInstance.post(`/auth/check-otp/`, {
		phone: phone,
		otp: otp,
	})
}

export const authService = {
	registerUser,
	signIn,
	signInPhone,
	sendOTPPhone,
	checkOTPPhone,
}
