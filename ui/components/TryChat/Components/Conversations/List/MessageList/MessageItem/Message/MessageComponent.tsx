import styles from "./MessageComponent.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import MessageStatusReadIcon from "@/components/ui/Icons/MessageStatusReadIcon"
import {format} from "date-fns"
import {
	Message,
	MessageAdditionalParams,
} from "@/TryChat/@types/Conversations/Conversation"
import {useCallback, useMemo} from "react"
import MessageStatusUnreadIcon from "@/components/ui/Icons/MessageStatusUnreadIcon"
import {useAppSelector} from "@/redux/store"
import Button from "@/components/ui/Button/Button/Button"
import {TFunction, useTranslation} from "next-i18next"
import {useRouter} from "next/router"
import {stripTags} from "@/components/ui/Functions/StripTags"
import {UserProfile} from "@/services/users.service"
import {GetPersonalName} from "@/components/TryChat/Functions/Profile/GetPersonalName"

interface MessageComponentProps {
	setShowOptions: Function
	isAuthor: boolean
	isOptions?: boolean
	message: Message
	profile?: UserProfile
	subscriptionOrCredits: () => boolean
	isBot?: () => boolean | undefined
}

const getPageTranslations = (t: TFunction) => {
	return {
		message: {
			view_recommendations: t("site.chat_view_recommendations"),
			our_whatsapp: t("site.our_whatsapp"),
		},
	}
}

function MessageComponent(props: MessageComponentProps) {
	const {
		setShowOptions,
		isAuthor,
		isOptions = false,
		message,
		profile,
		subscriptionOrCredits,
		isBot
	} = props
	const router = useRouter()
	const {t} = useTranslation("site")
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])

	// state
	const lastReadMessage = useAppSelector(
		(state) => state.TryChatSlice.lastReadMessage
	)
	const lastMessage = useAppSelector(
		(state) => state.TryChatSlice.lastMessage
	)

	const isBlurred = useCallback(() => {
		// todo: check credits/subscription here

		return subscriptionOrCredits()
	}, [])

	const messageStatus = useCallback(() => {

		if (lastReadMessage) {
			if (message.timestamp >= lastReadMessage) {
				return false
			} else if (message.timestamp < lastReadMessage) {
				return true
			}
		} else {
			return false
		}
	}, [lastReadMessage, lastMessage, message])

	const canUseOptions = () => {
		return (
			message.timestamp > new Date().getTime() - 24 * 60 * 60 * 1000 // -1d
		)
	}

	const getStyledMessage = (attributes: MessageAdditionalParams) => {
		switch (attributes.event_type) {
			case "recommendation":
				return (
					<div className={styles.Recommendations}>
						<Button
							type={"button"}
							fullWidth={true}
							onClick={() => {
								router
									.push("/profiles/my/recommendations")
									.then()
							}}
						>
							<p>
								{pageTranslations.message.view_recommendations}
							</p>
						</Button>
					</div>
				)
			case "failed_payment":
				return (
					<div className={styles.Recommendations}>
						<Button
							type={"button"}
							fullWidth={true}
							onClick={() => {
								window.open(
									"https://wa.me/+972526005533",
									'_blank'
								)
							}}
						>
							<p>
								{pageTranslations.message.our_whatsapp}
							</p>
						</Button>
					</div>
				)

			default:
				return
		}
	}

	const getProfileNickname = () => {
		if (!profile) return
		return GetPersonalName(profile)
	}

	return (
		<div
			className={cc([
				styles.MessageComponent,
				isAuthor && styles["MessageComponent-author"],
				isOptions && styles["MessageComponent-options"],
			])}
		>
			<div
				className={styles.Content}
				dir={"auto"}
				onClick={() => {
					canUseOptions() && isAuthor && setShowOptions(true)
				}}
			>
				{/*<div>{message && message.message}</div>*/}
				{!isAuthor && profile && (
					<div className={styles.Nickname}>
						{getProfileNickname()}:
					</div>
				)}

				{message && message.message && (
					<>
						{message.message.startsWith(
							"data:image/jpeg;base64"
						) ? (
							<img
								src={message.message}
								style={{
									width: "150px",
									height: "150px",
									objectFit: "cover",
									borderRadius: "5px",
								}}
							/>
						) : (
							<div
								dir={"auto"}
								className={cc([
									styles.Message,
									!isAuthor &&
										isBlurred() &&
										message.message_type !== 'System' && 
										(isBot && !isBot()) &&
										styles["Message-blurred"],
								])}
								dangerouslySetInnerHTML={{
									__html: stripTags(message.message),
								}}
							/>
						)}
					</>
					//data:image/jpeg;base64
				)}

				{message && message.additional_params && (
					<div className={styles.Actions}>
						{getStyledMessage(message.additional_params)}
					</div>
				)}
			</div>
			<div className={styles.Info}>
				{isAuthor && (
					<>
						{messageStatus() ? (
							<div className={styles.ReadStatus}>
								<MessageStatusReadIcon />
							</div>
						) : (
							<div className={styles.ReadStatus}>
								<MessageStatusUnreadIcon />
							</div>
						)}
					</>
				)}
				{message && message.timestamp && (
					<div className={styles.Date}>
						{format(new Date(message.timestamp), "HH:mm")}{" "}
					</div>
				)}
			</div>
		</div>
	)
}

export default MessageComponent
