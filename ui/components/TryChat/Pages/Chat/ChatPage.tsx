import TryChatLayer from "@/components/TryChat/Layers/TryChatLayer"
import MessageList from "@/components/TryChat/Components/Conversations/List/MessageList/MessageList"
import ChatHeader from "@/components/TryChat/Components/Header/ChatHeader/ChatHeader"
import ChatInput from "@/components/TryChat/Components/ChatInput/ChatInput"
import {TryClient} from "@/TryChat/Client/TryClient"
import {useCallback, useEffect, useRef, useState} from "react"
import {
	// GetUserProfilesInfo,
	IsFavoriteProfileResponse,
	ProfileIsBlockResponse,
	ProfilesWithImagesResponse,
	useGetProfilesWithImagesMutation,
	useLazyGetIsFavoriteProfileQuery,
	useLazyProfileIsBlockQuery,
	UserProfile,
} from "@/services/users.service"
import PageLoader from "@/components/ui/Loader/PageLoader/PageLoader"
import {
	Credit,
	DeleteMemberFromGroupResponse,
	DeleteMessageResponse,
	EditMessageResponse,
	ExitGroupRoomResponse,
	GetMessagesResponse,
	GetProfileLimitsResponse,
	IConversation,
	Limit,
	Message,
	MessageType,
	ReadMessagesResponse,
	RoomType,
	TypingResponse,
} from "@/TryChat/@types/Conversations/Conversation"
import {ProfileAvatar} from "@/services/images.service"
import {useAppDispatch, useAppSelector} from "@/redux/store"
import {
	clearMessages,
	deleteConversation,
	deleteMemberFromGroup,
	deleteMessage,
	editMessage,
	newMessage,
	setConversation,
	setLastMessage,
	setLastReadMessage,
	setLimits,
	setMessages,
	updateConversationCounter,
	updateMessage,
} from "@/redux/slices/TryChatSlice"
import {UserInfo} from "@/redux/slices/UserInfoSlice"
import styles from "@/components/TryChat/Pages/ChatList/ChatListPage.module.scss"
import Modal from "react-modal"
import EditGroupPage from "@/components/TryChat/Pages/Group/Edit/EditGroupPage"
import {useRouter} from "next/router"
import {checkIsGroupAdmin} from "@/components/TryChat/Functions/checkIsGroupAdmin"

interface ChatPageProps {
	conversationID: string | string[] | undefined
	closeModal: Function | undefined
	reOpenModal?: Function | undefined
	tryClient: TryClient | undefined
	userProfilesData: UserInfo
	emitGetConversations: (skip: number, take: number) => void
	page: number
}

// type x

