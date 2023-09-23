import styles from "./SuccessRabbitIcon.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"

interface SuccessRabbitIconProps {
	size?: "small"
}

function SuccessRabbitIcon(props: SuccessRabbitIconProps) {
	const {size} = props

	return (
		<div
			className={cc([
				styles.SuccessRabbitIcon,
				size && styles["Size-" + size],
			])}
		/>
	)
}

export default SuccessRabbitIcon
