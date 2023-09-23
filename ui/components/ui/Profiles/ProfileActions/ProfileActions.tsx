import styles from "./ProfileActions.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
// import Button from "@/components/ui/Button/Button/Button"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
// import Link from "@/components/ui/Button/Link/Link"
import {useForm} from "react-hook-form"
import {useContext, useEffect, useState} from "react"
import InputChat from "@/components/ui/Forms/Inputs/Text/InputChat"
import {useTranslation} from "next-i18next"
import {TryClient} from "@/TryChat/Client/TryClient"
import {TryContext} from "@/TryChat/TryContext"
// import {isDevMode} from "@/components/ui/Functions/IsDevMode"
import {
	CreateConversationResponse,
	GetProfileLimitsResponse,
	IConversation,
	Limit,
	MessageType,
	Room,
	RoomType,
	SearchConversationResponse,
} from "@/TryChat/@types/Conversations/Conversation"
import Button from "@/components/ui/Button/Button/Button"
import Link from "@/components/ui/Button/Link/Link"
import {setConversation, setLimits} from "@/redux/slices/TryChatSlice"
import {useAppDispatch, useAppSelector} from "@/redux/store"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"

interface ProfileActionsProps {
	profileUsername: string
	profileID: string
	nickname: string
}

type FormData = {
	message: string
}

export type Cnv = {
	chat_id: string
	chat_name: string
	date_created: string
	date_updated: string
	last_read_message_index: number
	participants: string[]
	unread_messages_count: number
}

