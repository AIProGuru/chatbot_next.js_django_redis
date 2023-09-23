// @ts-ignore
import {useAuth} from "/components/auth/AuthProvider"
import {useRouter} from "next/router"
import {useEffect, useState} from "react"

export default function AuthGuard({children}: {children: JSX.Element}) {
	const auth = useAuth()
	const router = useRouter()
	const [authReady, setAuthReady] = useState(false)

	useEffect(() => {
		setTimeout(() => {
			setAuthReady(true)
		}, 100)
	}, [auth])

	useEffect(() => {
		if (authReady) {
			if (!auth) {
				router.push("/auth/signin").then()
			}
		}
	}, [authReady])

	// if auth initialized with a valid user show protected page
	if (authReady) {
		if (auth) {
			return <>{children} </>
		}
	}

	/* otherwise, don't return anything, will do a redirect from useEffect */
	return null
}
