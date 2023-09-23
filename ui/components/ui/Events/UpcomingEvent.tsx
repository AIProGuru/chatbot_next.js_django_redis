import styles from "./UpcomingEvent.module.scss"
import Button from "@/components/ui/Button/Button/Button"
import {cc} from "@/components/ui/Functions/Classnames"
import {stripTags} from "@/components/ui/Functions/StripTags"
import {useTranslation} from "next-i18next"

interface UpcomingEventProps {
	image: string
	date: string
	description: string
	href: string
	variant?: "inside-button"
}

function UpcomingEvent(props: UpcomingEventProps) {
	const {t} = useTranslation("site")

	const {image, date, description, href, variant} = props

	return (
		<div
			className={cc([
				styles.UpcomingEvent,
				variant === "inside-button" && styles.UpcomingEventInside,
			])}
		>
			<div className={styles.EventImage}>
				<img src={image && image} alt="" />
			</div>
			<div className={cc([styles.EventInfo])}>
				<div>
					<p className={styles.Date}>{date && date}</p>
				</div>
				<div>
					<p className={styles.Description}>
						{description && stripTags(description)}
					</p>
				</div>
			</div>
			<div className={cc([styles.Action])}>
				<Button type={"link"} href={href} id={"upcoming_event_button"}>
					<span className={styles.OpenEventButtonText}>
						{t("site.For details and registration")}
					</span>
				</Button>
			</div>
		</div>
	)
}

export default UpcomingEvent
