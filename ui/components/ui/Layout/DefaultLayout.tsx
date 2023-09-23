import styles from "./DefaultLayout.module.scss"

interface DefaultLayoutProps {
	children: any
	fullHeight?: boolean
}

function DefaultLayout(props: DefaultLayoutProps) {
	const {children, fullHeight} = props

	return (
		<div
			className={[styles.DefaultLayout, fullHeight && styles.FullHeight]
				.filter((e) => e)
				.join(" ")}
		>
			{children}
		</div>
	)
}

export default DefaultLayout
