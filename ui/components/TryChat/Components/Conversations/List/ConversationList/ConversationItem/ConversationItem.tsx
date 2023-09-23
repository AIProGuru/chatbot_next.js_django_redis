import styles from "./ConversationItem.module.scss"
import React, {useCallback, useEffect, useState} from "react"
import {FavoriteProfile, UserProfile} from "@/services/users.service"
import ItemLoader from "@/components/TryChat/Components/Conversations/List/ConversationList/ConversationItem/ItemLoader/ItemLoader"
import {ProfileAvatar} from "@/services/images.service"
import {
	SwipeableList,
	SwipeableListItem,
	Type as ListType,
} from "react-swipeable-list"
import VerifiedIcon from "@/components/ui/Icons/VerifiedIcon"
// import ChatFavouriteIcon from "@/components/ui/Icons/ChatFavouriteIcon"
import FemaleIcon from "@/components/ui/Icons/FemaleIcon"
import MaleIcon from "@/components/ui/Icons/MaleIcon"
import NetworkStatusIcon from "@/components/ui/Icons/NetworkStatusIcon"
import MessageCount from "@/components/ui/Chats/MessageCount/MessageCount"
// import Divider from "@/components/ui/Divider/Divider"
import {useTranslation} from "next-i18next"
import ItemActions from "@/components/TryChat/Components/Conversations/List/ConversationList/ConversationItem/ItemActions/ItemActions"
import "react-swipeable-list/dist/styles.css"
import {
	IConversation,
	RoomType,
} from "@/TryChat/@types/Conversations/Conversation"
import {
	format,
	// formatDistance
} from "date-fns"
import {getDateLocale} from "@/components/ui/Functions/GetDateLocale"
import {useRouter} from "next/router"
import {cc} from "@/components/ui/Functions/Classnames"
import {useAppSelector} from "@/redux/store"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import ChatFavouriteIcon from "@/components/ui/Icons/ChatFavouriteIcon"
import {checkIsGroupAdmin} from "@/components/TryChat/Functions/checkIsGroupAdmin"
import {Typing} from "@/redux/slices/TryChatSlice"
import SubVipSmallIcon from "@/components/ui/Icons/SubVipSmall/SubVipSmallIcon"
import IsReadIcon from "@/components/ui/Icons/IsRead/IsReadIcon"
import IsNoReadIcon from "@/components/ui/Icons/IsNoRead/IsNoReadIcon"
// import Image from "next/image"

interface ConversationItemProps {
	conversation: IConversation
	openConversation: Function
	myID: string
	participantsInfo: UserProfile[]
	profileAvatars: ProfileAvatar[]
	favoriteProfiles: FavoriteProfile[]
	emitDeleteConversation: (
		conversation: IConversation,
		isGroup: boolean,
		isGroupAdmin: boolean | undefined
	) => void
	tabValue: number
}

