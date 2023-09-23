import SplashScreen from "@/components/ui/Splash/SplashScreen"
import {useEffect, useState} from "react"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"

function SplashScreenDemo() {
	const {t} = useTranslation("site")
	// loading prop demo
	const [isLoading, setIsLoading] = useState(true)
	const [showSplash, setShowSplash] = useState(true)

	// loading end demo
	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false)
		}, 1000)
	}, [setIsLoading])

	if (showSplash) {
		return (
			<SplashScreen isLoading={isLoading} setShowSplash={setShowSplash} />
		)
	}

	return <>Splash screen demo</>
}

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default SplashScreenDemo
