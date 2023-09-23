import styles from "./MyProfileAll.module.scss"
import BlogNewHeader from "@/components/ui/Blog/New/Header/BlogNewHeader"
import {TFunction, useTranslation} from "next-i18next"
import {useRouter} from "next/router"
import {useEffect, useMemo, useState} from "react"
import {goBackEditMode} from "@/components/ui/Functions/GoBack"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import RecommendationListItem from "@/components/ui/List/Recommendation/RecommendationListItem" // RecommendationListItemProps,
import {
	Recommendation,
	useLazyGetAwaitingProfileRecommendationsQuery,
} from "@/services/recommendations.service"
import {connect} from "react-redux"
import {toggleEditMode} from "@/redux/slices/EditProfileSlice"
import {useLazyGetProfileAvatarsOptimisedQuery} from "@/services/images.service"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"

const getPageTranslations = (t: TFunction) => {
	return {
		header: {
			title: t("site.Recommend us"), // recommended my profile
		},
	}
}

function MyProfileAll(props: any) {
	const {toggleEditMode} = props
	const {t} = useTranslation("site")
	const router = useRouter()
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])

	const [awaitingRecommendationList, setAwaitingRecommendationList] =
		useState<Recommendation[] | undefined>(undefined)
	const [profileAvatars, setProfileAvatars] = useState<object[]>([])

	const [
		triggerGetAwaitingProfileRecommendations,
		awaitingProfileRecommendations,
	] = useLazyGetAwaitingProfileRecommendationsQuery()
	const [getProfilesAvatar] = useLazyGetProfileAvatarsOptimisedQuery()

	const userProfilesData = useGetUserProfilesInfo()

	useEffect(() => {
		if (userProfilesData && userProfilesData.current_profile_id) {
			triggerGetAwaitingProfileRecommendations({
				profileId: userProfilesData.current_profile_id,
			})
		}
	}, [userProfilesData, triggerGetAwaitingProfileRecommendations])

	useEffect(() => {
		if (
			awaitingProfileRecommendations &&
			awaitingProfileRecommendations.status === "fulfilled" &&
			awaitingProfileRecommendations.data
		) {
			setAwaitingRecommendationList(awaitingProfileRecommendations.data)
		}
	}, [awaitingProfileRecommendations])

	useEffect(() => {
		if (
			awaitingRecommendationList &&
			awaitingRecommendationList.length > 0
		) {
			const ids = new Set<string>()
			awaitingRecommendationList.forEach((item) => {
				ids.add(item.recommending_profile_id.toString())
			})

			Array.from(ids).forEach((id) => {
				getProfilesAvatar({
					profileId: id,
				})
					.unwrap()
					.then((r) => {
						setProfileAvatars((prevProfile) => [...prevProfile, r])
					})
					.catch((e) => {
						console.log(e)
					})
			})
		}
	}, [awaitingRecommendationList])

	function goBackAction() {
		goBackEditMode(router, toggleEditMode)
		return
		// const toggle = new Promise((resolve) => {
		// 	toggleEditMode({state: false})
		// 	resolve(true)
		// })
		//
		// toggle.then(() => {
		// 	router.back()
		// })

		// goBack(router, `/`, ["/"])
	}

	if (!userProfilesData) return null

	return (
		<div className={styles.MyProfileAll}>
			<BlogNewHeader
				title={pageTranslations.header.title}
				callback={goBackAction}
				icon={<GoBackIcon />}
			/>

			<div className={styles.Container}>
				<div className={styles.RecommendationList}>
					{awaitingRecommendationList &&
						awaitingRecommendationList.map(
							(item: Recommendation) => {
								return (
									<RecommendationListItem
										key={item.id}
										item={item}
										avatars={profileAvatars}
									/>
								)
							}
						)}
				</div>
			</div>
		</div>
	)
}

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = {
	toggleEditMode: toggleEditMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfileAll)

// export default MyProfileAll
