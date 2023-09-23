import styles from "./ProfileAd.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import React, {useEffect, useMemo, useState} from "react"
// import NavigationIcon from "@/components/ui/Icons/NavigationIcon"
import MaleIcon from "@/components/ui/Icons/MaleIcon"
import FemaleIcon from "@/components/ui/Icons/FemaleIcon"
import VerifiedIcon from "@/components/ui/Icons/VerifiedIcon"
import {useRouter} from "next/router"
import RoundDialogIcon from "@/components/ui/Icons/RoundDialogIcon"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import NetworkStatusIcon from "@/components/ui/Icons/NetworkStatusIcon"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import {useTranslation} from "next-i18next"
// import DeleteIcon from "../../Icons/DeleteIcon"
import {default as LinkLocal} from "../../Button/Link/Link"
import Button from "../../Button/Button/Button"
// import ProfilePage from "../../../../pages/profiles/[uid]"
import {intervalToDuration} from "date-fns"
// import ChatDialog from "../../../../pages/chat/[uid]"
// import {toggleBodyScroll} from "@/components/ui/Functions/BodyScrollLock"
// import Image from "next/image"
import {useAuth} from "@/components/auth/AuthProvider"
import getConfig from "next/config"
// import Profile from "@/components/ui_pages/Profile/Profile"
// import Modal from "react-modal"
// import {goBack} from "../../Functions/GoBack"
import Link from "next/link"
import Image from "next/image"

import DeleteIcon from "../../Icons/DeleteIcon"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
import NoSmallCoupleIcon from "../../Icons/NoSmallCouple/NoSmallCoupleIcon"
import NoSmallWomanIcon from "../../Icons/NoSmallWomanIcon/NoSmallWomanIcon"
import NoSmallManIcon from "../../Icons/NoSmallMan/NoSmallManIcon"
import SubVipIcon from "@/components/ui/Icons/SubVip/SubVipIcon"
import {SubscriptionOnProfileAd} from "@/services/users.service"
import SubVipSmallIcon from "@/components/ui/Icons/SubVipSmall/SubVipSmallIcon"
import NavigationIcon from "@/components/ui/Icons/NavigationIcon"
// import Profile from "@/components/ui_pages/Profile/Profile"
// import Modal from "react-modal"
// import ProfileModal from "@/components/ui_pages/Profile/ProfileModal"

const {publicRuntimeConfig} = getConfig()

interface ProfileAdProps {
	hrefURL?: string
	asURL?: string
	href?: string
	images?: any[]
	location?: ProfileLocation
	distance?: number | null
	status?: ProfileNetworkStatus
	profile?: ProfileInfo
	disabled?: boolean
	removeProfile?: () => void
	requestImage?: {
		dataRequest: any
		accept?: any
		reject?: any
	}
	scrollBlockState?: any
	blockScroll?: Function
	enableScroll?: Function
	block?: {
		disabled: boolean
		unblock: Function
	}
	path?: string
	blur?: boolean
}

// type Image = {
// 	url: string
// 	file_name: string
// 	src: string
// }

export enum ProfileNetworkStatus {
	offline = 1,
	online = 2,
}

type ProfileLocation = {
	title?: string
	// distance?: number
}

type AvatarImage = {
	id: string
	profile_id: string
	s3_url: string
	type: string
}

type ProfileInfo = {
	id: string
	profileType?: string
	manAge?: number
	womanAge?: number
	description?: string
	verified?: boolean
	nickname?: string
	username?: string
	dateCreate?: string
	cantSendMessagesList?: Array<any>
	subscription?: SubscriptionOnProfileAd
	avatarImage?: AvatarImage
}

