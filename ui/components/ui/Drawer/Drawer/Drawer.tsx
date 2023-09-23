import styles from "./Drawer.module.scss"
import React, {useCallback, useEffect, useRef, useState} from "react"
import {cc} from "@/components/ui/Functions/Classnames"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import {toggleBodyScroll} from "@/components/ui/Functions/BodyScrollLock"

interface DrawerProps {
	children: any
	show: boolean
	setShow: Function
	position: "bottom" | "left" | "right"
	title?: string
	trigger?: boolean
	fixedHeight?: boolean
}

function Drawer(props: DrawerProps) {
	const {children, show, setShow, position, title, trigger, fixedHeight} =
		props

	const [active, setActive] = useState(false)

	const drawerRef = useRef<HTMLDivElement>(null)

	// on init - update active state to start animation
	useEffect(() => {
		if (show && drawerRef.current) {
			updateActive(true)
			toggleBodyScroll(true)
			// disableBodyScroll(drawerRef.current)
		}
		if (!show) {
			handleCloseClick()
		}
	}, [show, drawerRef])

	// update state function (because of setTimeout inside)
	function updateActive(state: boolean) {
		setTimeout(() => {
			setActive(state)
		}, 100)
	}

	const updateShow = useCallback(() => {
		setTimeout(() => {
			// document.body.style.overflowY = "unset"
			// drawerRef.current && enableBodyScroll(drawerRef.current)
			setShow(false)
			toggleBodyScroll(false)
		}, 250)
	}, [setShow])

	const handleCloseClick = useCallback(
		(event?: React.MouseEvent) => {
			if (setShow) {
				updateActive(false)
				updateShow()
			}
		},
		[setShow, updateShow]
	)

	useEffect(() => {
		if (trigger) {
			handleCloseClick()
		}
	}, [trigger])

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
				id={"drawer_backdrop"}
			/>

			{position !== undefined && position !== "bottom" && (
				<div
					className={cc([
						styles.AbsoluteClose,
						styles["AbsoluteClose-" + position],
						active && styles.ActiveAbsoluteClose,
					])}
				>
					<div className={styles.Button}>
						<TransparentButton
							icon={<CloseIcon style={"light"} />}
							onClick={handleCloseClick}
							id={"transparent_button_close_bottom_drawer"}
						/>
					</div>
				</div>
			)}

			<div
				className={cc([
					styles.Drawer,
					active && styles.ActiveDrawer,
					active &&
						position !== undefined &&
						styles["ActiveDrawer-" + position],
					position !== undefined
						? styles["Position-" + position]
						: styles["Position-bottom"],
					fixedHeight && styles.FixedHeight,
				])}
				ref={drawerRef}
			>
				<div
					className={cc([
						styles.Header,
						position !== undefined &&
							position !== "bottom" &&
							styles["Header-hidden"],
					])}
				>
					<TransparentButton
						icon={<CloseIcon />}
						onClick={handleCloseClick}
						id={"transparent_button_close_bottom_drawer"}
						type={"button"}
					/>
					{title && <div className={styles.Title}>{title}</div>}
				</div>

				{position === "bottom" ? (
					<div className={cc([styles.Container])}>{children}</div>
				) : (
					<div
						className={cc([
							styles.ContainerSides,
							styles["ContainerSides-FullHeight"],
						])}
					>
						{children}
					</div>
				)}
			</div>
		</>
	)
}

export default Drawer
