import styles from "./ProfileSlider.module.scss"
import {Swiper, SwiperSlide} from "swiper/react"
import {Pagination} from "swiper"
import "swiper/css"
import Slide from "@/components/ui/Carousel/ProfileSlider/Slide"
import React from "react"
import {cc} from "@/components/ui/Functions/Classnames"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import CircleButton from "@/components/ui/Button/CircleButton/CircleButton"
import StarIcon from "@/components/ui/Icons/StarIcon"
import ActionIcon from "@/components/ui/Icons/ActionIcon"
import {useRouter} from "next/router"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import ActiveStarIcon from "../../Icons/ActiveStarIcon"
import NoManIcon from "../../Icons/NoMan/NoManIcon"
import NoWomanIcon from "../../Icons/NoWoman/NoWomanIcon"
import NoCoupleIcon from "../../Icons/NoCouple/NoCoupleIcon"
import SubVipIcon from "../../Icons/SubVip/SubVipIcon"

interface SliderProps {
	images: string[]
	closeCallback?: Function
	optionsCallback?: Function
	makeAsFavorite?: Function
	removeFromFavorite?: Function
	favorite?: boolean
	isMain?: boolean
	requestToSeePrivateImages: Function
	profileType: string
	requestPhotosStatus: boolean
	checkBlock?: any
	cantSendMessagesList?: any
	selfImages?: any
	subscription?: string
}

function ProfileSlider(props: SliderProps) {
	const {
		images,
		closeCallback,
		optionsCallback,
		makeAsFavorite,
		removeFromFavorite,
		favorite,
		isMain,
		requestToSeePrivateImages,
		profileType,
		requestPhotosStatus,
		checkBlock,
		cantSendMessagesList,
		selfImages,
		subscription
	} = props
	const router = useRouter()
	const dir = getDirection(router)

	function closeButtonClick(event: any) {
		closeCallback && closeCallback()
	}

	function optionsButtonClick() {
		optionsCallback && optionsCallback(true)
	}

	const withAvatars = images.find((image: any) => image.type === "AVATAR")
	const avatars = withAvatars
		? images.filter((image: any) => image.type === "AVATAR")
		: images.length > 0
		? [
				{
					s3_url: `/profiles/avatar_${profileType.toLowerCase()}_512.png`,
				},
		  ]
		: []
	const mainImages = images.filter((image: any) => image.type === "MAIN")
	const privateImages = images.filter((image: any) =>
		["PRIVATE_BLUR", "PRIVATE"].includes(image.type)
	)

	// const showImages =
	// 	images && images.find((image: any) => image.type === "AVATAR")
	// 		? images
	// 		: [
	// 				{
	// 					s3_url: `/profiles/avatar_${profileType.toLowerCase()}_512.png`,
	// 				},
	// 				...images,
	// 		  ]

	const showImages = [...avatars, ...mainImages, ...privateImages]

	return (
		<div className={cc([styles.ProfileSlider, dir && styles[dir]])}>
			<div className={cc([styles.CloseButton])}>
				<CircleButton
					icon={<CloseIcon />}
					onClick={closeButtonClick}
					id={"circle_button_close_event"}
				/>
			</div>

			<div className={cc([styles.ProfileActions])}>
				{!isMain && (
					<div className={styles.Button}>
						<CircleButton
							icon={favorite ? <ActiveStarIcon /> : <StarIcon />}
							onClick={
								favorite ? removeFromFavorite : makeAsFavorite
							}
							id={"circle_button_start_event"}
							color={"black"}
							disabled={!checkBlock}
						/>
					</div>
				)}
				{!isMain && (
					<div className={styles.Button}>
						<CircleButton
							icon={<ActionIcon />}
							onClick={optionsButtonClick}
							id={"circle_button_action_event"}
							color={"black"}
						/>
					</div>
				)}
			</div>
			<div className={cc([styles.ProfileCantSentMessage])}>
				{cantSendMessagesList &&
					cantSendMessagesList?.includes("MAN") && <NoManIcon />}
				{cantSendMessagesList &&
					cantSendMessagesList?.includes("WOMAN") && <NoWomanIcon />}
				{cantSendMessagesList &&
					cantSendMessagesList?.includes("COUPLE") && (
						<NoCoupleIcon />
					)}
			</div>
			{subscription !== "WITHOUT" && (
				<div className={cc([styles.ProfileSubStatus])}>
					<SubVipIcon />
				</div>
			)}

			<Swiper
				modules={[Pagination]}
				pagination={{clickable: true}}
				simulateTouch={true}
				spaceBetween={0}
				slidesPerView={1}
			>
				{images.length > 0 &&
					showImages &&
					showImages.map((image: any, index: number) => {
						return (
							<SwiperSlide key={index}>
								<Slide
									requestPhotosStatus={requestPhotosStatus}
									image={image}
									requestToSeePrivateImages={
										requestToSeePrivateImages
									}
									selfImages={selfImages}
									profileType={profileType}
									checkBlock={checkBlock}
								/>
							</SwiperSlide>
						)
					})}

				{!images ||
					(images.length < 1 && (
						<SwiperSlide>
							<Slide
								image={{
									type: "noImage",
								}}
								profileType={profileType}
							/>
						</SwiperSlide>
					))}
			</Swiper>

			{/*<div className={styles.HiddenDebug}>{JSON.stringify(images)}</div>*/}
		</div>
	)
}

export default ProfileSlider
