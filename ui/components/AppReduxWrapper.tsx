import {useRouter} from "next/router"
import {useAppDispatch, useAppSelector} from "@/redux/store"
import {useEffect, useState} from "react"
import {
	SendLocationProps,
	useLazyGetUserProfilesInfoQuery,
	useSendLocationMutation,
} from "@/services/users.service"
import {getCookie} from "cookies-next"
import {doRefresh} from "@/app/axiosInstance"
import {updateUserInfo} from "@/redux/slices/UserInfoSlice"
import useGeoLocation from "@/components/ui/Functions/Hooks/GetLocation"

interface AppReduxWrapper {
	children: any
}

function AppReduxWrapper(props: AppReduxWrapper) {
	const {children} = props
	const router = useRouter()
	const dispatch = useAppDispatch()

	// state
	const userProfilesData = useAppSelector(
		(state) => state.UserInfoSlice.userInfo
	)
	const [accessToken, setAccessToken] = useState<string | undefined>(
		undefined
	)
	const [localAuth, setLocalAuth] = useState<boolean | null>(null)

	// rtk
	const [getUserProfilesInfoQuery, userProfilesInfoResponse] =
		useLazyGetUserProfilesInfoQuery()

	const isTokenExpired = (token: string) => {
		const payloadBase64 = token.split(".")[1]
		const decodedJson = Buffer.from(payloadBase64, "base64").toString()
		const decoded = JSON.parse(decodedJson)
		const exp = decoded.exp
		return Date.now() + 10000 >= exp * 1000
	}

	// initial refresh
	useEffect(() => {
		const currentRefreshToken = getCookie("refreshToken")

		let isMounted = true;

		if (currentRefreshToken && typeof currentRefreshToken === "string") {
			doRefresh()
				.then((r: string) => {
					if (isMounted) {
						setAccessToken(r)
					}
				})
				.catch((e) => {
					if (isMounted) {
						setLocalAuth(false)
					}
				})
		}

		return () => {
			isMounted = false; 
		};

	}, [])

	// refresh interval
	useEffect(() => {
		const int = setInterval(() => {
			if (accessToken && isTokenExpired(accessToken)) {
				doRefresh()
					.then((r: string) => {
						setAccessToken(r)
					})
					.catch((e) => {
						setLocalAuth(false)
					})
			}
		}, 2000)

		return () => {
			clearInterval(int)
		}
	}, [accessToken])

	useEffect(() => {
		if (accessToken) {
			setLocalAuth(true)
		}
	}, [accessToken])

	useEffect(() => {
		if (localAuth) {
			getUserProfilesInfoQuery({})
		}
	}, [localAuth])

	useEffect(() => {
		if (
			localAuth &&
			userProfilesInfoResponse &&
			userProfilesInfoResponse.isSuccess &&
			userProfilesInfoResponse.data
		) {
			dispatch(
				updateUserInfo({
					value: userProfilesInfoResponse.data,
				})
			)
		}
	}, [localAuth, userProfilesInfoResponse])

	useEffect(() => {
		if (localAuth && userProfilesData) {
			if (
				userProfilesData.profiles &&
				userProfilesData.profiles.length < 1
			) {
				router.push(`/auth/signup/0/step/1`).then()
			}
		}
	}, [userProfilesData, localAuth])

	return children
}

export default AppReduxWrapper
