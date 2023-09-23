import styles from "./SubscriptionNotification.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import SubRabbitIcon from "@/components/ui/Icons/SubRabbit/SubRabbitIcon"
import {format} from "date-fns"
import {TFunction, useTranslation} from "next-i18next"
import {useRouter} from "next/router"
import {useMemo} from "react"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {getDateLocale} from "@/components/ui/Functions/GetDateLocale"

interface SubscriptionNotificationProps {
	subscription: {
		type: string
		valid_until?: string
	}
	rounded?: boolean
	onClick?: Function
}
//You have a VIP SWINGERS subscription (1 month) valid until February 11, 2022
const getComponentTranslations = (t: TFunction) => {
	return {
		notification: {
			text: {
				you_have: t("site.You have a"), //site.You have a
				subscription: t("site.subscription"), //site.subscription
				month: t("site.month"), //site.month
				valid_until: t("site.valid until"), //site.valid until
			},
		},
	}
}

function SubscriptionNotification(props: SubscriptionNotificationProps) {
	const {subscription, rounded, onClick} = props
	const {t} = useTranslation("site")
	const router = useRouter()
	const dir = getDirection(router)
	const componentTranslations = useMemo(() => {
		return getComponentTranslations(t)
	}, [t])

	return (
		<div
			className={cc([
				styles.SubscriptionNotification,
				dir && styles[dir],
				rounded && styles.Rounded,
			])}
			onClick={() => {
				onClick && onClick()
			}}
		>
			<div className={styles.Icon}>
				<SubRabbitIcon />
			</div>
			<div className={styles.Text}>
				{componentTranslations.notification.text.you_have}{" "}
				{subscription.type}{" "}
				{subscription.valid_until && subscription.type !== "Free" && (
					<>
						{componentTranslations.notification.text.valid_until}{" "}
						{format(
							new Date(subscription.valid_until),
							"dd MMMM yyyy",
							{
								locale: getDateLocale(router),
							}
						)}{" "}
					</>
				)}
			</div>
		</div>
	)
}

export default SubscriptionNotification
