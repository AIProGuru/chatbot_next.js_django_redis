import styles from "./AvailableAd.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import React, {useEffect, useMemo, useState} from "react"
import MaleIcon from "@/components/ui/Icons/MaleIcon"
import FemaleIcon from "@/components/ui/Icons/FemaleIcon"
import VerifiedIcon from "@/components/ui/Icons/VerifiedIcon"
import {useRouter} from "next/router"
import RoundDialogIcon from "@/components/ui/Icons/RoundDialogIcon"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import NetworkStatusIcon from "@/components/ui/Icons/NetworkStatusIcon"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import {useTranslation} from "next-i18next"
// import {useGetUserProfilesQuery} from "@/services/users.service"
// import DeleteIcon from "../../Icons/DeleteIcon"
// import * as LinkLocal from "../../Button/Link/Link"
// import ProfilePage from "../../../../pages/profiles/[uid]"
// import Button from "@/components/ui/Button/Button/Button"
// import {checkSubscription} from "@/components/ui/Functions/CheckSubscription"
import getConfig from "next/config"
import Link from "next/link"
import NextImage from "@/components/ui/Image/NextImage"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
// import {ProfileAvatar} from "@/services/images.service"
import SubVipSmallIcon from "@/components/ui/Icons/SubVipSmall/SubVipSmallIcon"

const {publicRuntimeConfig} = getConfig()

interface AvailableAdProps {
	href?: string
	// images?: ProfileAvatar[]
	location?: ProfileLocation
	status?: ProfileNetworkStatus
	profile: ProfileInfo
	title: string
	removeProfile?: () => void
	requestImage?: {
		accept: any
		reject: any
	}
}

// type Image = {
// 	url: string
// 	file_name: string
// 	src: string
// }

export enum ProfileNetworkStatus {
	offline,
	online,
}

type ProfileLocation = {
	title?: string
	distance?: number
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
	avatarImage: AvatarImage
	subscription: Subscription
}

type Subscription = {
	subscription_date_to: string
	subscription_type: string
}

function AvailableAd(props: AvailableAdProps) {
	const {t} = useTranslation("site")
	const [selfProfiles, setSelfProfiles] = useState<string[]>([])
	const [showProfile, setShowProfile] = useState(false)

	const {
		href,
		location,
		status,
		profile,
		removeProfile,
		requestImage,
		title,
	} = props
	const router = useRouter()
	const dir = getDirection(router)
	const botId = publicRuntimeConfig?.botId || ""

	const isBot = profile?.id === botId

	// rtk get user data
	const userProfilesData = useGetUserProfilesInfo()

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

	function handleClick(event: React.MouseEvent) {
		// href && router.push(href)
		if (isBot) return
		href && toggleProfileModal(true)
	}

	function dialogClick() {
		// a href check is needed to determine if the view is anonymous or not, and if not, we don't need to allow user to chat...
		if (profile && profile.id && href) {
			router.push(`/chat/conversation/upid_${profile.id}`).then()
		}
	}

	function toggleProfileModal(state: boolean) {
		if (state) {
			setShowProfile(true)
		} else {
			setShowProfile(false)
			// router.push(`/#scrollto_${profile?.id}`).then()
		}
	}

	// const avatar = images?.find((item: any) => item.profile_id == profile?.id)
	const avatar = profile?.avatarImage
	// const isMyProfile = (id: string) => {
	// 	return selfProfiles.includes(id)
	// }

	return <>
        <div className={cc([styles.AvailableAd, dir && styles[dir]])}>
            <div className={styles.AvailableAdClickableArea}>
                <div className={cc([styles.Image])}>
                    <Link
                        href={`/available-today/?profile_list_uid=${profile?.id}`}
                        as={`/available-today/profiles/${profile?.id}`}
                        legacyBehavior>
                            <NextImage
                                width={149}
                                height={141}
                                src={
                                    avatar
                                        ? `${avatar.s3_url}`
                                        : profile && profile.profileType
                                        ? `/profiles/avatar_${profile.profileType.toLowerCase()}_192.png`
                                        : "/profiles/avatar_couple_64.png"
                                }
                                alt={""}
                            />
                            {profile &&
                                profile.subscription &&
                                profile.subscription.subscription_type !==
                                    "WITHOUT" && (
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
                    </Link>
                    {profile?.id && !selfProfiles?.includes(profile?.id) && (
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
                </div>

                <Link
                    href={`/available-today/?profile_list_uid=${profile?.id}`}
                    as={`/available-today/profiles/${profile?.id}`}
                    className={cc([styles.Info])}>

                    <div
                        className={cc([styles.Info])}
                    >
                        <div className={cc([styles.Status])}>
                            <div className={cc([styles.Network])}>
                                <NetworkStatusIcon status={isOnline} />
                            </div>
                        </div>
                        <div className={cc([styles.ProfileInfo])}>
                            <div className={cc([styles.Basic])}>
                                {profile && profile.nickname && (
                                    <div className={styles.ProfileType}>
                                        {profile.nickname}
                                    </div>
                                )}

                                {profile && profile.manAge && !isBot && (
                                    <div className={styles.ManAge}>
                                        <div className={styles.Icon}>
                                            <MaleIcon />
                                        </div>
                                        <div className={styles.Text}>
                                            {profile.manAge}
                                        </div>
                                    </div>
                                )}

                                {profile && profile.womanAge && !isBot && (
                                    <div className={styles.WomanAge}>
                                        <div className={styles.Icon}>
                                            <FemaleIcon />
                                        </div>
                                        <div className={styles.Text}>
                                            {profile.womanAge}
                                        </div>
                                    </div>
                                )}

                                {profile && profile.verified && (
                                    <div className={styles.Verified}>
                                        <VerifiedIcon />
                                    </div>
                                )}
                            </div>
                            <div className={cc([styles.Location])}>
                                {location && location.title}
                            </div>
                        </div>
                        <div className={styles.SuitsUsContainer}>
                            <div className={cc([styles.SuitsUs])}>
                                <span>
                                    {t("site.Appropriate for us")}{" "}
                                </span>{" "}
                                {title}
                            </div>
                        </div>
                        <div className={styles.DescriptionContainer}>

                            <div className={cc([styles.Description])}>
                                {profile &&
                                profile.description &&
                                profile.description.length > 40
                                    ? `${profile.description.slice(
                                            0,
                                            40
                                      )}...`
                                    : profile?.description || "-"}
                            </div>
                        </div>
                    </div>

                </Link>
            </div>
        </div>
    </>;
}

export default AvailableAd
