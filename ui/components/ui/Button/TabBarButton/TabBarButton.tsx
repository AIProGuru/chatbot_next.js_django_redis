import styles from "./TabBarButton.module.scss"
import React from "react"
import {cc} from "@/components/ui/Functions/Classnames"
import Bubble, {BubbleProps} from "@/components/ui/Bubble/Bubble"

interface TabBarButtonProps {
	icon: JSX.Element
	label: string
	onClick?: Function
	id?: string
	active?: boolean
	bubble?: BubbleProps
	fixedDir?: boolean
}

function TabBarButton(props: TabBarButtonProps) {
	const {icon, label, onClick, id, active, bubble, fixedDir} = props

	// console.log("active", active)

	function handleButtonClick(event: React.MouseEvent) {
		onClick && onClick(event)
	}

	return (
		<div className={styles.TabBarButtonContainer}>
			<button
				className={cc([
					styles.TabBarButton,
					active === true && styles.Active,
				])}
				onClick={handleButtonClick}
				{...(id && {id: id})}
			>
				<div className={styles.Icon}>{icon}</div>
				<div className={styles.Label}>
					<span>{label}</span>
				</div>
			</button>
			{bubble && bubble.counter > 0 && (
				<Bubble
					counter={bubble.counter}
					position={bubble.position}
					variant={bubble.variant}
					fixedDir={fixedDir}
				/>
			)}
		</div>
	)
}

export default TabBarButton
