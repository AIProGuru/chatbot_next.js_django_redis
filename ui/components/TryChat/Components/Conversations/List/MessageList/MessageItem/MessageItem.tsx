import styles from "./MessageItem.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {useMemo, useState} from "react"
import MessageComponent from "@/components/TryChat/Components/Conversations/List/MessageList/MessageItem/Message/MessageComponent"
import Options from "@/components/TryChat/Components/Conversations/List/MessageList/MessageItem/Options/Options"
import {Message} from "@/TryChat/@types/Conversations/Conversation"
import {TFunction, useTranslation} from "next-i18next"
import {useAppDispatch, useAppSelector} from "@/redux/store"
import {editMessage} from "@/redux/slices/TryChatSlice"
import {UserProfile} from "@/services/users.service"

interface MessageItemProps {
	myID: string
	message: Message
	emitDeleteMessage: (timestamp: number) => void
	participantsInfo: UserProfile[]
	subscriptionOrCredits: () => boolean
	isBot: () => boolean | undefined
}

const getPageTranslations = (t: TFunction) => {
	return {
		message: {
			edit: t("site.Edit message"), // edit
			delete: t("site.Delete message"), // delete
			view_recommendations: t("site.chat_view_recommendations"),
		},
	}
}

function MessageItem(props: MessageItemProps) {
	const {
		myID,
		message,
		emitDeleteMessage,
		participantsInfo,
		subscriptionOrCredits,
		isBot
	} = props
	const {t} = useTranslation("site")
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])
	const dispatch = useAppDispatch()

	// state
	const conversation = useAppSelector(
		(state) => state.TryChatSlice.conversation
	)
	const [showOptions, setShowOptions] = useState(false)
	// const [lastReadMessage, setLastReadMessage] = useState<number | undefined>(
	// 	undefined
	// )

	// functions
	const isAuthor = (): boolean => {
		return myID === message.profile_id
	}

	const options = [
		{
			id: 4,
			title: pageTranslations.message.edit, // edit
			author: true,
			onClick: () => {
				dispatch(
					editMessage({
						message: message,
					})
				)
			},
		},
		{
			id: 5,
			title: pageTranslations.message.delete, // delete
			author: true,
			onClick: () => {
				emitDeleteMessage(message.timestamp)
			},
		},
	]

	const getProfile = (id: string) => {
		const search = participantsInfo.find((s) => s.id === id)

		if (search) {
			return search
		}
	}

	// useEffect(() => {
	// 	if (!conversation || !conversation.room_unread_message_id) return
	// 	setLastReadMessage(conversation.room_unread_message_id)
	// }, [conversation])

	// const isAuthor = useMemo(() => {
	// 	return Boolean(Math.random() > 0.5)
	// }, [])

	return (
		<>
			<div
				className={cc([
					styles.MessageItem,
					isAuthor() && styles["MessageItem-author"],
				])}
			>
				<MessageComponent
					setShowOptions={setShowOptions}
					isAuthor={isAuthor()}
					message={message}
					profile={getProfile(message.profile_id)}
					subscriptionOrCredits={subscriptionOrCredits}
					isBot={isBot}
					// lastReadMessage={lastReadMessage}
				/>
			</div>

			{showOptions && (
				<Options
					setShowOptions={setShowOptions}
					isAuthor={isAuthor()}
					message={message}
					options={options}
					subscriptionOrCredits={subscriptionOrCredits}
					// lastReadMessage={lastReadMessage}
				/>
			)}
		</>
	)
}

export default MessageItem
