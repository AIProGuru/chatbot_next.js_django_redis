import styles from "./SwitchProfileItem.module.scss"
import {useRouter} from "next/router"
import {useEffect} from "react"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {cc} from "@/components/ui/Functions/Classnames"

interface SwitchProfileItemProps {
	title: string
	href?: string
	onClick?: Function
	icon?: any
	image?: any
}

function SwitchProfileItem(props: SwitchProfileItemProps) {
	const {title, href, onClick, icon, image} = props
	const router = useRouter()
	const dir = getDirection(router)

	useEffect(() => {
		if (href) {
			router.prefetch(href).then(() => {})
		}
	}, [href, router])

	function onClickHandler() {
		href && router.push(href)
		onClick && onClick()
	}

	return (
		<div
			className={cc([styles.SwitchProfileItem, dir && styles[dir]])}
			onClick={onClickHandler}
		>
			{icon ||
				(image && (
					<>
						{icon && (
							<div className={styles.ImageOrIcon}>{icon}</div>
						)}
						{image && (
							<div className={styles.Image}>
								<img src={image} alt="" />
							</div>
						)}
					</>
				))}
			<div className={styles.Title}>{title}</div>
		</div>
	)
}

export default SwitchProfileItem
