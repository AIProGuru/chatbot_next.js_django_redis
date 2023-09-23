import styles from "./ProfileBlock.module.scss"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {cc} from "@/components/ui/Functions/Classnames"
import {Recommendation} from "@/services/recommendations.service"
import {useEffect, useState} from "react"
import {UserProfile} from "@/services/users.service"
import {TFunction, useTranslation} from "next-i18next"
import {getNickName} from "@/components/ui/Functions/GetNickname"
import NextImage from "../../Image/NextImage"
import VerifiedIcon from "../../Icons/VerifiedIcon"
import FemaleIcon from "../../Icons/FemaleIcon"
import MaleIcon from "../../Icons/MaleIcon"

export interface ProfileBlockProps {
	images: any[]
	recommendation: Recommendation
	profilesInfo: UserProfile[] | undefined
}

type T = {
	profile_block: {
		info: {
			nickname: {
				type: {
					[x: string]: any
				}
			}
		}
	}
	[x: string]: any
}

const getComponentTranslations = (t: TFunction): T => {
	return {
		profile_block: {
			info: {
				nickname: {
					type: {
						MAN: "Man",
						WOMAN: "Woman",
						COUPLE: "Couple",
					},
				},
			},
		},
	}
}

function ProfileBlock(props: ProfileBlockProps) {
	// props
	const {recommendation, images, profilesInfo} = props
	const router = useRouter()
	const dir = getDirection(router)
	const {t} = useTranslation("site")
	const componentTranslations = getComponentTranslations(t)

	// state
	const [profileData, setProfileData] = useState<UserProfile | undefined>(
		undefined
	)

	// functions
	const avatar = images.find(
		(item: any) =>
			item.profile_id.toString() ===
			recommendation.recommending_profile_id.toString()
	)

	const goToProfile = () => {
		if (!profileData?.id) return
		router.push(`/profiles/${profileData.id}`).then()
	}

	// effects
	useEffect(() => {
		if (recommendation && profilesInfo && profilesInfo.length > 0) {
			const thisProfile = profilesInfo.find(
				(s) => s.id === recommendation.recommending_profile_id
			)
			if (thisProfile) {
				setProfileData(thisProfile)
			}
		}
	}, [profilesInfo, recommendation])

	const nickname = getNickName(profileData)

	if (!profileData) return null

	return (
		<div
			onClick={goToProfile}
			className={cc([styles.ProfileBlock, dir && styles[dir]])}
		>
			<div className={styles.Image}>
				<NextImage
					width={90}
					height={108}
					src={
						avatar && !avatar.toString().startsWith("#")
							? `${avatar.s3_url}`
							: profileData && profileData.profile_type
							? `/profiles/avatar_${profileData.profile_type.toLowerCase()}_192.png`
							: "/profiles/avatar_couple_192.png"
					}
					alt={`${nickname} profile avatar`}
				/>
			</div>
			<div className={styles.Info}>
				<div className={cc([styles.Basic])}>
					{nickname && nickname && (
						<div className={styles.ProfileType}>{nickname}</div>
					)}

					{profileData &&
						(profileData.profile_type === "MAN" ||
							profileData.profile_type === "COUPLE") && (
							<div className={styles.ManAge}>
								<div className={styles.Icon}>
									<MaleIcon />
								</div>
								{profileData && profileData?.man?.age && (
									<div className={styles.Text}>
										{profileData?.man?.age}
									</div>
								)}
							</div>
						)}

					{profileData &&
						(profileData.profile_type === "WOMAN" ||
							profileData.profile_type === "COUPLE") && (
							<div className={styles.WomanAge}>
								<div className={styles.Icon}>
									<FemaleIcon />
								</div>
								{profileData && profileData?.woman?.age && (
									<div className={styles.Text}>
										{profileData?.woman?.age}
									</div>
								)}
							</div>
						)}

					{profileData && profileData.verified && (
						<div className={styles.Verified}>
							<VerifiedIcon />
						</div>
					)}
				</div>
				<div className={styles.Comment}>
					{recommendation.recommendation}
				</div>
			</div>
		</div>
	)
}

export default ProfileBlock
