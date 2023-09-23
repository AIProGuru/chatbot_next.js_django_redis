import styles from "./ChatListPage.module.scss"
import TryChatLayer from "@/components/TryChat/Layers/TryChatLayer"
import ConversationList from "@/components/TryChat/Components/Conversations/List/ConversationList/ConversationList"
import {TryClient} from "@/TryChat/Client/TryClient"
import React, {useCallback, useContext, useEffect, useState} from "react"
import {TryContext} from "@/TryChat/TryContext"
import ChatListHeader from "@/components/TryChat/Components/Header/ChatListHeader/ChatListHeader"
import ChatPage from "@/components/TryChat/Pages/Chat/ChatPage"
import Modal from "react-modal"
import {
	CanSendMessage,
	FavoriteProfile,
	ProfilesWithImagesResponse,
	useGetFavoritesByProfilesIDsMutation,
	useGetProfilesWithImagesMutation,
	useLazyGetCanSendMessageQuery,
	UserProfile,
} from "@/services/users.service"
import {ProfileAvatar} from "@/services/images.service"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {
	DeleteMemberFromGroupResponse,
	EditMessageResponse,
	ExitGroupRoomResponse,
	GetConversationsResponse,
	GetProfileLimitsResponse,
	IConversation,
	// Limit,
	Message,
	TypingResponse,
	// RoomType,
} from "@/TryChat/@types/Conversations/Conversation"
import {useAppDispatch, useAppSelector} from "@/redux/store"
import {
	addConversations,
	clearConversations,
	clearTypings,
	deleteConversation,
	deleteMemberFromGroup,
	incrementConversationsCount,
	setCanSendMessages,
	setConversationsCount,
	setLimits,
	setTyping,
	// Typing,
	updateMessageChatList,
} from "@/redux/slices/TryChatSlice"
// import ChatCreateGroupPage from "@/components/TryChat/Pages/Group/Create/ChatCreateGroupPage"
import AdminMessage from "@/components/ui/AdminMessage/AdminMessage"
import Link from "@/components/ui/Button/Link/Link"
import {useRouter} from "next/router"
import {useTranslation} from "next-i18next"

interface ChatListPageProps {
	tabValue: number
	setTabValue: Function
}

