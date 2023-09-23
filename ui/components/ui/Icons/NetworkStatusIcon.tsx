import styles from "./NetworkStatusIcon.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"

interface NetworkStatusIconProps {
	status?: boolean
}

function NetworkStatusIcon(props: NetworkStatusIconProps) {
	const {status} = props

	return (
		<div
			className={cc([
				styles.NetworkStatusIcon,
				status && styles.NetworkOnline,
			])}
		/>
	)
}

export default NetworkStatusIcon
