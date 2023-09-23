import styles from "./MessageCount.module.scss"

interface MessageCountProps {
	count: number
}

function MessageCount(props: MessageCountProps) {
	const {count} = props

	if (count < 1) return null

	return (
		<div className={styles.MessageCount}>
			<p className={styles.Count}>{count > 9 ? "9+" : count}</p>
		</div>
	)
}

export default MessageCount