function ConversationItem(props: ConversationItemProps) {
	// props
	const {
		conversation,
		openConversation,
		myID,
		participantsInfo,
		profileAvatars,
		favoriteProfiles,
		emitDeleteConversation,
		tabValue,
	} = props
	const {t} = useTranslation("site")
	const router = useRouter()
	const dir = getDirection(router)

	// state
	const [participantID, setParticipantID] = useState<string | undefined>(
		undefined
	)
	const [participantProfileInfo, setParticipantProfileInfo] = useState<
		UserProfile | undefined
	>(undefined)
	const [conversationName, setConversationName] = useState<
		string | undefined
	>(undefined)
	const [conversationImage, setConversationImage] = useState<
		string | undefined
	>(undefined)
	const [stopLoading, setStopLoading] = useState<boolean>(false)
	const canSendMessages: string[] | undefined | null = useAppSelector(
		(state) => state.TryChatSlice.canSendMessages
	)
	const typings: Typing[] = useAppSelector(
		(state) => state.TryChatSlice.typings
	)
	// const [isTyping, setIsTyping] = useState(false)

	// functions
	const isBot = (): boolean => conversation.room.is_bot_room
	const isRead = (): boolean =>
		conversation.profiles.find((user) => myID === user.id)?.is_read || false
	const isPersonal = (): boolean =>
		!isBot() && conversation.room.room_type === RoomType.personal
	const isGroup = (): boolean =>
		conversation.room.room_type === RoomType.group
	const isTyping = useCallback(() => {
		return conversation
			? typings.find((s) => s.conversationID === conversation.room.id)
			: false
	}, [conversation, typings])

	const isGroupAdmin = useCallback(() => {
		if (!conversation || !myID) return
		return checkIsGroupAdmin(conversation, myID)
	}, [conversation, myID])

	const getConversationTitle = () => {
		if (isPersonal()) {
			const search = participantsInfo.find((s) => s.id === participantID)

			if (search) {
				setParticipantProfileInfo(search)
				const nickname = getProfileNickname(search)
				setConversationName(nickname)
			}

			return
		}

		setConversationName("empty_conversation_name")
	}

	const getConversationTitleBot = () => {
		setConversationName(t(`site.BOT_NAME`))
	}

	const getConversationTitleGroup = () => {
		conversation.room.name && setConversationName(conversation.room.name)
	}

	const getProfileNickname = (profile: UserProfile) => {
		const username = profile.user_username

		switch (profile.profile_type) {
			case "WOMAN":
				if (profile && profile.woman && profile.woman.nickname) {
					return profile.woman.nickname
				} else {
					return username
				}

			case "MAN":
				if (profile && profile.man && profile.man.nickname) {
					return profile.man.nickname
				} else {
					return username
				}

			case "COUPLE":
				if (profile && profile.couple_nickname) {
					return profile.couple_nickname
				} else {
					return username
				}

			default:
				return username
		}
	}

	const getConversationImage = () => {
		if (isPersonal() && participantProfileInfo) {
			const search = profileAvatars.find(
				(s) => s.profile_id === participantID
			)
			if (search) {
				setConversationImage(search.s3_url)
			} else {
				setConversationImage(
					`/profiles/avatar_${participantProfileInfo.profile_type.toLowerCase()}_64.png`
				)
			}
			return
		}

		if (isGroup()) {
			setConversationImage("/profiles/avatar_couple_64.png")
			return
		}

		setConversationImage("empty_conversation_image")
	}

	const getConversationImageBot = () => {
		if (isBot()) {
			setConversationImage("/profiles/avatar_couple_64.png")
		}
	}

	const isOnline = () => {
		if (isPersonal() && participantProfileInfo) {
			return participantProfileInfo.is_online
		}
	}

	const getProfileType = () => {
		if (isPersonal() && participantProfileInfo) {
			return participantProfileInfo.profile_type
		}

		return "undefined_profile_type"
	}

	const getAge = (type: string) => {
		if (isPersonal() && participantProfileInfo) {
			switch (type) {
				case "MAN":
					return participantProfileInfo.man?.age || undefined

				case "WOMAN":
					return participantProfileInfo.woman?.age || undefined
			}
		}
	}

	const isVerified = () => {
		if (isPersonal() && participantProfileInfo) {
			return participantProfileInfo.verified || undefined
		}
	}

	const getLastMessage = () => {
		if (
			conversation &&
			conversation.message &&
			conversation.message.message
		) {
			return conversation.message.message.length > 30
				? `${conversation.message.message.slice(0, 30)}...`
				: conversation.message.message
		}
	}

	const formatLastMessageDate = () => {
		if (
			conversation &&
			conversation.message &&
			conversation.message.timestamp
		) {
			const currentDate = new Date().getTime()
			const ts = conversation.message.timestamp
			const oneDay = 86400000
			const oneWeek = oneDay * 6

			if ((currentDate - ts) / oneDay < 1) {
				return format(new Date(ts), "HH:mm")
			}

			if ((currentDate - ts) / oneWeek < 1) {
				return format(new Date(ts), "eeee", {
					locale: getDateLocale(router),
				})
			}

			return format(new Date(ts), "dd/MM")
		}
	}

	const isFavorite = () => {
		if (participantID) {
			const search = favoriteProfiles.find(
				(s) => s.profile === participantID
			)
			return !!search
		} else {
			return false
		}
	}

	// effects
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
		if (conversation && participantID && participantsInfo) {
			getConversationTitle()
		}
	}, [conversation, participantID, participantsInfo])

	useEffect(() => {
		if (
			conversation &&
			participantID &&
			participantProfileInfo &&
			profileAvatars
		) {
			getConversationImage()
		}
	}, [conversation, participantID, participantProfileInfo, profileAvatars])

	useEffect(() => {
		const timeout = setTimeout(() => {
			setStopLoading(true)
		}, 500)

		return () => {
			clearTimeout(timeout)
		}
	}, [participantsInfo])

	useEffect(() => {
		if (isBot()) {
			getConversationImageBot()
			getConversationTitleBot()
		}

		if (isGroup()) {
			getConversationImage()
			getConversationTitleGroup()
		}
	}, [conversation])

	// useEffect(() => {
	// 	if (conversation) {
	// 		const search = typings.find((s) => s.conversationID === conversation.room.id)
	// 		if (search) {
	// 			setT
	// 		}
	// 	}
	// }, [typings, conversation])

	if (
		(!conversation ||
			!participantID ||
			(participantID && !participantProfileInfo)) &&
		!stopLoading
	)
		return <ItemLoader />

	if (
		tabValue === 1 &&
		participantProfileInfo &&
		canSendMessages &&
		!canSendMessages.includes(participantProfileInfo.profile_type)
	)
		return null

	if (
		tabValue === 0 &&
		participantProfileInfo &&
		canSendMessages &&
		canSendMessages.includes(participantProfileInfo.profile_type)
	)
		return null

	return (
		<div className={styles.ConversationItem}>
			<SwipeableList
				style={{direction: dir === "ltr" ? "ltr" : "rtl"}}
				fullSwipe={false}
				type={ListType.IOS}
			>
				<SwipeableListItem
					trailingActions={
						<ItemActions
							deleteConversation={() => {
								emitDeleteConversation(
									conversation,
									isGroup(),
									isGroupAdmin()
								)
							}}
							isGroup={isGroup}
							isGroupAdmin={isGroupAdmin}
						/>
					}
					threshold={0.25}
					maxSwipe={1}
				>
					<a
						className={styles.ChatsContainer}
						onClick={() => {
							openConversation(conversation.room.id)
						}}
						id={"chat_list_clickable_block"}
					>
						<div className={styles.TabBody}>
							<div className={styles.LeftSide}>
								<div className={styles.GreyAvatar}>
									<img
										src={
											conversationImage
												? conversationImage
												: "#"
										}
										alt=""
									/>
									{/* <Image
										src={conversationImage
											? conversationImage
											: "/profiles/avatar_couple_64.png"}
										alt={""}
										priority
										layout="fill" /> */}
								</div>
								{participantProfileInfo &&
									participantProfileInfo.subscription &&
									participantProfileInfo.subscription
										.subscription_type !== "WITHOUT" && (
										<div
											style={{
												position: "absolute",
												right: "20px",
												bottom: "22px",
											}}
										>
											<SubVipSmallIcon />
										</div>
									)}
								<div className={styles.ContentContainer}>
									<div className={styles.NameContainer}>
										<div className={styles.Nickname}>
											{conversationName &&
												conversationName}
										</div>
										{/*{isPersonal() && (*/}
										{/*	<>*/}
										{isPersonal() && isFavorite() && (
											<div className={styles.Favorite}>
												<ChatFavouriteIcon />
											</div>
										)}

										{((isPersonal() && isVerified()) ||
											isBot()) && (
											<div className={styles.Verified}>
												<VerifiedIcon />
											</div>
										)}
										{/*</>*/}
										{/*)}*/}
									</div>
									{/*<div className={styles.NameContainer}>*/}
									{/*	<p>*/}
									{/*		{conversationName &&*/}
									{/*			conversationName}*/}
									{/*	</p>*/}

									{/*	{((isPersonal() && isVerified()) ||*/}
									{/*		isBot()) && (*/}
									{/*		<div*/}
									{/*			className={styles.VerifiedIcon}*/}
									{/*		>*/}
									{/*			<VerifiedIcon />*/}
									{/*		</div>*/}
									{/*	)}*/}
									{/*	{isFavorite() && (*/}
									{/*		<div*/}
									{/*			className={styles.FavoriteIcon}*/}
									{/*		>*/}
									{/*			<ChatFavouriteIcon />*/}
									{/*		</div>*/}
									{/*	)}*/}
									{/*</div>*/}
									<div className={styles.AgeContainer}>
										{/* is personal */}
										{isPersonal() && (
											<div className={styles.ProfileType}>
												{t(`site.${getProfileType()}`)}
											</div>
										)}

										{/* is group */}
										{isGroup() && (
											<div className={styles.ProfileType}>
												{t(`site.Group chat`)}
											</div>
										)}

										{/* is bot */}
										{isBot() && (
											<div
												className={cc([
													styles.ProfileType,
													styles["ProfileType-bot"],
												])}
											>
												{t(`site.BOT`)}
											</div>
										)}

										{isPersonal() && (
											<div className={styles.ProfileAge}>
												{getAge("WOMAN") && (
													<div className={styles.Age}>
														{/*is woman */}
														<span>
															{getAge("WOMAN")}
														</span>
														<FemaleIcon />
													</div>
												)}

												{getAge("MAN") && (
													<div className={styles.Age}>
														{/* is man */}
														<span>
															{getAge("MAN")}
														</span>
														<MaleIcon />
													</div>
												)}
											</div>
										)}
									</div>
									{isTyping() ? (
										<p className={cc([styles.LastMessage])}>
											{t("site.Typing")}…
										</p>
									) : (
										<>
											{conversation.message && (
												<p
													className={cc([
														styles.LastMessage,
														conversation.unread_messages &&
															conversation.unread_messages >
																0 &&
															styles[
																"LastMessage-unread"
															],
													])}
												>
													{getLastMessage()}
												</p>
											)}
										</>
									)}
								</div>
							</div>
							<div className={styles.RightSide}>
								{isPersonal() && (
									<NetworkStatusIcon status={isOnline()} />
								)}

								<div className={styles.UnreadCountContainer}>
									<div className={styles.UnreadCount}>
										<div
											style={{
												margin:
													(conversation &&
														conversation.unread_messages) ||
													0 > 0
														? "0 10px"
														: 0,
											}}
											className={styles.IsReadBlock}
										>
											{isRead() ? (
												<IsReadIcon />
											) : (
												<IsNoReadIcon />
											)}
										</div>
										<MessageCount
											count={
												(conversation &&
													conversation.unread_messages) ||
												0
											}
										/>
									</div>

									{conversation.message && (
										<p>
											<span>
												{formatLastMessageDate()}
												{/*<br />*/}
												{/*{formatDistance(*/}
												{/*	new Date(*/}
												{/*		conversation.message.timestamp*/}
												{/*	),*/}
												{/*	new Date(),*/}
												{/*	{*/}
												{/*		addSuffix: false,*/}
												{/*		locale: getDateLocale(*/}
												{/*			router*/}
												{/*		),*/}
												{/*	}*/}
												{/*)}*/}
											</span>{" "}
										</p>
									)}
								</div>
							</div>
						</div>
						{/*<Divider />*/}
					</a>
				</SwipeableListItem>
			</SwipeableList>
		</div>
	)
}

export default ConversationItem
