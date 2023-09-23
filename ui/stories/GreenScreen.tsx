import styles from "./GreenScreen.module.scss"

interface IconContainerProps {
	children: any
}

function GreenScreen(props: IconContainerProps) {
	const {children} = props

	return <div className={styles.GreenScreen}>{children}</div>
}

export default GreenScreen