function ProfileActions(props: ProfileActionsProps) {
	const {t} = useTranslation("site")

	const {profileUsername, profileID, nickname} = props
	const {handleSubmit, control, reset, register} = useForm<FormData>()
	const router = useRouter()
	const dir = getDirection(router)
	const dispatch = useAppDispatch()
	const profile = useGetUserProfilesInfo()

	// tryChat
	const tryClient: TryClient | undefined = useContext(TryContext)
	const [clientReady, setClientReady] = useState<boolean>(false)
	const [room, setRoom] = useState<Room | undefined | null>(undefined)
	const [messageCount, setMessageCount] = useState<number | undefined>(
		undefined
	)
	const [sent, setSent] = useState<boolean>(false)
	const [myID, setMyID] = useState<string | undefined>(undefined)
	const limits: Limit = useAppSelector(
		(state) => state.TryChatSlice.limits
	)

	useEffect(() => {
		if (profile) {
			// setUsername(profile.username)
			if (profile.current_profile_id) {
				setMyID(profile.current_profile_id)
			}
		}
	}, [profile])

	function onFormSubmit(data: FormData) {
		if (!data.message || data.message.length < 1 || sent) return
		emitNewMessage(data)
	}

	// chat
	const emitSearchConversation = () => {
		if (!tryClient || !clientReady) return
		tryClient.emitSearchConversation(profileID)
	}

	const emitCreateConversation = () => {
		if (!tryClient || !myID || !profileID) return
		const ids = [profileID, myID]
		tryClient.emitCreateConversation(RoomType.personal, ids)
	}

	const emitGetConversation = () => {
		if (!tryClient || !room || !room.id) return
		tryClient.emitGetConversation(room.id)
	}

	const emitNewMessage = (data: FormData) => {
		if (!tryClient || !clientReady || !room || !data) return
		console.log("socket emitnewmessage after check")
		tryClient.emitNewMessage(data.message, MessageType.text, room.id)

		setSent(true)
		setTimeout(() => {
			setSent(false)
			reset({
				message: "",
			})
		}, 500)
	}

	const emitGetProfileLimits = () => {
		if (!tryClient) return
		tryClient.emitGetProfileLimits()
	}

	const onConnectHandler = (event: any) => {
		console.log("socket connect", event)
	}

	const onDisconnectHandler = (event: any) => {
		console.log("socket disconnect", event)
	}

	const onGetConversationByProfileIdHandler = (
		event: SearchConversationResponse
	) => {
		setRoom(event.room)
	}

	const onCreateConversationHandler = (event: CreateConversationResponse) => {
		console.log("socket create_conversation", event)
		setRoom(event.room)
		// setTimeout(() => {
		// 	trySendMessage(event.room)
		// }, 1000)
	}

	const onGetConversationHandler = (event: IConversation) => {
		if (event && event.message_count && event.message_count > 0) {
			setMessageCount(event.message_count)
		} else {
			setMessageCount(0)
		}
	}

	const onGetProfileLimitsHandler = (event: GetProfileLimitsResponse) => {
		dispatch(setLimits({limits: event}))
	}

	useEffect(() => {
		if (tryClient) {
			// if (isDevMode()) {
			tryClient.connect()
			setClientReady(true)
			// }
		}

		return () => {
			tryClient && tryClient.disconnect()
		}
	}, [tryClient])

	useEffect(() => {
		if (tryClient && clientReady && myID && profileID) {
			tryClient.subscribe("connect", onConnectHandler)
			tryClient.subscribe("disconnect", onDisconnectHandler)
			tryClient.subscribe(
				"conversation_by_profile_id",
				onGetConversationByProfileIdHandler
			)
			tryClient.subscribe(
				"create_conversation",
				onCreateConversationHandler
			)
			tryClient.subscribe("get_conversation", onGetConversationHandler)
			tryClient.subscribe("get_profile_limit", onGetProfileLimitsHandler)
		}

		return () => {
			dispatch(
				setConversation({
					conversation: undefined,
				})
			)

			if (tryClient) {
				tryClient.unsubscribe("connect", onConnectHandler)
				tryClient.unsubscribe("disconnect", onDisconnectHandler)
				tryClient.unsubscribe(
					"conversation_by_profile_id",
					onGetConversationByProfileIdHandler
				)
				tryClient.unsubscribe(
					"create_conversation",
					onCreateConversationHandler
				)
				tryClient.unsubscribe(
					"get_conversation",
					onGetConversationHandler
				)
				tryClient.unsubscribe(
					"get_profile_limit",
					onGetProfileLimitsHandler
				)
			}
		}
	}, [tryClient, clientReady, myID, profileID])

	useEffect(() => {
		if (clientReady && profileID) {
			emitSearchConversation()
		}
	}, [profileID, clientReady])

	useEffect(() => {
		if (!tryClient) return
		if (room === null) {
			console.log("socket need to create room")
			emitCreateConversation()
		}
	}, [tryClient, room])

	useEffect(() => {
		if (!tryClient || !room || !room.id) return
		emitGetConversation()
		emitGetProfileLimits()
	}, [tryClient, room])

	if (!myID || !profileID) return null
	if (!clientReady)
		return <p className={styles.ChatLoading}>{t("site.Loading chat...")}</p>
	if (!room)
		return (
			<div className={styles.RoomLoading}>
				<p>{t("site.Loading chat... took a long time?")}</p>
				<Button
					type={"button"}
					onClick={() => {
						router.reload()
					}}
				>
					<p className={styles.RoomReloadText}>{t("site.reload")}</p>
				</Button>
			</div>
		)

	if (limits.limit === 0 && messageCount !== undefined && messageCount < 1) {
		return (
			<div className={styles.ChatError}>
				<p>{t("site.You have reached your conversation limits for today")}</p>
				<Button
					type={"button"}
					onClick={() => {
						router.push("/profiles/my/subscriptions").then()
					}}
				>
					<p className={styles.UpgradeText}>Upgrade subscription</p>
				</Button>
			</div>
		)
	}

	return (
		<div className={cc([styles.ProfileActions, dir && styles[dir]])} style={{direction: dir === "ltr" ? "ltr" : "rtl"}}>
			{/*{profile && client ? (*/}
			<form onSubmit={handleSubmit(onFormSubmit)}>
				<div className={styles.ButtonActions}>
					{/*<input type="text" {...register("message")} />*/}
					<InputChat
						placeholder={t("site.Send a message to a hot couple")}
						register={register("message")}
						sent={sent}
					/>
				</div>
			</form>
			{/*) : (*/}
			{/*	<div className={styles.History}>*/}
			{/*		<Link>Loading chat...</Link>*/}
			{/*	</div>*/}
			{/*)}*/}
			{room && room.id && messageCount !== undefined && messageCount > 0 && (
				<div className={styles.History}>
					<Link
						id={"link_history"}
						onClick={() => {
							// if (tryClient) {
							// 	tryClient.disconnect()
							// }

							setTimeout(() => {
								router
									.push(`/chat/conversation/tcid_${room.id}`)
									.then()
							}, 1000)
						}}
					>
						{t(
							"site.You have historically posts with a fiery couple"
						)}{" "}
						<b>{nickname}</b>
					</Link>
				</div>
			)}
		</div>
	)
}

export default ProfileActions
