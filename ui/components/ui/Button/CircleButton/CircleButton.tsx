import styles from "./CircleButton.module.scss"
import React from "react"
import {cc} from "@/components/ui/Functions/Classnames"

interface CircleButtonProps {
	icon: JSX.Element
	onClick?: Function
	id?: string
	disabled?: boolean
	color?: "black" | "white"
}

function CircleButton(props: CircleButtonProps) {
	const {icon, onClick, id, color, disabled} = props

	function handleButtonClick(event: React.MouseEvent) {
		!disabled && onClick && onClick(event)
	}

	return (
		<button
			className={cc([
				styles.CircleButton,
				color && styles["Color-" + color],
				disabled && styles.Disabled,
			])}
			onClick={handleButtonClick}
			disabled={disabled}
			{...(id && {id: id})}
		>
			{icon}
		</button>
	)
}

export default CircleButton
