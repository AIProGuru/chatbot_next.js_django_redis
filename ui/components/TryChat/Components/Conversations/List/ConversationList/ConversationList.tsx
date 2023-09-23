import styles from "./ConversationList.module.scss"
import InfiniteScroll from "react-infinite-scroll-component"
import React, {useEffect, useState} from "react"
import {FavoriteProfile, UserProfile} from "@/services/users.service"
import ConversationItem from "@/components/TryChat/Components/Conversations/List/ConversationList/ConversationItem/ConversationItem"
import {ProfileAvatar} from "@/services/images.service"
import {useTranslation} from "next-i18next"
import {TryClient} from "@/TryChat/Client/TryClient"
import TryTabs from "@/components/ui/Tabs/TryTabs/TryTabs"
import {IConversation} from "@/TryChat/@types/Conversations/Conversation"
import {useAppDispatch} from "@/redux/store"
import {deleteConversation} from "@/redux/slices/TryChatSlice"
import {isDevMode} from "@/components/ui/Functions/IsDevMode"
import {UserInfo} from "@/redux/slices/UserInfoSlice"
import { getDirection } from "@/components/ui/Functions/GetDirection"
import {useRouter} from "next/router"

interface ConversationList {
	conversations: IConversation[]
	openConversation: Function
	participantsInfo: UserProfile[]
	profileAvatars: ProfileAvatar[]
	favoriteProfiles: FavoriteProfile[]
	userProfilesData: UserInfo
	tryClient: TryClient | undefined
	emitGetConversations: (skip: number, take: number) => void
	conversationsCount: number
	tabValue: number
	setTabValue: Function
	page: number
	setPage: Function
}

const ConversationList = (props: ConversationList) => {
	const {
		conversations,
		openConversation,
		participantsInfo,
		profileAvatars,
		favoriteProfiles,
		userProfilesData,
		tryClient,
		emitGetConversations,
		conversationsCount,
		tabValue,
		setTabValue,
		page,
		setPage
	} = props
	const {t} = useTranslation("site")
	const dispatch = useAppDispatch()
	const router = useRouter()
	const dir = getDirection(router)
	const [myID, setMyID] = useState<string | undefined>(undefined)

	const pageSize = 10
	const pages = Math.ceil(conversationsCount / pageSize)

	const loadFunc = () => {
		setTimeout(() => {
			emitGetConversations(page * pageSize, pageSize)

			if (page < pages) {
				setPage((prevState: any) => prevState + 1)
			}
		}, 100)
	}

	const emitDeleteConversation = (
		conversation: IConversation,
		isGroup: boolean = false,
		isGroupAdmin: boolean | undefined
	) => {
		if (!tryClient || !conversation) return

		if (isGroup) {
			tryClient.emitLeaveGroup(
				conversation.room.id,
				isGroupAdmin ? isGroupAdmin : false
			)
		} else {
			tryClient.emitLeaveConversation(conversation.room.id, false)
		}

		dispatch(
			deleteConversation({
				conversationID: conversation.room.id,
			})
		)
	}

	useEffect(() => {
		if (userProfilesData && userProfilesData.current_profile_id) {
			setMyID(userProfilesData.current_profile_id)
		}
	}, [userProfilesData])

	useEffect(() => {
		setPage(1)
	}, [tabValue])

	if (!myID) return null
	return (
		<>
			<div className={styles.ConversationList} id="scrollableDiv2"  dir={dir}>
				<TryTabs
					currentValue={tabValue}
					setValue={setTabValue}
					tabs={[
						{
							value: 0,
							title: t("site.Chats"),
						},
						{
							value: 1,
							title: t("site.Filtered"),
						},
					]}
				/>

				{(tabValue === 0 || tabValue === 1) && (
					<InfiniteScroll
						dataLength={conversations.length}
						next={loadFunc}
						style={{
							display: "flex",
							flexDirection: "column", //-reverse",
						}} //To put endMessage and loader to the top.
						inverse={false} //
						hasMore={page < pages}
						loader={<></>}
						scrollableTarget="scrollableDiv2"
					>
						{conversations &&
							Array.from(conversations)
								.sort((a, b) => {
									if (!a.message && !b.message) return 0

									if (
										!a.message &&
										b.message &&
										a.room.timestamp
									) {
										if (
											a.room.timestamp <
											b.message.timestamp
										)
											return -1
										if (
											a.room.timestamp >
											b.message.timestamp
										)
											return 1
										return 0
									}

									if (
										a.message &&
										!b.message &&
										b.room.timestamp
									) {
										if (
											a.message.timestamp <
											b.room.timestamp
										)
											return -1
										if (
											a.message.timestamp >
											b.room.timestamp
										)
											return 1
										return 0
									}

									if (a.message && b.message) {
										if (
											a.message.timestamp <
											b.message.timestamp
										)
											return 1
										if (
											a.message.timestamp >
											b.message.timestamp
										)
											return -1
									}

									return 0
								})
								.map((cnv) => {
									return (
										<ConversationItem
											key={cnv.room.id}
											conversation={cnv}
											openConversation={openConversation}
											myID={myID}
											participantsInfo={participantsInfo}
											profileAvatars={profileAvatars}
											favoriteProfiles={favoriteProfiles}
											emitDeleteConversation={
												emitDeleteConversation
											}
											tabValue={tabValue}
										/>
									)
								})}
					</InfiniteScroll>
				)}
			</div>
		</>
	)
}

export default ConversationList
