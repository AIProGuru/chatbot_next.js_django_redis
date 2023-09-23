import styles from "./Logotype.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"

interface LogotypeProps {
	size?:
		| "small"
		| "medium"
		| "medium-2"
		| "big"
		| "header"
		| "signup"
		| "signin"
		| "splash"
}

function Logotype(props: LogotypeProps) {
	const {size} = props

	return (
		<div
			className={cc([
				styles.Logotype,
				size !== undefined && styles["Size-" + size],
			])}
		/>
	)
}

export default Logotype
