import styles from "./Wrapper.module.scss"

interface WrapperProps {
	children: any
}

function Wrapper(props: WrapperProps) {
	const {children} = props

	return <div className={styles.Wrapper}>{children}</div>
}

export default Wrapper
