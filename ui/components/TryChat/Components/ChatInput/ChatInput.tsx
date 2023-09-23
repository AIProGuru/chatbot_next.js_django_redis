import styles from "./ChatInput.module.scss"
import {Controller, useForm, useWatch} from "react-hook-form"
import React, {useEffect, useMemo} from "react"
import TextAreaInput from "@/components/ui/Forms/Inputs/TextArea/TextAreaInput"
// import {isMobile} from "react-device-detect"
import {TFunction, useTranslation} from "next-i18next"
import {useAppSelector} from "@/redux/store"
import {
	GetProfileLimitsResponse,
	Limit,
	Message,
} from "@/TryChat/@types/Conversations/Conversation"

interface ChatInputProps {
	emitSendMessage: Function
	emitEditMessage: Function
	emitTyping: () => void
	isBot: () => boolean | undefined
	isBlocked: boolean
	limits: Limit
	messagesCount: number
}

type FormData = {
	message: string
}

const getPageTranslations = (t: TFunction) => {
	return {
		error: {
			forbidden: {
				common: t("site.You cant chatting with"),
				person: t("site.This person"),
				bot: t("site.BOT_NAME"),
				limit: t("site.You have reached your conversation limits for today"),
			},
		},
	}
}

const ChatInput = (props: ChatInputProps) => {
	const {
		emitSendMessage,
		emitEditMessage,
		emitTyping,
		isBot,
		isBlocked,
		limits,
		messagesCount,
	} = props
	const {t} = useTranslation("site")
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])
	const {handleSubmit, control, reset, setValue, setFocus} =
		useForm<FormData>()
	const messageInputWatch = useWatch({
		control,
		name: "message",
	})

	// state
	const editMessage: Message | undefined = useAppSelector(
		(state) => state.TryChatSlice.editMessage
	)

	const handleFormSubmit = (data: FormData) => {
		if (!data.message) return

		if (editMessage) {
			emitEditMessage(editMessage, data.message)
		} else {
			emitSendMessage(data.message)
		}

		reset({
			message: "",
		})
	}

	useEffect(() => {
		const debounceMessageWatch = setTimeout(() => {
			if (messageInputWatch) {
				emitTyping()
			}
		}, 150)

		return () => {
			clearTimeout(debounceMessageWatch)
		}
	}, [messageInputWatch])

	// edit message
	useEffect(() => {
		if (editMessage) {
			setValue("message", editMessage.message)
		}
	}, [editMessage])

	return (
		<div className={styles.ChatInput} dir={"ltr"}>
			<div className={styles.Container}>
				{isBlocked ||
				isBot() ||
				(limits.limit === 0 && messagesCount < 1) ? (
					<p className={styles.ErrorText}>
						{isBot() &&
							`${pageTranslations.error.forbidden.common} ${pageTranslations.error.forbidden.bot}`}
						{isBlocked &&
							`${pageTranslations.error.forbidden.common} ${pageTranslations.error.forbidden.person}`}
						{limits.limit === 0 &&
							pageTranslations.error.forbidden.limit}
					</p>
				) : (
					<form
					// onKeyDown={(e) => {
					// 	// if (checkKeyDown(e)) {
					// 	// 	handleSubmit(handleFormSubmit)()
					// 	// }
					// 	if (isEnter(e)) {
					// 		e.preventDefault()
					// 		setValue("message", messageInputWatch + "\n")
					// 		setFocus("message")
					// 	}
					// }}
					// onSubmit={handleSubmit(handleFormSubmit)}
					>
						<Controller
							render={({field}) => {
								return (
									<TextAreaInput
										field={field}
										placeholder={t(
											"site.Write something for a hot couple…"
										)}
										id={"message.textarea"}
										onClick={() =>
											handleSubmit(handleFormSubmit)()
										}
									/>
								)
							}}
							name={"message"}
							control={control}
							defaultValue={""}
						/>
					</form>
				)}
			</div>
		</div>
	)
}

export default ChatInput
