import styles from "./TransparentButton.module.scss"
import React from "react"
import {cc} from "@/components/ui/Functions/Classnames"

interface TransparentButtonProps {
	icon: JSX.Element
	onClick?: Function
	id?: string
	mode?: "fit-content"
	type?: "button" | "submit" | "reset" | undefined
}

function TransparentButton(props: TransparentButtonProps) {
	const {icon, onClick, id, mode, type} = props

	function handleButtonClick(event: React.MouseEvent) {
		onClick && onClick(event)
	}

	return (
		<button
			className={cc([
				styles.TransparentButton,
				mode && styles["Mode-" + mode],
			])}
			onClick={handleButtonClick}
			{...(id && {id: id})}
			{...(type && {type: type})}
		>
			{icon}
		</button>
	)
}

export default TransparentButton
