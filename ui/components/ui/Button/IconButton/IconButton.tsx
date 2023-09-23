import styles from "./IconButton.module.scss"
import React from "react"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import Bubble, {BubbleProps} from "@/components/ui/Bubble/Bubble"
import {cc} from "@/components/ui/Functions/Classnames"

interface IconButtonProps {
	icon: JSX.Element
	onClick?: Function
	id?: string
	bubble?: BubbleProps
	placement?: "header"
	fixedDir?: boolean
}

function IconButton(props: IconButtonProps) {
	const {icon, onClick, id, bubble, placement, fixedDir} = props
	const router = useRouter()
	const dir = getDirection(router)

	const onClickHandler = (event: React.MouseEvent) => {
		onClick && onClick(event)
	}

	return (
		<div
			className={cc([
				styles.IconButtonContainer,
				!fixedDir &&
					dir &&
					placement &&
					styles["Placement-" + dir + "-" + placement],
			])}
			onClick={onClickHandler}
		>
			<button
				className={[
					styles.IconButton,
					styles[getDirection(router)],
				].join(" ")}
				{...(id && {id: id})}
			>
				{icon}
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

export default IconButton
