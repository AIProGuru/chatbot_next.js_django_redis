import styles from "./Event.module.scss"
import Divider from "@/components/ui/Divider/Divider"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {cc} from "@/components/ui/Functions/Classnames"
import Image from "next/image"

interface EventProps {
	title: string
	description: string
	date?: string
	image: string
	href?: string
	variant?: "big-text"
}

function Event(props: EventProps) {
	const {title, description, date, image, href, variant} = props
	const router = useRouter()

	function handleClick(event: React.MouseEvent) {
		href && router.push(href)
	}

	return (
		<>
			<a
				// {...(href ? {href: href} : {href: "#"})}
				className={styles.EventClickableArea}
				onClick={handleClick}
				id={"event_list_clickable_block"}
			>
				<div
					className={cc([
						styles.Container,
						variant !== undefined && styles["Variant-" + variant],
					])}
				>
					<div className={styles.Event}>
						<div
							className={cc([
								styles.EventImage,
								styles[getDirection(router)],
							])}
						>
							{image && !image.toString().startsWith("#") && (
								<Image
									src={image}
									width={81}
									height={81}
									alt={""}
								/>
							)}
						</div>
						<div className={styles.EventInfo}>
							<p className={styles.Title}>{title && title}</p>
							{date && <p className={styles.Date}>{date}</p>}
							<p className={styles.Description}>
								{description && description}
							</p>
						</div>
					</div>
				</div>
				<Divider />
			</a>
		</>
	)
}

export default Event
