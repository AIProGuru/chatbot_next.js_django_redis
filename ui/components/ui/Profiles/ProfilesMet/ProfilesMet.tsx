import styles from "./ProfilesMet.module.scss"
import ProfileBlock from "@/components/ui/Profiles/ProfilesMet/ProfileBlock" // ProfileBlockProps,
import {useTranslation} from "next-i18next"
import {Recommendation} from "@/services/recommendations.service"
import {useEffect, useState} from "react"
import {
	useGetProfilesWithImagesMutation,
	useLazyGetInfoByUuidOptimisedQuery,
	UserProfile,
} from "@/services/users.service"

interface ProfilesMetProps {
	recommendations: Recommendation[] | undefined
}

function ProfilesMet(props: ProfilesMetProps) {
	const {t} = useTranslation("site")
	const {recommendations} = props

	const [profilesInfo, setProfilesInfo] = useState<UserProfile[]>([])
	const [profilesAvatars, setProfilesAvatars] = useState<object[]>([])

	const [triggerGetProfilesWithImages] = useGetProfilesWithImagesMutation()

	useEffect(() => {
		if (recommendations && recommendations.length > 0) {
			const ids: string[] = recommendations.map((rec) => {
				return rec.recommending_profile_id
			})

			triggerGetProfilesWithImages({
				profiles_ids: ids,
			})
				.unwrap()
				.then((r) => {
					setProfilesInfo((prevProfile) => [
						...prevProfile,
						...r.profiles,
					])
					setProfilesAvatars((prevProfile) => [
						...prevProfile,
						...r.images,
					])
				})
				.catch((e) => {
					console.log(e)
				})
		}
	}, [recommendations])

	if (!profilesInfo) return null

	return (
		<div className={styles.ProfilesMet}>
			<h2>{t("site.We were pardoned, or not")}:)</h2>
			<div className={styles.List}>
				{recommendations &&
					recommendations.map((rec) => {
						return (
							<ProfileBlock
								key={rec.id}
								recommendation={rec}
								images={profilesAvatars}
								profilesInfo={profilesInfo}
							/>
						)
					})}
			</div>
		</div>
	)
}

export default ProfilesMet
