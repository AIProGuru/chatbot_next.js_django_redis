import styles from "./Divider.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"

interface DividerProps {
	color?: "white"
	variant?: "big"
}

function Divider(props: DividerProps) {
	const {color, variant} = props

	return (
		<div
			className={cc([
				styles.Divider,
				color !== undefined && styles["Color-" + color],
				variant !== undefined && styles["Variant-" + variant],
			])}
		/>
	)
}

export default Divider
