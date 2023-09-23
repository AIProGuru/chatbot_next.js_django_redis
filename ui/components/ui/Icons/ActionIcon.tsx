import styles from "./ActionIcon.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"

interface ActionIconProps {
	color?: "light" | "dark"
}

function ActionIcon(props: ActionIconProps) {
	const {color} = props
	return (
		<div
			className={cc([
				styles.ActionIcon,
				color && styles["Color-" + color],
			])}
		/>
	)
}

export default ActionIcon
