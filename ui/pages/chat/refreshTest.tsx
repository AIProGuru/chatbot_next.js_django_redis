import {useEffect, useState} from "react"
import {getCookie, setCookie} from "cookies-next"
import {authInstance} from "@/app/axiosInstance"

type RefreshPromiseResponse = {
	newAT: string
	newRT: string
}

function RefreshTest() {
	const startAT = getCookie("accessToken")
	const startRT = getCookie("refreshToken")

	const [accessToken, setAccessToken] = useState<string | undefined>(
		undefined
	)
	const [refreshToken, setRefreshToken] = useState<string | undefined>(
		undefined
	)
	const [counter, updateCounter] = useState(0)
	const [errorCounter, updateErrorCounter] = useState(0)

	const refresher = (): Promise<RefreshPromiseResponse> => {
		return new Promise((resolve, reject) => {
			authInstance
				.post("/auth/refresh/", {refresh_token: refreshToken})
				.then(({data}: any) => {
					const {access_token: newAT, refresh_token: newRT} = data

					updateCounter((prevState) => prevState + 1)

					resolve({newAT, newRT})
				})
				.catch((error) => {
					updateErrorCounter((prevState) => prevState + 1)
					reject()
				})
		})
	}

	const getTokenExp = (token: string | undefined) => {
		if (!token) return
		const payloadBase64 = token.split(".")[1]
		const decodedJson = Buffer.from(payloadBase64, "base64").toString()
		const decoded = JSON.parse(decodedJson)
		const exp = decoded.exp
		return exp * 1000
	}

	const handleButtonClick = () => {
		console.log("refresh button click")
		refresher()
			.then((r) => {
				console.log("refresh then", r)

				setAccessToken(r.newAT)
				setRefreshToken(r.newRT)

				// setCookie("accessToken", r.newAT, {sameSite:"lax"})
				// setCookie("refreshToken", r.newRT, {sameSite:"lax"})
				setCookie("accessToken", r.newAT)
				setCookie("refreshToken", r.newRT)
			})
			.catch((e) => {
				console.log("refresh catch", e)
			})
	}

	useEffect(() => {
		if (
			startAT &&
			startRT &&
			typeof startAT === "string" &&
			typeof startRT === "string"
		) {
			setAccessToken(startAT)
			setRefreshToken(startRT)
		}
	}, [startAT, startRT])

	// useEffect(() => {
	// 	if (
	// 		startAT &&
	// 		startRT &&
	// 		typeof startAT === "string" &&
	// 		typeof startRT === "string"
	// 	) {
	// 		refresher(startRT)
	// 			.then((r) => {
	// 				setAccessToken(r.accessToken)
	// 				setRefreshToken(r.refreshToken)
	//
	// 				setCookies("accessToken", accessToken)
	// 				setCookies("refreshToken", refreshToken)
	//
	// 				console.log("Start refresh", r.accessToken, r.refreshToken)
	// 			})
	// 			.catch((e) => {
	// 				console.log("Start refresh error:", e)
	// 			})
	// 	}
	// }, [startAT, startRT])

	// useEffect(() => {
	// 	if (accessToken && refreshToken) {
	// 		setTimeout(() => {
	// 			refresher(refreshToken)
	// 				.then((r) => {
	// 					setAccessToken(r.accessToken)
	// 					setRefreshToken(r.refreshToken)
	//
	// 					console.log("refresh", r.accessToken, r.refreshToken)
	// 				})
	// 				.catch((e) => {
	// 					console.log("refresh error:", e)
	// 				})
	// 		}, 5000)
	// 	}
	// }, [accessToken, refreshToken])

	// useEffect(() => {
	// 	console.log("interval")
	//
	// 	const int = setInterval(() => {
	// 		if (counter > 0 && counter < 1000) {
	// 			handleButtonClick()
	// 		}
	// 	}, 5000)
	//
	// 	return () => {
	// 		clearInterval(int)
	// 	}
	// }, [counter])

	return (
		<div>
			<div>Refresh count: {counter}</div>
			<div>Refresh error count: {errorCounter}</div>
			<div>
				<button
					onClick={() => {
						handleButtonClick()
					}}
				>
					refresh
				</button>
			</div>
			<div>
				<p style={{wordBreak: "break-all"}}>
					{getTokenExp(accessToken)}
				</p>
				<p style={{wordBreak: "break-all"}}>
					{getTokenExp(refreshToken)}
				</p>
			</div>
		</div>
	)
}

export default RefreshTest
