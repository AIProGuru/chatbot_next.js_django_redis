import styles from "./BottomDrawer.module.scss"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import React, {useEffect, useState} from "react"
import {cc} from "@/components/ui/Functions/Classnames"

interface BottomDrawerProps {
	children: any
	show: boolean
	setShow: Function
	title?: string
}

function BottomDrawer(props: BottomDrawerProps) {
	const {children, show, setShow, title} = props
	const [active, setActive] = useState(false)

	// on init - update active state to start animation
	useEffect(() => {
		if (show) {
			updateActive(true)
		}
	}, [show])

	// update state function (because of setTimeout inside)
	function updateActive(state: boolean) {
		setTimeout(() => {
			setActive(state)
		}, 10)
	}

	// update show (timeout inside)
	function updateShow() {
		setTimeout(() => {
			setShow(false)
		}, 500)
	}

	// button click handler
	function handleCloseClick(event?: React.MouseEvent) {
		if (setShow) {
			updateActive(false)
			updateShow()
		}
	}

	// if show is false, then do not render component at all
	if (!show) return null

	return (
		<>
			<div
				className={cc([
					styles.Backdrop,
					active && styles.ActiveBackdrop,
				])}
				onClick={() => {
					handleCloseClick()
				}}
				id={"bottom_drawer_backdrop"}
			/>
			<div
				className={cc([
					styles.BottomDrawer,
					active && styles.ActiveBottomDrawer,
				])}
			>
				<div className={styles.Header}>
					{title && <p>{title}</p>}
					<TransparentButton
						icon={<CloseIcon />}
						onClick={handleCloseClick}
						id={"transparent_button_close_bottom_drawer"}
					/>
				</div>
				<div className={styles.Container}>{children}</div>
			</div>
		</>
	)
}

export default BottomDrawer
