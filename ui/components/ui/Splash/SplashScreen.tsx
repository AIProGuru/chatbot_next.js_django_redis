import {useEffect} from "react"
import styles from "./SplashScreen.module.scss"

interface SplashScreenProps {
	isLoading: boolean
	setShowSplash: Function
	time?: number
}

function SplashScreen(props: SplashScreenProps) {
	const {isLoading, setShowSplash, time} = props

	// when loading finish, wait for animation and then callback
	useEffect(() => {
		if (!isLoading) {
			setTimeout(
				() => {
					setShowSplash(false)
				},
				time ? time : 250
			)
		}
	}, [isLoading, setShowSplash])

	return (
		<div
			className={[
				styles.SplashScreen,
				!isLoading && styles.SplashScreenHidden,
			].join(" ")}
		>
			{/*<div className={styles.Icon} />*/}
			<img src="/splash/sww-preloader.gif" alt="" />
			<div className={styles.Logotype} />
		</div>
	)
}

export default SplashScreen
