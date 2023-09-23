import {useEffect, useState} from "react"

export const useIsSSR = () => {
	const [ssr, setSSR] = useState(true)

	useEffect(() => {
		setSSR(false)
	}, [])

	return ssr
}
