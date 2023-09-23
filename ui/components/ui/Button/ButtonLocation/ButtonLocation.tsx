import styles from "./ButtonLocation.module.scss"
import {useRouter} from "next/router"
import {cc} from "@/components/ui/Functions/Classnames"

export interface ButtonLocationProps {
	children: any
	type: "button" | "link"
	href?: string
	onClick?: Function
	mode?: "submit"
	fullWidth?: boolean
	id?: string
	prevent?: boolean
	disabled?: boolean
	icon?: any
	variant?: "contact-us"
}

function ButtonLocation(props: ButtonLocationProps) {
	const {
		children,
		type,
		href,
		onClick,
		mode,
		fullWidth,
		id,
		prevent,
		disabled,
		icon,
		variant,
	} = props
	const router = useRouter()

	function handleClick(event: React.MouseEvent) {
		if (prevent === undefined || prevent) {
			event.preventDefault()
		}
		href && router.push(href)
		onClick && onClick(event)
	}

	return (
		<button
			className={cc([
				styles.ButtonLocation,
				fullWidth && styles.FullWidth,
				variant && styles["Variant-" + variant],
			])}
			style={{opacity: disabled ? 0.45 : 1}}
			disabled={disabled ? disabled : false}
			onClick={handleClick}
			{...(type === "button" && mode === "submit" && {type: "submit"})}
			{...(id && {id: id})}
		>
			<div className={styles.Text}>{children}</div>
			<div className={styles.Icon}>{icon && icon}</div>
		</button>
	)
}

export default ButtonLocation
