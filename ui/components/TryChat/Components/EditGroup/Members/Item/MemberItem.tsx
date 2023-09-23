import styles from "./MemberItem.module.scss"
import MaleIcon from "@/components/ui/Icons/MaleIcon"
import FemaleIcon from "@/components/ui/Icons/FemaleIcon"
import CircleButton from "@/components/ui/Button/CircleButton/CircleButton"
import React from "react"
import {UserProfile} from "@/services/users.service"
import {GetPersonalImage} from "@/components/TryChat/Functions/Images/GetPersonalImage"
import {GetPersonalName} from "@/components/TryChat/Functions/Profile/GetPersonalName"
import {GetProfileType} from "@/components/TryChat/Functions/GetProfileType"
import {useTranslation} from "next-i18next"
import {ProfileAvatar} from "@/services/images.service"
import DeleteIcon from "@/components/ui/Icons/DeleteIcon"

interface MemberItemProps {
	profile: UserProfile
	avatars: ProfileAvatar[]
	actions: boolean | undefined
	emitDeleteMemberFromGroup: (profileID: string) => void
	myID: string | undefined
}

function MemberItem(props: MemberItemProps) {
	const {profile, avatars, actions, emitDeleteMemberFromGroup, myID} = props
	const {t} = useTranslation("site")

	const getProfileImage = () => {
		return GetPersonalImage(profile, avatars)
	}

	const getProfileName = () => {
		return GetPersonalName(profile)
	}

	const getProfileType = () => {
		return GetProfileType(profile)
	}

	const getAge = (type: string) => {
		switch (type) {
			case "MAN":
				return profile.man?.age || undefined

			case "WOMAN":
				return profile.woman?.age || undefined
		}
	}

	const deleteMember = () => {
		emitDeleteMemberFromGroup(profile.id)
	}

	return (
		<div className={styles.MemberItem}>
			<div className={styles.ProfileGroup}>
				<div className={styles.Avatar}>
					<img src={getProfileImage()} alt="" />
				</div>
				<div className={styles.ProfileInfo}>
					<div className={styles.Nickname}>{getProfileName()}</div>
					<div className={styles.Details}>
						<div className={styles.ProfileType}>
							{t(`site.${getProfileType()}`)}
						</div>
						<div className={styles.AgeInfo}>
							{(profile.profile_type === "MAN" ||
								profile.profile_type === "COUPLE") && (
								<div className={styles.Age}>
									<div className={styles.Text}>
										{getAge("MAN")}
									</div>
									<div className={styles.Icon}>
										<MaleIcon />
									</div>
								</div>
							)}
							{(profile.profile_type === "WOMAN" ||
								profile.profile_type === "COUPLE") && (
								<div className={styles.Age}>
									<div className={styles.Text}>
										{getAge("WOMAN")}
									</div>
									<div className={styles.Icon}>
										<FemaleIcon />
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className={styles.Actions}>
				{actions && profile.id !== myID && (
					<CircleButton
						icon={<DeleteIcon />}
						onClick={() => {
							deleteMember()
						}}
						id={"circle_button_action_event"}
						color={"black"}
					/>
				)}
			</div>
		</div>
	)
}

export default MemberItem
