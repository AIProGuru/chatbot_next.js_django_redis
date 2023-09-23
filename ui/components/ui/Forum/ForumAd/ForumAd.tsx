import styles from "./ForumAd.module.scss"
import {cc} from "@/components/ui/Functions/Classnames"
import {useState} from "react"
import MaleIcon from "@/components/ui/Icons/MaleIcon"
import FemaleIcon from "@/components/ui/Icons/FemaleIcon"
import VerifiedIcon from "@/components/ui/Icons/VerifiedIcon"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {useTranslation} from "next-i18next"
import Divider from "../../Divider/Divider"
import ViewedBlogIcon from "../../Icons/ViewedBlog/ViewedBlogIcon"
import CommentBlogIcon from "../../Icons/CommentBlog/CommentBlogIcon"
import ForumPage from "../../../../pages/forum/[slug]"
import getConfig from "next/config"
import {ProfileAvatar} from "@/services/images.service"

const {publicRuntimeConfig} = getConfig()

interface ForumAdProps {
	href?: boolean
	images?: any[]
	profile?: ProfileAndForumInfo
}

// type Image = {
// 	url: string
// 	file_name: string
// 	src: string
// }

type ProfileAndForumInfo = {
	id?: string
	profileType?: string
	manAge?: number
	womanAge?: number
	description?: string
	verified?: boolean
	nickname?: string
	username?: string
	dateCreate?: string
	titleBlog?: string
	commentCount?: number
	viewedCount?: number
	slug?: string
}

function ForumAd(props: ForumAdProps) {
	const {href, images, profile} = props

	const {t} = useTranslation("site")
	const [showProfile, setShowProfile] = useState(false)

	const router = useRouter()
	const dir = getDirection(router)

	const botId = publicRuntimeConfig?.botId || ""

	const isBot = profile?.id === botId

	function handleClick(event: React.MouseEvent) {
		if (!profile?.slug) return
		href && router.push(`/forum/${encodeURIComponent(profile?.slug)}`)
		// setShowProfile(true)
		// href && toggleProfileModal(true)
	}

	const avatar = images?.find((item: any) => item.profile_id == profile?.id)

	console.log(profile?.slug)

	return (
		<>
			{showProfile && (
				<div className={styles.ProfileModal} id={"modal_profile"}>
					<ForumPage
						modalProfileID={profile?.slug}
						// closeModal={toggleProfileModal}
					/>
				</div>
			)}

			{!showProfile && (
				<>
					<div className={cc([styles.ForumAd, dir && styles[dir]])}>
						<a
							//{...(href && {href: href})}
							className={styles.BlogAdClickableArea}
							// onClick={handleClick}
							id={"profile_ad_list_clickable_block"}
						>
							<div className={cc([styles.Image])}>
								<img
									width={90}
									height={108}
									src={
										avatar
											? `${avatar.s3_url}`
											: profile && profile.profileType
											? `/profiles/avatar_${profile.profileType.toLowerCase()}_192.png`
											: "/profiles/avatar_couple_192.png"
									}
									alt="avatar_couple_192.png"
									onClick={(e) => {
										handleClick(e)
									}}
								/>
							</div>
							<div
								className={cc([styles.Info])}
								onClick={(e) => {
									handleClick(e)
								}}
							>
								<div className={cc([styles.ProfileInfo])}>
									<div className={cc([styles.Basic])}>
										{profile && profile.nickname && (
											<div className={styles.ProfileType}>
												{profile.nickname}
											</div>
										)}

										{profile && profile.verified && (
											<div className={styles.Verified}>
												<VerifiedIcon />
											</div>
										)}
									</div>
								</div>
								{!isBot && (
									<div className={styles.Age}>
										{profile && profile.manAge && (
											<div className={styles.ManAge}>
												<div className={styles.Icon}>
													<MaleIcon />
												</div>
												<div className={styles.Text}>
													{profile.manAge}
												</div>
											</div>
										)}
										{profile && profile.womanAge && (
											<div className={styles.WomanAge}>
												<div className={styles.Icon}>
													<FemaleIcon />
												</div>
												<div className={styles.Text}>
													{profile.womanAge}
												</div>
											</div>
										)}
									</div>
								)}

								<div className={styles.TitleBlogContainer}>
									<div className={cc([styles.TitleBlog])}>
										{profile?.titleBlog || "-"}
									</div>
								</div>
								<div className={styles.DateCreatedContainer}>
									<div className={cc([styles.DateCreated])}>
										{profile?.dateCreate || "-"}
									</div>
								</div>
								{/* <div className={styles.DescriptionContainer}>
									<div className={cc([styles.Description])}>
										{profile?.description || "-"}
									</div>
								</div> */}
								<div className={styles.InfoCount}>
									<div>
										<ViewedBlogIcon />
										<span>{profile?.commentCount}</span>
									</div>
									<div>
										<CommentBlogIcon />
										<span>{profile?.viewedCount}</span>
									</div>
								</div>
							</div>
						</a>
						<Divider />
					</div>
				</>
			)}
		</>
	)
}

export default ForumAd
