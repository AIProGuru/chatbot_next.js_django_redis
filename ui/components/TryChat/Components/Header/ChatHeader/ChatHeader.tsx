import styles from "./ChatHeader.module.scss"
import {useRouter} from "next/router"
import {cc} from "@/components/ui/Functions/Classnames"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
// import ChatFavouriteIcon from "@/components/ui/Icons/ChatFavouriteIcon"
import VerifiedIcon from "@/components/ui/Icons/VerifiedIcon"
import FemaleIcon from "@/components/ui/Icons/FemaleIcon"
import MaleIcon from "@/components/ui/Icons/MaleIcon"
import React, {useEffect, useState} from "react"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {useTranslation} from "next-i18next"
import {ProfileAvatar} from "@/services/images.service"
import {UserProfile} from "@/services/users.service"
import {GetPersonalImage} from "@/components/TryChat/Functions/Images/GetPersonalImage"
import {GetGroupImage} from "@/components/TryChat/Functions/Images/GetGroupImage"
import {GetPersonalName} from "@/components/TryChat/Functions/Profile/GetPersonalName"
import {GetGroupName} from "@/components/TryChat/Functions/Profile/GetGroupName"
import {GetAge} from "@/components/TryChat/Functions/Profile/GetAge"
import {IConversation} from "@/TryChat/@types/Conversations/Conversation"
import ChatFavouriteIcon from "@/components/ui/Icons/ChatFavouriteIcon"
import {GetBotImage} from "@/components/TryChat/Functions/Images/GetBotImage"

interface ChatHeaderProps {
	conversation: IConversation
	closeModal: Function | undefined
	isTyping: boolean
	myID: string | undefined
	participantID: string | undefined
	participantsInfo: UserProfile[]
	profileAvatars: ProfileAvatar[]
	isGroup: () => boolean | undefined
	isPersonal: () => boolean | undefined
	isBot: () => boolean | undefined
	favorite: boolean
	setEditGroupModal: Function
	emitGetConversations: (skip: number, take: number) => void
	page: number
}

const ChatHeader = (props: ChatHeaderProps) => {
	const {
		conversation,
		closeModal,
		isTyping,
		myID,
		participantID,
		participantsInfo,
		profileAvatars,
		isPersonal,
		isGroup,
		isBot,
		favorite,
		setEditGroupModal,
		emitGetConversations,
		page
	} = props
	const router = useRouter()
	const {t} = useTranslation("site")
	const dir = getDirection(router)

	const [personalParticipantProfile, setPersonalParticipantProfile] =
		useState<UserProfile | undefined>(undefined)
	const [conversationImage, setConversationImage] = useState<
		string | undefined
	>(undefined)
	const [conversationName, setConversationName] = useState<
		string | undefined
	>(undefined)

	const handleGoBackClick = () => {
		// TODO: fix reload 
		// emitGetConversations(page * 10, 10)
		if (isGroup()) {
			if (closeModal && router.asPath === "/chat") {
				closeModal()
				return
			}

			router.push("/chat").then()
			return
		}

		if (closeModal) {
			closeModal()
			return
		}
		router.push("/chat").then()
	}

	const handleInfoClick = () => {
		if (isPersonal()) {
			router.push(`/profiles/${participantID}`).then()
		}

		if (isGroup()) {
			setEditGroupModal(true)
		}
	}

	// get profile
	useEffect(() => {
		if (participantsInfo && participantID) {
			const profile = participantsInfo.find((s) => s.id === participantID)
			setPersonalParticipantProfile(profile)
		}
	}, [participantsInfo, participantID])

	// get conversation image
	useEffect(() => {
		if (participantID && participantsInfo && profileAvatars) {
			if (isPersonal() && personalParticipantProfile) {
				const image = GetPersonalImage(
					personalParticipantProfile,
					profileAvatars
				)
				const name = GetPersonalName(personalParticipantProfile)
				setConversationImage(image)
				setConversationName(name)
			}
		}
	}, [
		profileAvatars,
		participantsInfo,
		participantID,
		personalParticipantProfile,
		conversation,
	])

	useEffect(() => {
		if (isBot()) {
			const image = GetBotImage()
			const name = t(`site.BOT_NAME`)
			setConversationImage(image)
			setConversationName(name)
		}

		if (isGroup()) {
			if (isGroup()) {
				const image = GetGroupImage()
				const name = GetGroupName(conversation)
				setConversationImage(image)
				setConversationName(name)
			}
		}
	}, [conversation])

	if (!conversation) return null

	return (
		<div className={cc([styles.ChatHeader, dir && styles[dir]])}>
			<div className={styles.Container}>
				<div className={styles.GoBack}>
					<TransparentButton
						icon={<GoBackIcon />}
						id={"transparent_button_go_back"}
						onClick={handleGoBackClick}
					/>
				</div>
				<div className={styles.Avatar} onClick={handleInfoClick}>
					<div className={styles.Image}>
						<img
							src={conversationImage ? conversationImage : "#"}
							alt=""
						/>
					</div>
				</div>
				<div className={styles.Info} onClick={handleInfoClick}>
					<div className={styles.Top}>
						<div className={styles.Nickname}>
							{conversationName && conversationName}
						</div>
						{/*{isPersonal() && (*/}
						{/*	<>*/}
						{isPersonal() && favorite && (
							<div className={styles.Favorite}>
								<ChatFavouriteIcon />
							</div>
						)}

						{((personalParticipantProfile &&
							personalParticipantProfile.verified) ||
							isBot()) && (
							<div className={styles.Verified}>
								<VerifiedIcon />
							</div>
						)}
						{/*</>*/}
						{/*)}*/}
					</div>
					<div className={styles.Bottom}>
						<div className={styles.ProfileInfo}>
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
								<>
									{personalParticipantProfile &&
										personalParticipantProfile.profile_type && (
											<div className={styles.ProfileType}>
												{
													personalParticipantProfile.profile_type
												}
											</div>
										)}

									{personalParticipantProfile &&
										GetAge(
											personalParticipantProfile,
											"WOMAN"
										) && (
											<div className={styles.Female}>
												<div className={styles.Icon}>
													<FemaleIcon />
												</div>
												<span>
													{GetAge(
														personalParticipantProfile,
														"WOMAN"
													)}
												</span>
											</div>
										)}

									{personalParticipantProfile &&
										GetAge(
											personalParticipantProfile,
											"MAN"
										) && (
											<div className={styles.Male}>
												<div className={styles.Icon}>
													<MaleIcon />
												</div>
												<span>
													{GetAge(
														personalParticipantProfile,
														"MAN"
													)}
												</span>
											</div>
										)}
								</>
							)}

							{isGroup() && (
								<div className={styles.ProfileType}>Group</div>
							)}
						</div>
						{isTyping && (
							<div className={styles.Typing}>
								{t("site.Typing")}…
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ChatHeader