const ChatPage = (props: ChatPageProps) => {
	// props
	const {conversationID, closeModal, tryClient, userProfilesData, reOpenModal, emitGetConversations, page} = props
	const router = useRouter()
	const dispatch = useAppDispatch()

	// state
	const conversation: IConversation | undefined = useAppSelector(
		(state) => state.TryChatSlice.conversation
	)
	const messages: Message[] = useAppSelector(
		(state) => state.TryChatSlice.messages
	)
	const limits: Limit = useAppSelector(
		(state) => state.TryChatSlice.limits
	)

	const credits: Credit = useAppSelector(
		(state) => state.TryChatSlice.credits
	)
	const [myID, setMyID] = useState<string | undefined>(undefined)
	const [participantID, setParticipantID] = useState<string | undefined>(
		undefined
	)
	const [isTyping, setIsTyping] = useState<boolean>(false)
	const [participantsInfo, setParticipantsInfo] = useState<UserProfile[]>([])
	const [profileAvatars, setProfileAvatars] = useState<ProfileAvatar[]>([])
	const [skipMessages, setSkipMessages] = useState<number>(0)
	const [favorite, setFavorite] = useState<boolean>(false)
	const [isBlocked, setIsBlocked] = useState<boolean>(false)
	const autoScroll = useRef<HTMLDivElement>(null)
	const [editGroupModal, setEditGroupModal] = useState<boolean>(false)

	// rtk
	const [triggerGetProfilesWithImages] = useGetProfilesWithImagesMutation()
	const [triggerIsFavorite] = useLazyGetIsFavoriteProfileQuery()
	const [triggerIsBlock] = useLazyProfileIsBlockQuery()

	// functions
	const isBot: () => boolean | undefined = useCallback(() => {
		if (!conversation) return
		return conversation.room.is_bot_room
	}, [conversation])

	const isPersonal: () => boolean | undefined = useCallback(() => {
		if (!conversation) return
		return !isBot() && conversation.room.room_type === RoomType.personal
	}, [conversation])

	const isGroup: () => boolean | undefined = useCallback(() => {
		if (!conversation) return
		return conversation.room.room_type === RoomType.group
	}, [conversation])

	// const isGroupAdmin: () => boolean | undefined = useCallback(() => {
	// 	if (!conversation) return
	// 	const search = conversation.profiles.find((s) => s.id === myID)
	// 	if (search) {
	// 		return search.is_admin
	// 	} else {
	// 		return false
	// 	}
	// }, [conversation, myID])
	const isGroupAdmin = useCallback(() => {
		if (!conversation || !myID) return
		return checkIsGroupAdmin(conversation, myID)
	}, [conversation, myID])

	const getParticipantsInfo = () => {
		if (!conversation) return
		if (isPersonal() || isGroup()) {
			triggerGetProfilesWithImages({
				profiles_ids: conversation.profiles.map((p) => {
					return p.id
				}),
			})
				.unwrap()
				.then((r: ProfilesWithImagesResponse) => {
					setParticipantsInfo(r.profiles)
					setProfileAvatars(r.images)
				})
				.catch((e) => {
					console.log("triggerGetProfilesWithImages", e)
				})
		}
	}

	const emitGetConversation = () => {
		if (!tryClient || !conversationID || Array.isArray(conversationID))
			return
		tryClient.emitGetConversation(conversationID)
	}

	const emitGetMessages = (skip: number, take: number) => {
		if (!tryClient || !conversation) return
		tryClient.emitGetMessages(conversation.room.id, skip, take)
	}

	const emitReadMessages = () => {
		if (!tryClient || !conversation) return
		tryClient.emitReadMessages(conversation.room.id)
		dispatch(
			updateConversationCounter({
				conversationID: conversation.room.id,
			})
		)
		// dispatch()
	}

	const emitUseCredits = () => {
		if (!tryClient || !conversation) return
		tryClient.emitUseCredits(conversation.room.id)
		if (closeModal && reOpenModal) {
			closeModal()
			setTimeout(() => {
				reOpenModal(conversation.room.id)
			}, 100);
		} else {
			router.reload()
		}
	}

	const emitNewMessage = (content: string) => {
		if (
			!tryClient ||
			!conversationID ||
			Array.isArray(conversationID) ||
			!conversation
		)
			return

		tryClient.emitNewMessage(content, MessageType.text, conversationID)
		emitReadMessages()

		setTimeout(() => {
			scrollDown()
		}, 500)
	}

	const emitEditMessage = (currentMessage: Message, content: string) => {
		if (!tryClient || !conversation) return
		tryClient.emitEditMessage(
			conversation.room.id,
			currentMessage.timestamp,
			content
		)

		dispatch(
			editMessage({
				message: undefined,
			})
		)
	}

	const emitTyping = () => {
		if (!tryClient || !conversation) return
		tryClient.emitTyping(conversation.room.id)
	}

	const emitDeleteMessage = (timestamp: number) => {
		if (!tryClient || !conversation) return
		tryClient.emitDeleteMessage(conversation.room.id, timestamp)
	}

	const emitDeleteConversation = (isGroup: boolean = false) => {
		if (!tryClient || !conversation) return

		if (isGroup) {
			tryClient.emitLeaveGroup(conversation.room.id, !!isGroupAdmin())
			closeModal ? closeModal() : router.push("/chat").then()
		} else {
			tryClient.emitLeaveConversation(conversation.room.id, false)
		}

		dispatch(
			deleteConversation({
				conversationID: conversation.room.id,
			})
		)
	}

	const emitDeleteMemberFromGroup = (profileID: string) => {
		if (!tryClient || !conversation) return

		if (isGroup() && isGroupAdmin()) {
			tryClient.emitDeleteMemberFromGroup(conversation.room.id, profileID)
			// dispatch(
			// 	deleteMemberFromGroup({
			// 		profileID: profileID,
			// 	})
			// )
		}
	}

	const emitGetProfileLimits = () => {
		if (!tryClient) return
		tryClient.emitGetProfileLimits()
	}

	function scrollDown() {
		autoScroll &&
			autoScroll.current &&
			autoScroll.current.scrollIntoView({behavior: "smooth"})
	}

	const onGetMessagesHandler = (event: GetMessagesResponse) => {
		dispatch(
			setMessages({
				messages: event.messages,
			})
		)
	}

	const onNewMessageHandler = (event: Message) => {
		if (conversation && event.room_id === conversation.room.id) {
			dispatch(
				newMessage({
					message: event,
				})
			)
			setSkipMessages((prevState) => prevState + 1)
		}
	}

	const onTypingHandler = (event: TypingResponse) => {
		if (conversation && event.room_id === conversation.room.id) {
			setIsTyping(true)
		}
	}

	const onDeleteMessageHandler = (event: DeleteMessageResponse) => {
		dispatch(
			deleteMessage({
				timestamp: event.timestamp,
			})
		)
		setSkipMessages((prevState) => (prevState < 1 ? 0 : prevState - 1))
	}

	const onReadMessagesHandler = (event: ReadMessagesResponse) => {
		dispatch(
			setLastReadMessage({
				messageID: new Date().getTime(),
				roomID: event.room_id,
			})
		)
	}

	const onUpdateMessageHandler = (event: EditMessageResponse) => {
		dispatch(
			updateMessage({
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
			try {
				dispatch(
					deleteConversation({
						conversationID: event.room_id,
					})
				)
			} catch (e) {}

			closeModal ? closeModal() : router.push("/chat").then()
		}
	}

	const onExitGroupRoomHandler = (event: ExitGroupRoomResponse) => {
		if (event.is_admin) {
			try {
				dispatch(
					deleteConversation({
						conversationID: event.room_id,
					})
				)
			} catch (e) {}

			closeModal ? closeModal() : router.push("/chat").then()
		}
	}

	const onGetProfileLimitsHandler = (event: GetProfileLimitsResponse) => {
		dispatch(setLimits({limits: event}))
	}

	// effects
	useEffect(() => {
		if (!tryClient) return

		tryClient.subscribe("get_conversation", (event: IConversation) => {
			dispatch(
				setConversation({
					conversation: event,
				})
			)

			dispatch(
				setLastReadMessage({
					// messageID: event.room_unread_message_timestamp
					// 	? event.room_unread_message_timestamp
					// 	: event.last_message_timestamp,
					messageID: event.room_unread_message_timestamp,
					roomID: event.room.id,
				})
			)

			dispatch(
				setLastMessage({
					messageID: event.last_message_timestamp
						? event.last_message_timestamp
						: new Date().getTime(),
				})
			)
		})

		return () => {
			dispatch(
				setConversation({
					conversation: undefined,
				})
			)
		}
	}, [tryClient])

	useEffect(() => {
		if (!tryClient) return
		tryClient.subscribe("get_profile_limit", onGetProfileLimitsHandler)

		return () => {
			tryClient.unsubscribe(
				"get_profile_limit",
				onGetProfileLimitsHandler
			)
		}
	}, [tryClient]);


	useEffect(() => {
		if (!tryClient || !conversation) return

		tryClient.subscribe("get_messages", onGetMessagesHandler)
		tryClient.subscribe("new_message", onNewMessageHandler)
		tryClient.subscribe("typing", onTypingHandler)
		tryClient.subscribe("delete_message", onDeleteMessageHandler)
		tryClient.subscribe("read_messages", onReadMessagesHandler)
		tryClient.subscribe("update_message", onUpdateMessageHandler)
		tryClient.subscribe(
			"delete_member_from_group_room",
			onDeleteMemberFromGroupHandler
		)
		tryClient.subscribe("exit_group_room", onExitGroupRoomHandler)

		return () => {
			dispatch(
				editMessage({
					message: undefined,
				})
			)

			dispatch(clearMessages({}))

			tryClient.unsubscribe("get_messages", onGetMessagesHandler)
			tryClient.unsubscribe("new_message", onNewMessageHandler)
			tryClient.unsubscribe("typing", onTypingHandler)
			tryClient.unsubscribe("delete_message", onDeleteMessageHandler)
			tryClient.unsubscribe("read_messages", onReadMessagesHandler)
			tryClient.unsubscribe("update_message", onUpdateMessageHandler)
			tryClient.unsubscribe(
				"delete_member_from_group_room",
				onDeleteMemberFromGroupHandler
			)
			tryClient.unsubscribe("exit_group_room", onExitGroupRoomHandler)
		}
	}, [tryClient, conversation])

	useEffect(() => {
		return () => {
			if (conversation) {
				emitReadMessages()
			}
		}
	}, [conversation])

	useEffect(() => {
		if (!tryClient || !conversationID || Array.isArray(conversationID))
			return

		emitGetConversation()
		emitGetProfileLimits()
	}, [tryClient, conversationID])

	useEffect(() => {
		if (!conversation) return
		emitGetMessages(0, 20)
		emitReadMessages()
	}, [conversation])

	useEffect(() => {
		if (userProfilesData && userProfilesData.current_profile_id) {
			setMyID(userProfilesData.current_profile_id)
		}
	}, [userProfilesData])

	useEffect(() => {
		const debounceTyping = setTimeout(() => {
			setIsTyping(false)
		}, 5000)

		return () => {
			clearTimeout(debounceTyping)
		}
	}, [isTyping])

	useEffect(() => {
		if (conversation && myID && isPersonal()) {
			conversation.profiles.map((profile) => {
				if (profile.id !== myID) {
					setParticipantID(profile.id)
				}
			})
		}
	}, [conversation, myID])

	useEffect(() => {
		if (!conversation) return
		getParticipantsInfo()
	}, [conversation])

	useEffect(() => {
		if (!conversation || !participantID) return

		triggerIsBlock({
			page: 1,
			pageSize: 10,
			profile_id: participantID,
		})
			.unwrap()
			.then((r: ProfileIsBlockResponse) => {
				console.log("triggerIsBlock", r)
				setIsBlocked(r.detail)
			})
			.catch((e) => {
				console.log(e)
			})
	}, [conversation, participantID])

	useEffect(() => {
		if (isPersonal() && participantID) {
			triggerIsFavorite({
				profileId: participantID,
			})
				.unwrap()
				.then((r: IsFavoriteProfileResponse) => {
					if (r && r.count > 0) {
						setFavorite(true)
					}
				})
				.catch((e) => {
					console.log(e)
				})
		}
	}, [participantID])

	if (!conversation || !myID)
		return (
			<>
				<PageLoader canRefresh={true} />
			</>
		)

	return (
		<>
			<Modal isOpen={editGroupModal} ariaHideApp={false}>
				<div className={styles.ChatModal}>
					<EditGroupPage
						setEditGroupModal={setEditGroupModal}
						profiles={participantsInfo}
						avatars={profileAvatars}
						conversation={conversation}
						emitDeleteConversation={emitDeleteConversation}
						emitDeleteMemberFromGroup={emitDeleteMemberFromGroup}
						isGroupAdmin={isGroupAdmin}
						myID={myID}
					/>
				</div>
			</Modal>

			<TryChatLayer>
				<ChatHeader
					conversation={conversation}
					closeModal={closeModal}
					isTyping={isTyping}
					myID={myID}
					participantID={participantID}
					participantsInfo={participantsInfo}
					profileAvatars={profileAvatars}
					isPersonal={isPersonal}
					isGroup={isGroup}
					isBot={isBot}
					favorite={favorite}
					setEditGroupModal={setEditGroupModal}
					emitGetConversations={emitGetConversations}
					page={page}
				/>

				<MessageList
					messages={messages}
					messagesCount={
						(conversation && conversation.message_count) || 0
					}
					myID={myID}
					emitGetMessages={emitGetMessages}
					emitDeleteMessage={emitDeleteMessage}
					emitReadMessages={emitReadMessages}
					skipMessages={skipMessages}
					autoScroll={autoScroll}
					limits={limits}
					credits={credits}
					emitUseCredits={emitUseCredits}
					creditInfo={
						conversation &&
						userProfilesData &&
						conversation.profiles.find(
							(profile) =>
								profile.id ===
								userProfilesData.current_profile_id
						)
					}
					participantsInfo={isGroup() ? participantsInfo : []}
					isBot={isBot}
				/>

				<ChatInput
					emitSendMessage={emitNewMessage}
					emitEditMessage={emitEditMessage}
					emitTyping={emitTyping}
					isBot={isBot}
					isBlocked={isBlocked}
					limits={limits}
					messagesCount={
						(conversation && conversation.message_count) || 0
					}
				/>
			</TryChatLayer>
		</>
	)
}

export default ChatPage
