import styles from "./ConversationHeader.module.scss"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import React, {useEffect} from "react"
import VerifiedIcon from "@/components/ui/Icons/VerifiedIcon"
import MaleIcon from "@/components/ui/Icons/MaleIcon"
import FemaleIcon from "@/components/ui/Icons/FemaleIcon"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {cc} from "@/components/ui/Functions/Classnames"
import {useTranslation} from "next-i18next"
import ChatFavouriteIcon from "@/components/ui/Icons/ChatFavouriteIcon"
import {toggleChatMode} from "@/redux/slices/EditProfileSlice"
import {connect} from "react-redux"
import getConfig from "next/config"

const {publicRuntimeConfig} = getConfig()

interface ConversationHeaderProps {
	close: Function
	profile: {
		id: string | string[] | undefined
		photo?: string
		name: string
		type: string
		age_man?: number
		age_woman?: number
		verified?: boolean
		favorite?: boolean
	}
	typing: boolean
	toggleChatMode?: any
	editProfileState?: any
}

function ConversationHeader(props: ConversationHeaderProps) {
	const {t} = useTranslation("site")
	const {close, profile, typing, toggleChatMode, editProfileState} = props
	const router = useRouter()
	const dir = getDirection(router)

	const botId = publicRuntimeConfig?.botId || ""

	useEffect(() => {
		if (
			profile &&
			profile.id &&
			typeof profile.id === "string" &&
			profile.id !== botId
		) {
			router.prefetch(`/profiles/${profile.id}`).then((r) => {
				console.log("prefetch done", r)
			})
		}
	}, [profile, router])

	function onProfileClick() {
		if (
			profile &&
			profile.id &&
			typeof profile.id === "string" &&
			profile.id !== botId
		) {
			router.push(`/profiles/${profile.id}`).then(() => {
				toggleChatMode({state: true})
			})
		}
	}

	return (
		<div className={cc([styles.ConversationHeader, dir && styles[dir]])}>
			<div className={styles.GoBack}>
				<TransparentButton
					icon={<GoBackIcon />}
					id={"transparent_button_go_back"}
					onClick={() => {
						close()
					}}
				/>
			</div>
			<div className={styles.User} onClick={onProfileClick}>
				<div className={styles.Photo}>
					{profile && profile.photo && (
						<img src={profile.photo} alt="" />
					)}
				</div>
				<div className={styles.Info}>
					<div className={styles.Line}>
						<div className={styles.Name}>
							{profile && profile.name}
						</div>
						{profile && profile.favorite && (
							<div className={styles.Favorite}>
								<ChatFavouriteIcon />
							</div>
						)}

						{profile && profile.verified && (
							<div className={styles.Verified}>
								<VerifiedIcon />
							</div>
						)}
					</div>
					<div className={styles.Line}>
						{profile && profile.type && (
							<div className={styles.ProfileType}>
								{profile.type}
							</div>
						)}
						<div className={styles.Age}>
							{profile && profile.age_woman && (
								<>
									<div className={styles.Icon}>
										<FemaleIcon />
									</div>
									<span>{profile.age_woman}</span>
								</>
							)}
							{profile && profile.age_man && (
								<>
									<div className={styles.Icon}>
										<MaleIcon />
									</div>
									<span>{profile.age_man}</span>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className={styles.Chat}>
				{typing === true && (
					<div className={styles.Typing}>{t("site.Typing")}…</div>
				)}
			</div>
		</div>
	)
}

// export default ConversationHeader

const mapStateToProps = (state: any) => ({
	editProfileState: state.EditProfileSlice,
})

const mapDispatchToProps = {
	toggleChatMode: toggleChatMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationHeader)
