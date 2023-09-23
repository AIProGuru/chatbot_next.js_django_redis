import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import ChatCreateGroupPage from "@/components/TryChat/Pages/Group/Create/ChatCreateGroupPage"
import {TryClient} from "@/TryChat/Client/TryClient"
import {useContext, useEffect, useState} from "react"
import {TryContext} from "@/TryChat/TryContext"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
import {
	CreateConversationResponse,
	Room,
	RoomType,
} from "@/TryChat/@types/Conversations/Conversation"
import PageLoader from "@/components/ui/Loader/PageLoader/PageLoader"
import {useRouter} from "next/router"
import {
	checkSubscription,
	Flag,
} from "@/components/ui/Functions/CheckSubscription"

function ChatCreateGroupWrapper() {
	// const
	const router = useRouter()
	const tryClient: TryClient | undefined = useContext(TryContext)
	const userProfilesData = useGetUserProfilesInfo()

	// state
	const [clientReady, setClientReady] = useState<boolean>(false)
	const [myID, setMyID] = useState<string | undefined>(undefined)
	const [room, setRoom] = useState<Room | undefined | null>(undefined)
	const [isLoading, setIsLoading] = useState(false)

	// functions
	const emitCreateConversation = (title: string, profileIds: string[]) => {
		if (!tryClient || !myID) return
		const ids = [myID, ...profileIds]
		tryClient.emitCreateConversation(RoomType.group, ids, title)
	}

	const onConnectHandler = (event: any) => {
		console.log("socket connect", event)
	}

	const onCreateConversationHandler = (event: CreateConversationResponse) => {
		console.log("socket create_conversation", event)
		setRoom(event.room)
	}

	// effects
	useEffect(() => {
		if (userProfilesData && userProfilesData.current_profile_id) {
			setMyID(userProfilesData.current_profile_id)
		}
	}, [userProfilesData])

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

	useEffect(() => {
		if (!tryClient || !clientReady) return

		tryClient.subscribe("connect", onConnectHandler)
		tryClient.subscribe("create_conversation", onCreateConversationHandler)
	}, [tryClient, clientReady])

	useEffect(() => {
		if (room) {
			router.push(`/chat/conversation/tcid_${room.id}`).then(() => {
				setIsLoading(false)
			})
		}
	}, [room])

	useEffect(() => {
		if (!userProfilesData.current_profile_id) return
		if (
			userProfilesData.subscription &&
			userProfilesData.subscription.subscription &&
			checkSubscription(
				userProfilesData.subscription.subscription,
				Flag.chatCreateGroup
			)
		) {
			//
		} else {
			router.push("/profiles/my/subscriptions").then()
		}
	}, [userProfilesData])

	if (!tryClient || !clientReady || !myID)
		return <PageLoader canRefresh={true} />

	return (
		<ChatCreateGroupPage
			emitCreateConversation={emitCreateConversation}
			isLoading={isLoading}
			setIsLoading={setIsLoading}
		/>
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

ChatCreateGroupWrapper.requireAuth = true

export default ChatCreateGroupWrapper
