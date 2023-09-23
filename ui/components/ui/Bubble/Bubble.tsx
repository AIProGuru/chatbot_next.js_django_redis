import styles from "./Bubble.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"

export interface BubbleProps {
	position: "left" | "right"
	counter: number
	variant?: "clear" | "tab-bar" | "no-brackets"
	fixedDir?: boolean
}

function Bubble(props: BubbleProps) {
	const {position, counter, variant, fixedDir} = props
	const router = useRouter()
	const dir = getDirection(router)

	return (
		<span
			className={cc([
				styles.Bubble,
				styles["Position-" + position],
				!fixedDir && dir && styles["Position-" + position + "-" + dir],
				variant !== undefined && styles["Variant-" + variant],
				!fixedDir && dir && styles[dir],
			])}
		>
			{variant === undefined && <>({counter})</>}
			{variant !== undefined && <>{counter}</>}
		</span>
	)
}

export default Bubble
