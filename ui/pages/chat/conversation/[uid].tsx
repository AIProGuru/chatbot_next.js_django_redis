// import ChatPage from "@/components/TryChat/Pages/Chat/ChatPage"
import {useRouter} from "next/router"
import ChatPage from "@/components/TryChat/Pages/Chat/ChatPage"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {TryClient} from "@/TryChat/Client/TryClient"
import React, {useContext, useEffect, useState} from "react"
import {TryContext} from "@/TryChat/TryContext"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
import {
	CreateConversationResponse,
	Room,
	RoomType,
	// SearchConversationResponse,
} from "@/TryChat/@types/Conversations/Conversation"
import PageLoader from "@/components/ui/Loader/PageLoader/PageLoader"

interface ConversationPageProps {
	modalChatID?: string
}

const ConversationPage = (props: ConversationPageProps) => {
	const {modalChatID} = props
	const router = useRouter()
	const {uid} = router.query

	const urlID = modalChatID || uid

	// const conversationID = uid && !Array.isArray(uid) ? uid : ""

	const tryClient: TryClient | undefined = useContext(TryContext)
	const userProfilesData = useGetUserProfilesInfo()

	// state
	const [clientReady, setClientReady] = useState<boolean>(false)
	const [conversationID, setConversationID] = useState<
		string | undefined | null
	>(undefined)
	const [room, setRoom] = useState<Room | undefined | null>(undefined)
	const [profileID, setProfileID] = useState<string | undefined>(undefined)
	const [myID, setMyID] = useState<string | undefined>(undefined)
	const [canChangeRoom, setCanChangeRoom] = useState<boolean | undefined>(
		undefined
	)

	const getConversationID = () => {
		if (
			!urlID ||
			Array.isArray(urlID) ||
			!userProfilesData ||
			!userProfilesData.current_profile_id
		) {
			setConversationID(null)
			return
		}

		// trychat id
		if (urlID.startsWith("tcid_")) {
			const cid = urlID.split("_")
			setConversationID(cid[1])
			setCanChangeRoom(false)
			return
		}

		// user profile id
		if (urlID.startsWith("upid_")) {
			const pid = urlID.split("_")
			setProfileID(pid[1])

			const mid = userProfilesData.current_profile_id
			setMyID(mid)

			setCanChangeRoom(true)
			return
		}

		setConversationID(null)
	}

	const emitCreateConversation = () => {
		if (!tryClient || !myID || !profileID) return
		const ids = [profileID, myID]
		tryClient.emitCreateConversation(RoomType.personal, ids)
	}

	// effects
	useEffect(() => {
		if (tryClient) {
			setTimeout(() => {
				tryClient.connect()
				setClientReady(true)
			}, 500)
		}

		return () => {
			tryClient && tryClient.disconnect()
		}
	}, [tryClient])

	const onConnectHandler = (event: any) => {
		console.log("socket connect", event)
	}

	const onDisconnectHandler = (event: any) => {
		console.log("socket disconnect", event)
	}

	const onCreateConversationHandler = (event: CreateConversationResponse) => {
		console.log("socket create_conversation", event)
		if (canChangeRoom) {
			setRoom(event.room)
			setCanChangeRoom(false)
		}
	}

	useEffect(() => {
		if (tryClient && clientReady) {
			tryClient.subscribe("connect", onConnectHandler)
			tryClient.subscribe("disconnect", onDisconnectHandler)
			tryClient.subscribe(
				"create_conversation",
				onCreateConversationHandler
			)
		}

		return () => {
			if (tryClient) {
				tryClient.unsubscribe("connect", onConnectHandler)
				tryClient.unsubscribe("disconnect", onDisconnectHandler)
				tryClient.unsubscribe(
					"create_conversation",
					onCreateConversationHandler
				)
			}
		}
	}, [clientReady, canChangeRoom])

	// 1 - if we have current user data and uid, we can try to get id of conversation
	useEffect(() => {
		if (userProfilesData && urlID) {
			getConversationID()
		}
	}, [userProfilesData, urlID])

	// 2 - in different cases it maybe id of conversation in url or profile id, so if detected profile id, try to create (search) conversation
	useEffect(() => {
		if (profileID && myID) {
			emitCreateConversation()
		}
	}, [myID, profileID])

	// 3 - after searching conversation, we need to put id into state, and continue loading
	useEffect(() => {
		if (room) {
			setConversationID(room.id)
		}
	}, [room])

	// if (conversationID === null) return <p>Wrong conversation ID</p>
	// if (conversationID === undefined) return <p>Loading...</p>
	const emitGetConversations = (skip: any, page_size: any) => {
		return
	}

	if (!conversationID)
		return (
			<>
				<PageLoader canRefresh={true} />
			</>
		)

	return (
		<>
			{(!tryClient || !clientReady) && <p>Connecting...</p>}

			{tryClient && clientReady && (
				<ChatPage
					conversationID={conversationID}
					closeModal={() => {
						router.back()
					}}
					tryClient={tryClient}
					userProfilesData={userProfilesData}
					emitGetConversations={emitGetConversations}
					page={1}
				/>
			)}
		</>
	)
}

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default ConversationPage
