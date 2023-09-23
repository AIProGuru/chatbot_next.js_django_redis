// import axiosInstance from "../../app/axiosInstance"
import {getCookie} from "cookies-next"
import {useEffect, useState} from "react"

export const useAuth = () => {
	const [ok, setOk] = useState(false)

	useEffect(() => {
		const accessToken = getCookie("accessToken")

		if (accessToken && typeof accessToken === "string") {
			// axiosInstance.defaults.headers.common["Authorization"] = accessToken
			setOk(true)
		}
	}, [])

	return ok
}

export const useUpdateAuth = () => {
	const [ok, setOk] = useState<boolean | null>(null)

	useEffect(() => {
		const accessToken = getCookie("accessToken")

		if (accessToken && typeof accessToken === "string") {
			// axiosInstance.defaults.headers.common["Authorization"] = accessToken
			setOk(true)
		} else {
			setOk(false)
		}
	}, [])

	return ok
}