const ChatListPage = (props: ChatListPageProps) => {
	// const
	const {tabValue, setTabValue} = props
	const tryClient: TryClient | undefined = useContext(TryContext)
	const userProfilesData = useGetUserProfilesInfo()
	const dispatch = useAppDispatch()

	// state
	// const profileTypesList: string[] = useMemo(
	// 	() => ["MAN", "WOMAN", "COUPLE"],
	// 	[]
	// )
	const profileTypesList = ["MAN", "WOMAN", "COUPLE"]

	const [clientReady, setClientReady] = useState<boolean>(false)
	const conversations: IConversation[] = useAppSelector(
		(state) => state.TryChatSlice.conversations
	)
	const conversationsCount: number = useAppSelector(
		(state) => state.TryChatSlice.conversationsCount
	)

	const canSendMessages: string[] | undefined | null = useAppSelector(
		(state) => state.TryChatSlice.canSendMessages
	)

	// const limits: Limit = useAppSelector((state) => state.TryChatSlice.limits)
	// const typings: Typing[] = useAppSelector(
	// 	(state) => state.TryChatSlice.typings
	// )
	const [currentConversation, setCurrentConversation] = useState<
		string | undefined
	>(undefined)
	const [allParticipantsInfo, setAllParticipantsInfo] = useState<
		UserProfile[]
	>([])
	const [profileAvatars, setProfileAvatars] = useState<ProfileAvatar[]>([])
	const [favoriteProfiles, setFavoriteProfiles] = useState<FavoriteProfile[]>(
		[]
	)

	const [tokenRefresh, setTokenRefresh] = useState(true)
	const [engine, setEngine] = useState<string>("no engine")
	const [createGroupModal, setCreateGroupModal] = useState<boolean>(false)
	const [myID, setMyID] = useState<string | undefined>(undefined)
	const [page, setPage] = useState(1)

	const {t} = useTranslation("site")
	const router = useRouter()
	const [open, setOpen] = useState(false)

	// rtk
	const [triggerGetProfilesWithImages] = useGetProfilesWithImagesMutation()
	const [triggerCanSendMessage] = useLazyGetCanSendMessageQuery()
	const [triggerGetFavoritesByProfilesIDs] =
		useGetFavoritesByProfilesIDsMutation()

	// functions
	const handleOpenConversationClick = (id: string) => {
		setCurrentConversation(id)
	}

	const handleCloseConversation = () => {
		setCurrentConversation(undefined)
	}

	// const emitCreateConversation = (title: string, profileIds: string[]) => {
	// 	if (!tryClient || !myID) return
	// 	const ids = [myID, ...profileIds]
	// 	tryClient.emitCreateConversation(RoomType.group, ids, title)
	// }

	const emitGetConversations = useCallback(
		(skip: number, take: number) => {
			if (!tryClient) return

			if (canSendMessages === undefined) return

			let filter: string[]

			if (canSendMessages === null) {
				switch (tabValue) {
					case 0:
						filter = profileTypesList
						break

					default:
						filter = []
						break
				}
			} else if (canSendMessages && Array.isArray(canSendMessages)) {
				switch (tabValue) {
					case 0:
						filter = profileTypesList.filter(
							(e) => !canSendMessages.includes(e)
						)
						break

					case 1:
						filter = profileTypesList.filter((e) =>
							canSendMessages.includes(e)
						)
						break

					default:
						filter = []
						break
				}
			} else {
				filter = profileTypesList
			}

			tryClient.emitGetConversations(filter, skip, take, tabValue === 1)
			// tryClient.emitGetConversations(
			// 	profileTypesList,
			// 	skip,
			// 	take,
			// 	tabValue === 1
			// )
		},
		// [tryClient, tabValue]
		[tryClient, tabValue, canSendMessages]
	)

	const emitGetProfileLimits = () => {
		if (!tryClient) return
		tryClient.emitGetProfileLimits()
	}

	const profileCached = (pid: string): boolean => {
		const search = allParticipantsInfo.find((s) => s.id === pid)
		return !!search
	}

	const getProfilesByUUID = useCallback(() => {
		// all profile ids
		const profileIDs: string[] = conversations
			.map((cnv) => {
				return cnv.profiles.map((p) => {
					return p.id
				})
			})
			.flat(1)

		// set of not cached
		const notCached = new Set<string>()

		profileIDs.forEach((pid) => {
			if (!profileCached(pid)) {
				notCached.add(pid)
			}
		})

		const notCachedArray = Array.from(notCached)

		if (notCached && notCachedArray && notCachedArray.length > 0) {
			triggerGetProfilesWithImages({
				profiles_ids: notCachedArray,
			})
				.unwrap()
				.then((r: ProfilesWithImagesResponse) => {
					setAllParticipantsInfo((prevState) => [
						...prevState,
						...r.profiles,
					])
					setProfileAvatars((prevState) => [
						...prevState,
						...r.images,
					])
				})
				.catch((e) => {
					console.log("triggerGetProfilesWithImages", e)
				})

			triggerGetFavoritesByProfilesIDs({
				profiles_ids: notCachedArray,
			})
				.unwrap()
				.then((r: FavoriteProfile[]) => {
					if (r && r.length > 0) {
						setFavoriteProfiles((prevState) => [...prevState, ...r])
					}
				})
				.catch((e) => {
					console.log(e)
				})
		}
	}, [conversations])

	// event handlers
	const onConnectHandler = (event: any) => {}

	const onGetConversationsHandler = (event: GetConversationsResponse) => {
		dispatch(
			addConversations({
				conversations: event.conversations ? event.conversations : [],
			})
		)

		dispatch(
			setConversationsCount({
				count: event.count,
			})
		)
	}

	const onCreateConversationHandler = (event: IConversation) => {
		dispatch(
			addConversations({
				conversations: [event],
			})
		)

		dispatch(incrementConversationsCount())
	}

	const onNewMessageHandler = (event: Message) => {
		setTimeout(() => {
			emitGetConversations(0, 1)
		}, 500)
	}

	const onUpdateMessageHandler = (event: EditMessageResponse) => {
		dispatch(
			updateMessageChatList({
				conversationID: event.room_id,
				timestamp: event.timestamp,
				content: event.new_message,
			})
		)
	}

	const onDeleteMemberFromGroupHandler = (
		event: DeleteMemberFromGroupResponse
	) => {
		console.log("onDeleteMemberFromGroupHandler", myID)

		dispatch(
			deleteMemberFromGroup({
				profileID: event.delete_profile_id,
			})
		)

		if (event.delete_profile_id === myID) {
			dispatch(
				deleteConversation({
					conversationID: event.room_id,
				})
			)
		}
	}

	const onExitGroupRoomHandler = (event: ExitGroupRoomResponse) => {
		if (event.is_admin) {
			dispatch(
				deleteConversation({
					conversationID: event.room_id,
				})
			)
		}
	}

	const onGetProfileLimitsHandler = (event: GetProfileLimitsResponse) => {
		dispatch(setLimits({limits: event}))
	}

	const onTypingHandler = (event: TypingResponse) => {
		dispatch(
			setTyping({
				conversationID: event.room_id,
				timestamp: new Date().getTime(),
			})
		)
	}

	// effects

	// useEffect(() => {
	// 	document.addEventListener("updateTokenEvent", (e) => {
	// 		console.log(e, "updateTokenEventupdateTokenEventupdateTokenEvent")
	// 	})
	// }, [])

	useEffect(() => {
		if (userProfilesData && userProfilesData.current_profile_id) {
			setMyID(userProfilesData.current_profile_id)
			if (userProfilesData.subscription?.subscription === "WITHOUT") {
				setOpen(true)
			}
		}
	}, [userProfilesData])

	useEffect(() => {
		if (tryClient) {
			tryClient.addEventListener("tokenRefreshEvent", (e) => {
				setTokenRefresh((prevState) => !prevState)
			})
		}
	}, [tryClient])

	useEffect(() => {
		triggerCanSendMessage({})
			.unwrap()
			.then((r: CanSendMessage) => {
				// if (r.can_send_messages) {
				// setCanSendMessages(r.can_send_messages)
				dispatch(
					setCanSendMessages({
						canSendMessages: r.can_send_messages,
					})
				)
				// }
			})
			.catch((e) => {
				console.log(e)
			})
	}, [])

	useEffect(() => {
		if (tryClient) {
			tryClient.connect()
			setClientReady(true)
		}

		return () => {
			tryClient && tryClient.disconnect()
		}
	}, [tryClient])

	useEffect(() => {
		if (tryClient && clientReady && canSendMessages !== undefined) {
			// if (tryClient && clientReady) {
			tryClient.subscribe("connect", onConnectHandler)
			tryClient.subscribe("get_conversations", onGetConversationsHandler)
			tryClient.subscribe(
				"create_conversation",
				onCreateConversationHandler
			)
			tryClient.subscribe("new_message", onNewMessageHandler)
			tryClient.subscribe("update_message", onUpdateMessageHandler)
			tryClient.subscribe(
				"delete_member_from_group_room",
				onDeleteMemberFromGroupHandler
			)
			tryClient.subscribe("get_profile_limit", onGetProfileLimitsHandler)
			tryClient.subscribe("exit_group_room", onExitGroupRoomHandler)
			tryClient.subscribe("typing", onTypingHandler)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps

		return () => {
			if (tryClient) {
				tryClient.unsubscribe("connect", onConnectHandler)
				tryClient.unsubscribe(
					"get_conversations",
					onGetConversationsHandler
				)
				tryClient.unsubscribe(
					"create_conversation",
					onCreateConversationHandler
				)
				tryClient.unsubscribe("new_message", onNewMessageHandler)
				tryClient.unsubscribe("update_message", onUpdateMessageHandler)
				tryClient.unsubscribe(
					"delete_member_from_group_room",
					onDeleteMemberFromGroupHandler
				)
				tryClient.unsubscribe(
					"get_profile_limit",
					onGetProfileLimitsHandler
				)
				tryClient.unsubscribe("exit_group_room", onExitGroupRoomHandler)
				tryClient.unsubscribe("typing", onTypingHandler)
			}
		}
	}, [tryClient, clientReady, canSendMessages, tokenRefresh])
	// }, [tryClient, clientReady, tokenRefresh])

	// useEffect(() => {
	// 	if (tryClient && clientReady) {
	// 		emitGetConversations(0, 10)
	// 	}
	// }, [tryClient, clientReady, canSendMessages])

	useEffect(() => {
		if (tryClient && clientReady) {
			dispatch(clearConversations({}))
			emitGetConversations(0, 10)
			emitGetProfileLimits()
		}
		// }, [tryClient, clientReady, tokenRefresh])
	}, [tryClient, clientReady, canSendMessages, tokenRefresh])

	useEffect(() => {
		const int = setInterval(() => {
			if (tryClient && tryClient._client && tryClient._client.io) {
				setEngine(tryClient._client.io.engine.transport.name)
			}
		}, 1000)

		return () => {
			clearInterval(int)
		}
	}, [tryClient])

	useEffect(() => {
		if (conversations && conversations.length > 0) {
			getProfilesByUUID()
		}
	}, [conversations])

	useEffect(() => {
		const debounceTyping = setInterval(() => {
			dispatch(clearTypings())
		}, 2500)

		return () => {
			clearInterval(debounceTyping)
		}
	}, [])

	return (
		<AppDefaultLayout useTabBar={true}>
			<Modal isOpen={!!currentConversation} ariaHideApp={false}>
				<div className={styles.ChatModal}>
					<ChatPage
						conversationID={currentConversation}
						closeModal={handleCloseConversation}
						reOpenModal={handleOpenConversationClick}
						tryClient={tryClient}
						userProfilesData={userProfilesData}
						emitGetConversations={emitGetConversations}
						page={page}
					/>
				</div>
			</Modal>

			{/*<Modal isOpen={createGroupModal} ariaHideApp={false}>*/}
			{/*	<div className={styles.ChatModal}>*/}
			{/*		<ChatCreateGroupPage*/}
			{/*			emitCreateConversation={emitCreateConversation}*/}
			{/*			setCreateGroupModal={setCreateGroupModal}*/}
			{/*		/>*/}
			{/*	</div>*/}
			{/*</Modal>*/}

			<TryChatLayer>
				{(!tryClient || !clientReady) && <p>Connecting...</p>}

				{tryClient && clientReady && (
					<>
						<ChatListHeader
							setCreateGroupModal={setCreateGroupModal}
							userProfilesData={userProfilesData}
						/>

						<AdminMessage
							open={open}
							setOpen={setOpen}
							text={
								// TODO: move raw text to translation
								<p>
									{`
								הינכם יכולים לקרוא הודעות במצבים הבאים:
								יש ברשותכם מנוי או
								שלפרופיל ששלח לכם הודעה יש מנוי
								או שנותרה לכם נקודת קרדיט
								`}
									<Link
										variant={"purple"}
										onClick={() =>
											router.push(
												"/profiles/my/subscriptions"
											)
										}
										styled={true}
									>
										{t("site.buy a subscription")}
									</Link>
								</p>
							}
						/>
						<ConversationList
							conversations={conversations}
							openConversation={handleOpenConversationClick}
							participantsInfo={allParticipantsInfo}
							userProfilesData={userProfilesData}
							profileAvatars={profileAvatars}
							favoriteProfiles={favoriteProfiles}
							tryClient={tryClient}
							emitGetConversations={emitGetConversations}
							conversationsCount={conversationsCount}
							tabValue={tabValue}
							setTabValue={setTabValue}
							page={page}
							setPage={setPage}
						/>
						<div
							style={{
								order: 3,
								flex: "0 1 auto",
								alignSelf: "auto",
								position: "relative",
								height: "63px",
							}}
						/>
					</>
				)}
			</TryChatLayer>
		</AppDefaultLayout>
	)
}

export default ChatListPage
