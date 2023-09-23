import styles from "./Button.module.scss"
import {useRouter} from "next/router"
import {cc} from "@/components/ui/Functions/Classnames"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import Spinner from "@/components/ui/Loader/Spinner/Spinner"

export interface ButtonProps {
	children: any
	type: "button" | "link"
	href?: string
	onClick?: Function
	mode?: "submit"
	fullWidth?: boolean
	id?: string
	variant?: "outline" | "available-today" | "start-chat"
	color?: "white" | "black"
	background?: "white" | "gray" | "whiteGray"
	prevent?: boolean
	blueBorder?: boolean
	disabled?: boolean
	icon?: any
	border?: "medium" | "bold"
	isLoading?: boolean
}

function Button(props: ButtonProps) {
	const {
		children,
		type,
		href,
		onClick,
		mode,
		fullWidth,
		id,
		variant,
		color,
		background,
		prevent,
		blueBorder,
		disabled,
		icon,
		border,
		isLoading,
	} = props
	const router = useRouter()
	const dir = getDirection(router)

	function handleClick(event: React.MouseEvent) {
		if (prevent === undefined || prevent) {
			event.preventDefault()
		}
		href && router.push(href)
		onClick && onClick(event)
	}

	if (isLoading) {
		return (
			<div className={styles.Loading}>
				<Spinner />
			</div>
		)
	}

	if (type === "link") {
		return (
			<a
				{...(href ? {href: href} : {href: "#"})}
				className={cc([
					styles.Button,
					fullWidth && styles.FullWidth,
					variant !== undefined && styles["Variant-" + variant],
					color !== undefined && styles["Color-" + color],
					background !== undefined &&
						styles["Background-" + background],
					border && styles["Border-" + border],
					dir && styles[dir],
				])}
				onClick={handleClick}
				{...(id && {id: id})}
			>
				{children}
			</a>
		)
	}

	return (
		<button
			className={cc([
				styles.Button,
				fullWidth && styles.FullWidth,
				blueBorder && styles.BlueBorder,
				variant !== undefined && styles["Variant-" + variant],
				color !== undefined && styles["Color-" + color],
				background !== undefined && styles["Background-" + background],
				border && styles["Border-" + border],
				dir && styles[dir],
			])}
			style={{opacity: disabled ? 0.45 : 1}}
			disabled={disabled ? disabled : false}
			onClick={handleClick}
			{...(type === "button" && mode === "submit" && {type: "submit"})}
			{...(id && {id: id})}
		>
			{icon && <div className={styles.Icon}>{icon}</div>}
			{children}
		</button>
	)
}

export default Button
