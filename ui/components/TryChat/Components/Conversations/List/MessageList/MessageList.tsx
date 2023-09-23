import styles from "./MessageList.module.scss"
import React, {useEffect, useState} from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import MessageItem from "@/components/TryChat/Components/Conversations/List/MessageList/MessageItem/MessageItem"
// import Spinner from "@/components/ui/Loader/Spinner/Spinner"
import {Credit, GetProfileLimitsResponse, Limit, Message, Profile} from "@/TryChat/@types/Conversations/Conversation"
import {format} from "date-fns"
import {getDateLocale} from "@/components/ui/Functions/GetDateLocale"
import {useRouter} from "next/router"
import {UserProfile} from "@/services/users.service"
import Button from "@/components/ui/Button/Button/Button"
import {useTranslation} from "next-i18next"
// import {isDevMode} from "@/components/ui/Functions/IsDevMode"
// import {Simulate} from "react-dom/test-utils"
// import timeUpdate = Simulate.timeUpdate
// import ConversationItem from "@/components/TryChat/Components/Conversations/List/ConversationList/ConversationItem/ConversationItem"
// import InfiniteScroll from "react-infinite-scroller"
// import MessageItem from "@/components/TryChat/Components/Conversations/List/MessageList/MessageItem/MessageItem"
// import {cc} from "@/components/ui/Functions/Classnames"
// import InfiniteScroll from "react-infinite-scroll-component"
// import MessagesContainer from "@/components/ui/Chats/MessagesContainer/MessagesContainer"

interface MessageListProps {
	messages: Message[]
	messagesCount: number
	myID: string
	emitGetMessages: (skip: number, take: number) => void
	emitDeleteMessage: (timestamp: number) => void
	emitReadMessages: () => void
	skipMessages: number
	autoScroll: any
	participantsInfo: UserProfile[]
	creditInfo?: Profile
	limits?: Limit
	credits?: Credit
	emitUseCredits: () => void
	isBot: () => boolean | undefined
}

const MessageList = (props: MessageListProps) => {
	const {t} = useTranslation("site")
	const {
		messages,
		myID,
		emitGetMessages,
		messagesCount,
		emitDeleteMessage,
		emitReadMessages,
		skipMessages,
		autoScroll,
		participantsInfo,
		creditInfo,
		limits,
		credits,
		emitUseCredits,
		isBot
	} = props

	const router = useRouter()
	const pageSize = 10
	const pages = Math.ceil(messagesCount / pageSize)
	const [page, setPage] = useState(2)

	const [dates, setDates] = useState<{code: string; ts: number}[]>([])

	const loadFunc = () => {
		setTimeout(() => {
			emitGetMessages(page * pageSize + skipMessages, pageSize)

			if (page < pages) {
				setPage((prevState) => prevState + 1)
			}
		}, 100)
	}

	const isInViewport = (el: any) => {
		const rect = el.getBoundingClientRect()
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <=
				(window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <=
				(window.innerWidth || document.documentElement.clientWidth)
		)
	}

	const handleMessageListScroll = (e: any) => {
		if (!autoScroll || !autoScroll.current) return
		const vp = isInViewport(autoScroll.current)

		if (vp) {
			emitReadMessages()
		}
	}

	const subscriptionOrCredits = () => {
		// todo: replace Subscribed and isConversationUnlocked with real values

		const subscribed = limits?.subscription !== "without" ? true : false // user subscription flag
		const isConversationUnlocked = creditInfo?.is_open || false // is user already bought this conversation

		if (subscribed) {
			// if subscribed - always return false, we don't have a need to show message to user
			return false
		} else {
			if (isConversationUnlocked) {
				// if user bought this conversation - also false
				return false
			} else {
				// but in all other cases - true
				return true
			}
		}
	}

	const processMessagesDates = () => {
		messages.forEach((message) => {
			const timestamp = message.timestamp
			const tsCode = format(new Date(timestamp), "yyyyQMMdd")
			const search = dates.find((s) => s.code === tsCode)

			if (!search) {
				dates.push({
					code: format(new Date(timestamp), "yyyyQMMdd"),
					ts: timestamp,
				})
			} else {
				if (search.ts > timestamp) {
					const arr = dates.slice()
					const index = arr.indexOf(search)
					arr.splice(index, 1)
					arr.push({
						code: tsCode,
						ts: timestamp,
					})
					setDates(arr)
				}
			}
		})
	}

	const renderDate = (timestamp: number) => {
		const tsCode = format(new Date(timestamp), "yyyyQMMdd")
		const currentYear = new Date().getFullYear()
		const timestampYear = new Date(timestamp).getFullYear()
		const search = dates.find((s) => s.code === tsCode)

		if (search && search.ts === timestamp) {
			return (
				<div className={styles.DateItem}>
					{currentYear === timestampYear
						? format(new Date(timestamp), "dd MMMM", {
								locale: getDateLocale(router),
						  })
						: format(new Date(timestamp), "dd MMMM yyyy", {
								locale: getDateLocale(router),
						  })}
				</div>
			)
		}
	}

	useEffect(() => {
		if (messages && messages.length > 0) {
			processMessagesDates()
		}
	}, [messages, dates])
	if (!messages || messages.length < 1) return null


	return (
		<div
			className={styles.MessagesList}
			id="scrollableDivMessageList"
			onScroll={handleMessageListScroll}
			dir={"ltr"}
		>
			<InfiniteScroll
				dataLength={messages.length}
				next={loadFunc}
				style={{
					display: "flex",
					flexDirection: "column-reverse",
					gap: "20px",
				}} //To put endMessage and loader to the top.
				inverse={true} //
				hasMore={page < pages}
				// loader={<Spinner />}
				loader={<></>}
				scrollableTarget="scrollableDivMessageList"
			>
				{subscriptionOrCredits() && !!messages.filter((message) => message.profile_id !== myID).length && !isBot() && (
					<div className={styles.SubscriptionItem}>
						{
							t("site.You cannot read the messages in this conversation")
						}
						<div className={styles.Actions}>
							<div className={styles.Button}>
								<Button
									type={"button"}
									prevent={true}
									onClick={() => credits?.credit !== 0 ? emitUseCredits() : {}}
									id={"chat_use_credits"}
									// variant={"outline"}
									border={"medium"}
									disabled={
										credits?.credit === 0 ? true : false
									}
								>
									<p className={styles.ButtonText}>
										{
											t("site.Use credits")
										}
									</p>
								</Button>
							</div>

							<div className={styles.Button}>
								<Button
									type={"button"}
									prevent={true}
									onClick={() => {
										router.push("/profiles/my/subscriptions")
									}}
									id={"chat_subscribe"}
									// variant={}
									border={"medium"}
								>
									<p className={styles.ButtonText}>
										{
											t("site.Subscribe")
										}
									</p>
								</Button>
							</div>
						</div>
					</div>
				)}

				{messages &&
					messages.map((message, index) => {
						return (
							<React.Fragment key={message.timestamp}>
								{index === 0 && <div ref={autoScroll} />}

								{message.additional_params &&
								message.additional_params.room_created ? (
									<div className={styles.DateItem}>
										{
											t("site.Conversation created")
										}
									</div>
								) : (
									<MessageItem
										key={message.timestamp}
										myID={myID}
										message={message}
										emitDeleteMessage={emitDeleteMessage}
										participantsInfo={participantsInfo}
										subscriptionOrCredits={
											subscriptionOrCredits
										}
										isBot={isBot}
									/>
								)}

								{renderDate(message.timestamp)}
							</React.Fragment>
						)
					})}
			</InfiniteScroll>
		</div>
	)
}

export default MessageList
