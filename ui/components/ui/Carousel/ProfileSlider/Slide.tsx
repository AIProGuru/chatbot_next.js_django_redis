import styles from "./Slide.module.scss"
import React from "react"
import {cc} from "@/components/ui/Functions/Classnames"
import Button from "@/components/ui/Button/Button/Button"
import {useTranslation} from "next-i18next"
// import {UserProfilesInfoProfile} from "@/services/users.service"
// import {useGetUserProfilesInfo} from "../../Functions/Hooks/GetUserProfilesInfo"

interface SlideProps {
	image?: any
	requestToSeePrivateImages?: Function
	profileType: string
	requestPhotosStatus?: boolean
	checkBlock?: any
	selfImages?: any
}

function Slide(props: SlideProps) {
	const {t} = useTranslation("site")
	const {
		image,
		requestToSeePrivateImages,
		profileType,
		requestPhotosStatus,
		checkBlock,
		selfImages,
	} = props

	function requestButtonClick() {
		requestToSeePrivateImages &&
			!requestPhotosStatus &&
			requestToSeePrivateImages()
	}

	return (
		<div className={cc([styles.Slide])}>
			<div className={cc([styles.Image])}>
				{image && image.type === "noImage" && (
					<img
						src={`/profiles/avatar_${profileType.toLowerCase()}_512.png`}
						alt=""
					/>
				)}

				{image && image.type === "PRIVATE_BLUR" && (
					<div className={styles.Lock}>
						<img src="/profiles/private512.png" alt="" />
						{checkBlock && !!selfImages.length && (
							<div className={styles.RequestButton}>
								<Button
									type={"button"}
									onClick={requestButtonClick}
								>
									{requestPhotosStatus
										? t("site.Request sent")
										: t("site.Request access")}
								</Button>
							</div>
						)}
					</div>
				)}
				<img
					{...(image && {
						src: `${image.s3_url}`,
					})}
					alt=""
				/>
			</div>
		</div>
	)
}

export default Slide