function ProfileAd(props: ProfileAdProps) {
	const {
		href,
		images,
		location,
		status,
		profile,
		removeProfile,
		requestImage,
		block,
		disabled,
		path,
		hrefURL,
		asURL,
		blur,
		distance,
	} = props

	const {t} = useTranslation("site")
	const [selfProfiles, setSelfProfiles] = useState<string[]>([])
	const [showProfile, setShowProfile] = useState(false)
	const [showChat, setShowChat] = useState(false)

	const router = useRouter()
	const dir = getDirection(router)
	const auth = useAuth()

	const userProfilesData = useGetUserProfilesInfo()

	const botId = publicRuntimeConfig?.botId || ""

	const isBot = profile?.id === botId

	useEffect(() => {
		if (userProfilesData && userProfilesData.profiles) {
			const pr = userProfilesData.profiles.map(
				(profile: any) => profile.id
			)
			setSelfProfiles(pr)
		}
	}, [userProfilesData])

	const isOnline = useMemo(
		() => status === ProfileNetworkStatus.online,
		[status]
	)

	function dialogClick() {
		// a href check is needed to determine if the view is anonymous or not, and if not, we don't need to allow user to chat...
		if (profile && profile.id && href) {
			// router.push(`/chat/${profile.id}`).then()
			// toggleChatModal(true)
			router
				.push(
					`/?chat_id=upid_${profile.id}`,
					`/chat/conversation/upid_${profile.id}`
				)
				.then()
			// router.push(`/chat/conversation/upid_${profile.id}`).then()
		}
	}
	//
	// function toggleChatModal(state: boolean) {
	// 	if (state) {
	// 		setShowChat(true)
	// 		toggleBodyScroll(true)
	// 	} else {
	// 		setShowChat(false)
	// 		toggleBodyScroll(false)
	// 	}
	// }

	const avatar =
		profile?.avatarImage ||
		images?.find((item: any) => item.profile_id == profile?.id)

	const isRequestApproved = requestImage?.dataRequest?.status === "APPROVED"

	const requestDateExp = requestImage?.dataRequest?.expiration_date

	const remaining = (expData: any) => {
		const endDate = expData
		const now = new Date()
		const end = new Date(endDate)
		if (!endDate) return
		return intervalToDuration({
			start: end,
			end: now,
		})
	}

	const dur = remaining(requestDateExp)

	const getUrlHref = () => {
		if (disabled) return ``
		if (!hrefURL) return `/?profile_list_uid=${profile?.id}`
		return hrefURL
	}
	const getUrlAs = () => {
		if (disabled) return ``
		if (!asURL) return `/profiles/${profile?.id}`
		return asURL
	}

	const getDistance = (meters: number) => {
		if (meters < 1000) {
			return `${meters} ${t("site.m")}`
		}
		return `${(meters / 1000).toFixed(1)} ${t("site.km")}`
	}

	const getProfileContainer = () => {
		const container = (
			<div className={cc([styles.ProfileAd, dir && styles[dir]])}>
				<div className={styles.ProfileAdClickableArea}>
					<div className={cc([styles.Image])}>
						{block && (
							<div className={styles.UnblockContainer}>
								<Button
									type={"button"}
									mode={"submit"}
									fullWidth={true}
									id={"submit_button_in_form_with_prices"}
									prevent={false}
									color={"white"}
									variant={"outline"}
									onClick={block.unblock}
									disabled={block.disabled}
								>
									<p className={styles.WhiteButtonText}>
										{t("site.Unblock")}
									</p>
								</Button>
							</div>
						)}

						{blur && avatar && <div className={styles.Blur} />}
						<Link href={getUrlHref()} as={getUrlAs()} legacyBehavior>
							<div className={cc([styles.Image])}>
                                <Image
                                    src={
                                        avatar &&
                                        !avatar.toString().startsWith("#")
                                            ? `${avatar.s3_url}`
                                            : profile && profile.profileType
                                            ? `/profiles/avatar_${profile.profileType.toLowerCase()}_192.png`
                                            : "/profiles/avatar_couple_192.png"
                                    }
                                    alt={
                                        profile?.nickname ?
                                        `${profile.nickname} profile avatar` : 'profile avatar'
                                    }
                                    priority
									width={0}
									height={0}
									sizes="100vw"
									style={{width:"100%", height:"100%"}}
                                />
							</div>
                        </Link>
						{auth &&
							profile?.id &&
							!selfProfiles?.includes(profile?.id) &&
							!block && (
								<div className={styles.Dialog}>
									<TransparentButton
										icon={<RoundDialogIcon />}
										mode={"fit-content"}
										onClick={() => {
											dialogClick()
										}}
									/>
								</div>
							)}
						{profile &&
							profile.subscription &&
							profile.subscription.subscription_type !==
								"WITHOUT" && (
								<div className={cc([styles.ProfileSubStatus])}>
									<SubVipSmallIcon />
								</div>
							)}
						<div className={cc([styles.ProfileCantSentMessage])}>
							{profile?.cantSendMessagesList &&
								profile?.cantSendMessagesList?.includes(
									"MAN"
								) && <NoSmallManIcon />}
							{profile?.cantSendMessagesList &&
								profile?.cantSendMessagesList?.includes(
									"WOMAN"
								) && <NoSmallWomanIcon />}
							{profile?.cantSendMessagesList &&
								profile?.cantSendMessagesList?.includes(
									"COUPLE"
								) && <NoSmallCoupleIcon />}
						</div>
					</div>
					<Link href={getUrlHref()} as={getUrlAs()} className={cc([styles.Info])}>
                        <div>
                            {(!!distance || distance === 0) && (
                                <div className={cc([styles.Status])}>
                                    <div className={cc([styles.Location])}>
                                        <div className={styles.Icon}>
                                            <NavigationIcon />
                                        </div>
                                        <div className={styles.Text}>
                                            <span>
                                                {getDistance(distance)}{" "}
                                                {t("site.M from you")}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={cc([styles.Network])}>
                                        <NetworkStatusIcon
                                            status={isOnline}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className={cc([styles.ProfileInfo])}>
                                <div className={styles.BasicWithNetwork}>
                                    <div className={cc([styles.Basic])}>
                                        {profile && profile.nickname && (
                                            <div
                                                className={
                                                    styles.ProfileType
                                                }
                                            >
                                                {profile.nickname}
                                            </div>
                                        )}

                                        {profile &&
                                            (profile.profileType ===
                                                "MAN" ||
                                                profile.profileType ===
                                                    "COUPLE") && (
                                                <div
                                                    className={
                                                        styles.ManAge
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles.Icon
                                                        }
                                                    >
                                                        <MaleIcon />
                                                    </div>
                                                    {profile &&
                                                        profile.manAge &&
                                                        !isBot && (
                                                            <div
                                                                className={
                                                                    styles.Text
                                                                }
                                                            >
                                                                {
                                                                    profile.manAge
                                                                }
                                                            </div>
                                                        )}
                                                </div>
                                            )}

                                        {profile &&
                                            (profile.profileType ===
                                                "WOMAN" ||
                                                profile.profileType ===
                                                    "COUPLE") && (
                                                <div
                                                    className={
                                                        styles.WomanAge
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles.Icon
                                                        }
                                                    >
                                                        <FemaleIcon />
                                                    </div>
                                                    {profile &&
                                                        profile.womanAge &&
                                                        !isBot && (
                                                            <div
                                                                className={
                                                                    styles.Text
                                                                }
                                                            >
                                                                {
                                                                    profile.womanAge
                                                                }
                                                            </div>
                                                        )}
                                                </div>
                                            )}

                                        {profile && profile.verified && (
                                            <div
                                                className={styles.Verified}
                                            >
                                                <VerifiedIcon />
                                            </div>
                                        )}
                                    </div>
                                    {!distance && distance !== 0 && (
                                        <div
                                            className={cc([styles.Network])}
                                        >
                                            <NetworkStatusIcon
                                                status={isOnline}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className={cc([styles.Location])}>
                                    {location && location.title}
                                </div>
                                {profile?.dateCreate && (
                                    <div
                                        className={
                                            styles.DateCreatedContainer
                                        }
                                    >
                                        <div
                                            className={cc([
                                                styles.DateCreated,
                                            ])}
                                        >
                                            {profile?.dateCreate || "-"}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={styles.DescriptionContainer}>
                                <div className={cc([styles.Description])}>
                                    {/*{profile && profile.description}*/}
                                    {profile &&
                                    profile.description &&
                                    profile.description.length > 35
                                        ? `${profile.description.slice(
                                                0,
                                                35
                                          )}...`
                                        : profile?.description || "-"}
                                </div>
                            </div>
                        </div>
                    </Link>
					{removeProfile && (
						<LinkLocal onClick={removeProfile}>
							<div className={cc([styles.DeleteImage])}>
								<DeleteIcon />
							</div>
						</LinkLocal>
					)}
				</div>
				{requestImage && (
					<div className={styles.RequestImages}>
						<div className={styles.Description}>
							<p>
								{requestImage.accept
									? isRequestApproved
										? t(
												"site.Thank you for allowing us to view your private photos"
										  )
										: t(
												"site.User asked to view your private photos"
										  )
									: null}
								{!requestImage.accept
									? isRequestApproved
										? t(
												"site.Profile approved you to watch private photos"
										  )
										: t(
												"site.Waiting for profile to allow watch private photos"
										  )
									: null}
							</p>
						</div>
						<div
							className={
								isRequestApproved
									? cc([
											styles.Buttons,
											styles.ButtonsApproved,
									  ])
									: styles.Buttons
							}
						>
							<div className={styles.AcceptButton}>
								<Button
									type={"button"}
									mode={"submit"}
									fullWidth={true}
									id={"submit_button_in_form_with_prices"}
									prevent={false}
									blueBorder={
										isRequestApproved ? false : true
									}
									background={
										isRequestApproved
											? "whiteGray"
											: undefined
									}
									onClick={requestImage.accept}
									disabled={
										isRequestApproved ||
										!requestImage.accept
									}
								>
									{isRequestApproved ? (
										<>
											<p
												className={
													styles.SubmitGrayButtonText
												}
											>
												{dur?.days} {t("site.Days")}
											</p>
											<p
												className={
													styles.SubmitGrayButtonText
												}
											>
												{dur?.hours} {t("site.Hours")}
											</p>
										</>
									) : !requestImage.accept ? (
										<p className={styles.SubmitButtonText}>
											{t("site.Waiting approval")}
										</p>
									) : (
										<p className={styles.SubmitButtonText}>
											{t("site.Confirmation")}
										</p>
									)}
								</Button>
							</div>
							{requestImage.reject && (
								<div className={styles.CancelButton}>
									<Button
										type={"button"}
										mode={"submit"}
										fullWidth={true}
										id={"submit_button_in_form_with_prices"}
										prevent={false}
										color={"white"}
										variant={"outline"}
										onClick={requestImage.reject}
									>
										<p className={styles.WhiteButtonText}>
											{t("site.Reject")}
										</p>
									</Button>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		)

		return container

		// return (
		// 	<>
		// 		<Link
		// 			href={`?profile_list_uid=${profile?.id}`}
		// 			as={`/profiles/${profile?.id}`}
		// 			// href={
		// 			// 	path === "favorites"
		// 			// 		? `/favorites/profiles/?profile_list_uid=${profile?.id}`
		// 			// 		: `/?profile_list_uid=${profile?.id}`
		// 			// }
		// 			// as={
		// 			// 	path === "favorites"
		// 			// 		? `/favorites/profiles/${profile?.id}`
		// 			// 		: `/profiles/${profile?.id}`
		// 			// }
		// 		>
		// 			<a>{container}</a>
		// 			{/*{container}*/}
		// 		</Link>
		// 	</>
		// )
	}

	return (
		<>
			{/*{`${router.asPath}/?profile_list_uid=${profile?.id}`}*/}
			{/*<br />*/}
			{/*{`${router.asPath}/profiles/${profile?.id}`}*/}
			{/*<br />*/}
			{/*{router.pathname}*/}
			{/* <ChatDialog modalChatID={profile?.id} />*/}
			{/*{showChat && (*/}
			{/*	<div className={styles.ProfileModal} id={"modal_chat"}>*/}
			{/*		<ChatDialog*/}
			{/*			modalChatID={profile?.id}*/}
			{/*			closeModal={toggleChatModal}*/}
			{/*		/>*/}
			{/*	</div>*/}
			{/*)}*/}
			{getProfileContainer()}
		</>
	)
}

export default ProfileAd
