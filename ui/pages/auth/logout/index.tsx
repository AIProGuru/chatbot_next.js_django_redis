import * as React from "react"
import {deleteCookie} from "cookies-next"
import {useEffect} from "react"

export const getServerSideProps = async (ctx: any) => {
	const {res} = ctx

	// manually clear cookies
	deleteCookie("refreshToken", ctx)
	deleteCookie("idToken", ctx)
	deleteCookie("accessToken", ctx)
	deleteCookie("refreshToken", ctx)

	// clear all by sending headers
	// res.setHeader(
	// 	"Clear-Site-Data",
	// 	'"cache", "cookies", "storage", "executionContexts"'
	// )

	// redirect
	res.setHeader("location", "/")

	// set status code
	res.statusCode = 302

	res.end()
	return {props: {}}
}

function Logout() {
	// try to clear cache on front end side
	useEffect(() => {
		const cache = new Cache()
		cache.keys().then(function (keyList) {
			return Promise.all(
				keyList.map(function (key) {
					return cache.delete(key)
				})
			)
		})
	}, [])
	return <></>
}

Logout.requireAuth = true

export default Logout
