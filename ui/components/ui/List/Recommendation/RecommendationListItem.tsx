import styles from "./RecommendationListItem.module.scss"
import {TFunction, useTranslation} from "next-i18next"
import RecommendationSwitch from "@/components/ui/Forms/Inputs/RecomendationSwitch/RecommendationSwitch"
import {useEffect, useState} from "react"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {cc} from "@/components/ui/Functions/Classnames"
import {
	Recommendation,
	useUpdateRecommendationMutation,
} from "@/services/recommendations.service"
import {
	GetProfileDataResponse,
	useLazyGetProfileDataQuery,
} from "@/services/users.service"
import {connect} from "react-redux"
import {getNickName} from "../../Functions/GetNickname"
import NextImage from "../../Image/NextImage"
import VerifiedIcon from "../../Icons/VerifiedIcon"
import FemaleIcon from "../../Icons/FemaleIcon"
import MaleIcon from "../../Icons/MaleIcon"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"

export type RecommendationListItemProps = {
	item: Recommendation
	avatars: any[]
}

type T = {
	[x: string]: any
}

const getComponentTranslations = (t: TFunction): T => {
	return {
		recommendations_list_item: {
			information: {
				type: {
					MAN: "Man",
					WOMAN: "Woman",
					COUPLE: "Couple",
				},
				switch: {
					title: t("site.View in my profile"),
				},
			},
		},
	}
}

function RecommendationListItem(props: RecommendationListItemProps) {
	// constants
	const {item, avatars} = props
	const {t} = useTranslation("site")
	const router = useRouter()
	const dir = getDirection(router)
	const componentTranslations = getComponentTranslations(t)

	// state
	const [switchState, setSwitchState] = useState(false)
	const [profileData, setProfileData] = useState<
		GetProfileDataResponse | undefined
	>(undefined)
	// const [avatar, setAvatar] = useState<string | undefined>(undefined)
	const userProfilesData = useGetUserProfilesInfo()

	// rtk
	const [triggerGetProfileData, getProfileData] = useLazyGetProfileDataQuery()
	const [updateRecommendation] = useUpdateRecommendationMutation()

	// get profileData data
	useEffect(() => {
		if (item) {
			triggerGetProfileData({
				profileId: item.recommending_profile_id,
			})
		}
	}, [item, triggerGetProfileData])

	// set profileData data
	useEffect(() => {
		if (
			getProfileData &&
			getProfileData.status === "fulfilled" &&
			getProfileData.data
		) {
			setProfileData(getProfileData.data)
		}
	}, [getProfileData])

	// switch status
	useEffect(() => {
		if (item.status === "ENABLED") {
			setSwitchState(true)
		}
	}, [item.status])

	// toggle switch
	function toggleSwitch() {
		if (!userProfilesData || !userProfilesData.current_profile_id) return

		updateRecommendation({
			data: {
				id: item.id,
				profile_id: userProfilesData.current_profile_id,
				status: switchState ? "DISABLED" : "ENABLED",
			},
		})
			.unwrap()
			.then((r) => {
				setSwitchState((prevState) => !prevState)
			})
			.catch((e) => console.log(e))
	}

	// useEffect(() => {
	// 	if (item && item.recommending_profile_id) {
	// 		const avatar = avatars.find(
	// 			(av: any) =>
	// 				av.profile_id.toString() ===
	// 				item.recommending_profile_id.toString()
	// 		)
	// 		if (avatar) {
	// 			setAvatar(avatar.s3_url)
	// 		} else {
	// 			setAvatar("/profiles/static150.png")
	// 		}
	// 	}
	// }, [avatars, item])

	const avatar = avatars?.find(
		(av: any) =>
			av?.profile_id?.toString() ===
			item?.recommending_profile_id?.toString()
	)

	const nickname = getNickName(profileData)

	if (!item) return null

	return (
		<div
			className={cc([styles.RecommendationListItem, dir && styles[dir]])}
		>
			<div className={styles.Photo}>
				<NextImage
					width={90}
					height={108}
					src={
						avatar && !avatar.toString().startsWith("#")
							? `${avatar.s3_url}`
							: profileData && profileData.profileType
							? `/profiles/avatar_${profileData.profileType.toLowerCase()}_192.png`
							: "/profiles/avatar_couple_192.png"
					}
					alt={`${nickname} profileData avatar`}
				/>
			</div>
			<div className={styles.Information}>
				{/* <div className={styles.TypeAndAge}>
					{profileData &&
						componentTranslations.recommendations_list_item
							.information.type[profileData.profile_type]}{" "}
					{profileData &&
						[profileData.woman?.age, profileData.man?.age]
							.filter((e) => e)
							.join(",")}
				</div> */}
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
					{item.recommendation}
					{/*{item.status}*/}
					{/*<small>{item.id}</small>*/}
				</div>
				<div className={styles.Switch}>
					<RecommendationSwitch
						value={item.id}
						title={
							componentTranslations.recommendations_list_item
								.information.switch.title
						}
						state={switchState}
						toggleCallback={toggleSwitch}
					/>
				</div>
			</div>
		</div>
	)
}

// export default RecommendationListItem
export default RecommendationListItem
