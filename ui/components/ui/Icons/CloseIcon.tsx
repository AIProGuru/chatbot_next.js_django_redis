import styles from "./CloseIcon.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"

interface CloseIconProps {
	style?: "light" | "dark"
	size?: "small"
}

function CloseIcon(props: CloseIconProps) {
	const {style, size} = props

	return (
		<div className={styles.CloseIcon}>
			<div
				className={cc([
					styles.Line,
					style && styles["Style-" + style],
					size && styles["Size-" + size],
				])}
			/>
			<div
				className={cc([
					styles.Line,
					styles.Rotate,
					style && styles["Style-" + style],
					size && styles["Size-" + size],
				])}
			/>
		</div>
	)
}

export default CloseIcon
