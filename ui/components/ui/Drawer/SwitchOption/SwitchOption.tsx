import styles from "./SwitchOption.module.scss"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {cc} from "@/components/ui/Functions/Classnames"

interface SwitchOptionProps {
	title: string
	onClick?: Function
	icon?: any
	disabled?: boolean
}

function SwitchOption(props: SwitchOptionProps) {
	const {title, onClick, icon, disabled} = props
	const router = useRouter()
	const dir = getDirection(router)

	function onClickHandler() {
		if (disabled) return
		onClick && onClick()
	}

	return (
		<div
			className={cc([
				styles.SwitchOption,
				dir && styles[dir],
				disabled && styles.Disabled,
			])}
			onClick={onClickHandler}
		>
			{icon && <div className={styles.Icon}>{icon}</div>}
			<div className={styles.Title}>{title}</div>
		</div>
	)
}

export default SwitchOption
