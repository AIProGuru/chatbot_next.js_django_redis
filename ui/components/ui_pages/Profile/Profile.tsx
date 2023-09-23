import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import React, {useEffect, useState} from "react"
import SplashScreen from "@/components/ui/Splash/SplashScreen"
import ProfileSlider from "@/components/ui/Carousel/ProfileSlider/ProfileSlider"
import BasicProfile from "@/components/ui/Profiles/BasicProfile/BasicProfile"
import ProfileActions from "@/components/ui/Profiles/ProfileActions/ProfileActions"
import ProfileDescription from "@/components/ui/Profiles/ProfileDescription/ProfileDescription"
import DetailsProfile from "@/components/ui/Profiles/DetailsProfile/DetailsProfile"
import ProfileInfo from "@/components/ui/Profiles/ProfileInfo/ProfileInfo"
import ProfilesMet from "@/components/ui/Profiles/ProfilesMet/ProfilesMet"
import {useRouter} from "next/router"
import {
	IsFavoriteProfileResponse,
	useAddToFavoriteProfileMutation,
	useBlockingProfileMutation,
	useLazyGetBlockProfilesQuery,
	useLazyGetFavoriteProfilesQuery,
	useLazyGetIsFavoriteProfileQuery,
	useLazyGetProfileDataQuery,
	useLazyProfileIsBlockQuery,
	useRemoveFromFavoriteProfileByProfileIdMutation,
	useRemoveFromFavoriteProfileMutation,
	UserProfilesInfoProfile,
	useUnBlockingProfileMutation,
} from "@/services/users.service"
import {useTranslation} from "next-i18next"
import {goBackEditMode} from "@/components/ui/Functions/GoBack"
import Drawer from "@/components/ui/Drawer/Drawer/Drawer"
import SwitchOption from "@/components/ui/Drawer/SwitchOption/SwitchOption"
import {useLazyGetProfileRecommendationsQuery} from "@/services/recommendations.service"
import {
	useApproveRequestProfileMutation,
	useAskPrivatePhotosStatusMutation,
	useChangeStatusRequestMutation,
	useGetProfileImagesMutation,
	useLazyGetRequestsProfileQuery,
	useRequestPrivateImagesProfileMutation,
	useSendPrivatePhotosStatusMutation,
} from "@/services/images.service"
import {toggleChatMode, toggleEditMode} from "@/redux/slices/EditProfileSlice"
import {connect} from "react-redux"
import {
	ProfileAvailable,
	// SelfAvailable,
	useLazyGetProfileAvailableTodayQuery,
} from "@/services/available.service"
import Button from "@/components/ui/Button/Button/Button"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import {NextSeo} from "next-seo"
import {useLazyGetBlogsQuery} from "@/services/blog.service"
import {format} from "date-fns"
import BlogAd from "@/components/ui/Blog/BlogAd/BlogAd"
import Divider from "@/components/ui/Divider/Divider"
import Section from "@/components/ui/SignUp/Section/Section"
import RequestPhotos from "@/components/ui/Profiles/RequestPhotos/RequestPhotos"
import UnlockIcon from "@/components/ui/Icons/Unlock/UnlockIcon"
import PlaneIcon from "@/components/ui/Icons/Plane/PlaneIcon"
import RecommendationIcon from "@/components/ui/Icons/Recommendation/RecommendationIcon"
import BlockIcon from "@/components/ui/Icons/Block/BlockIcon"
import ReportIcon from "@/components/ui/Icons/Report/ReportIcon"
import AvailableTodayBlock from "@/components/ui/Profiles/AvailableToday/AvailableTodayBlock"
import {toggleBodyScroll} from "@/components/ui/Functions/BodyScrollLock"
import LoadMoreButton from "@/components/ui/Button/LoadMoreButton/LoadMoreButton"
import SendMyPrivatePhotos from "@/components/ui/Profiles/SendMyPrivatePhotos/SendMyPrivatePhotos"
import styles from "./Profile.module.scss"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
import {uniqueArrayByParam} from "@/components/ui/Functions/UniqueArray"
import { getDirection } from "@/components/ui/Functions/GetDirection"

type Favorite = {
	id: string
	profile: {
		id?: string
		about?: string
		couple_name?: string
		is_online?: false
		location?: {
			id?: number
			title: string
		}
		profile_image?: string[]
		profile_type?: "MAN" | "WOMAN" | "COUPLE"
	}
}

type Option = {
	id: number
	title: string
	icon: any
	callback: Function
	disabled?: boolean
}

function Profile(props: any) {
	const {t} = useTranslation("site")
	const {
		editProfileState,
		toggleEditMode,
		toggleChatMode,
		modalProfileID,
		closeModal,
	} = props

	// loading prop demo
	const [isLoading, setIsLoading] = useState(true)
	const [showSplash, setShowSplash] = useState(true)
	const [selfProfiles, setSelfProfiles] = useState<string[]>([])
	const [selfProfileInfo, setSelfProfileInfo] = useState<
		UserProfilesInfoProfile | undefined
	>(undefined)
	const [showDrawer, setShowDrawer] = useState(false)
	const [profileOptionsDrawerTrigger, setProfileOptionsDrawerTrigger] =
		useState(false)
	const [requestPhotosStatus, setRequestPhotosStatus] = useState(false)
	const [sendPhotosStatus, setSendPhotosStatus] = useState(false)
	const [profileImage, setProfileImage] = useState([])
	const [recommendationList, setRecommendationList] = useState<
		any[] | undefined
	>(undefined)
	const [profileAvatar, setProfileAvatar] = useState<object[]>([])
	const [id, setID] = useState<string | undefined>(undefined)
	const [showRequest, setShowRequest] = useState<boolean>(false)
	const [showCantSendMessage, setShowCantSendMessage] =
		useState<boolean>(false)
	const [blogs, setBlogs] = useState<any>([])
	const [countBlogPages, setCountBlogPages] = useState(1)
	const [getProfileData, setGetProfileData] = useState<any>(undefined)
	const [selfImages, setSelfImages] = useState([])
	const [profileAvailable, setProfileAvailable] = useState<
		ProfileAvailable | undefined
	>(undefined)
	const [isFavorite, setIsFavorite] = useState<boolean>(false)

	const [registerRequestPrivateImagesProfile] =
		useRequestPrivateImagesProfileMutation()
	const [triggerGetProfileRecommendations, profileRecommendations] =
		useLazyGetProfileRecommendationsQuery()

	const [registerApproveRequestProfile] = useApproveRequestProfileMutation()

	const triggerProfileOptionsDrawer = () => {
		setProfileOptionsDrawerTrigger(true)
		setTimeout(() => {
			setProfileOptionsDrawerTrigger(false)
		}, 100)
	}

	const [registerBlockingProfile] = useBlockingProfileMutation()
	const [registerUnBlockingProfile] = useUnBlockingProfileMutation()
	const [triggerProfileIsBlock, ProfileIsBlock] = useLazyProfileIsBlockQuery()
	const [triggerBlockProfile, AllBlockProfile] =
		useLazyGetBlockProfilesQuery()

	// rtk mutation to register to favorites profile
	const [registerAddToFavorite] = useAddToFavoriteProfileMutation()

	// rtk mutation to remove from favorites profile
	const [registerRemoveFromFavorite] =
		useRemoveFromFavoriteProfileByProfileIdMutation()

	const [triggerIsFavorite] = useLazyGetIsFavoriteProfileQuery()
	const [triggerGetProfileData, getProfileDataResponse] =
		useLazyGetProfileDataQuery()

	const [registerChangeStatusRequest] = useChangeStatusRequestMutation()

	const [triggerRequestsProfile, allRequestsProfile] =
		useLazyGetRequestsProfileQuery()

	const [triggerProfileAvailableToday, profileAvailableResponse] =
		useLazyGetProfileAvailableTodayQuery()

	const [triggerGetProfileBlogs, AllProfileBlogs] = useLazyGetBlogsQuery()
	const [registerGetProfileImages] = useGetProfileImagesMutation()

	// router
	const router = useRouter()
	// const {uid} = router.query
	const userProfilesData = useGetUserProfilesInfo()
	const dir = getDirection(router)

	const currentProfile: any | null =
		(userProfilesData &&
			userProfilesData.profiles &&
			userProfilesData.profiles.find((profile: any) => {
				return userProfilesData?.current_profile_id === profile.id
			})) ||
		null

	const cant_send_messages = currentProfile
		? getProfileData?.can_send_messages?.includes(
				currentProfile?.profile_type
		  )
		: false

	const profileRequest = allRequestsProfile?.data?.find((item: any) => {
		return !!(
			item.requesting_profile_id === id && item.status === "PENDING"
		)
	})

	const profilesBlock =
		(AllBlockProfile && AllBlockProfile?.data?.results) || []

	const showCantMessageModal = () => {
		setShowRequest(false)
		setShowDrawer(false)
		setShowCantSendMessage(true)
	}

	const requestToSeePrivateImages = () => {
		if (
			userProfilesData.subscription?.subscription === "WITHOUT" &&
			selfProfileInfo &&
			selfProfileInfo.profile_type === "MAN"
		) {
			router.push("/profiles/my/subscriptions")
			return
		}
		if (cant_send_messages) {
			showCantMessageModal()
			return
		}
		if (getProfileData?.id && userProfilesData?.current_profile_id) {
			registerRequestPrivateImagesProfile({
				myProfileId: getProfileData?.id,
				profileId: userProfilesData?.current_profile_id.toString(),
			})
				.unwrap()
				.then((r) => {
					setRequestPhotosStatus(true)
					// setShowDrawer(false)
				})
				.catch((e) => {
					console.log(e)
					setRequestPhotosStatus(true)
					// setShowDrawer(false)
				})
				.finally(() => {
					triggerProfileOptionsDrawer()
				})
		}
	}

	const requestToSeeSelfPrivateImages = () => {
		if (cant_send_messages) {
			showCantMessageModal()
			return
		}
		if (getProfileData?.id && userProfilesData?.current_profile_id) {
			registerApproveRequestProfile({
				myProfileId: userProfilesData?.current_profile_id.toString(),
				profileId: getProfileData?.id,
			})
				.unwrap()
				.then((r: any) => {
					setSendPhotosStatus(true)
					// setShowDrawer(false)
				})
				.catch((e: any) => {
					console.log(e)
					setSendPhotosStatus(true)
					// setShowDrawer(false)
				})
				.finally(() => {
					triggerProfileOptionsDrawer()
				})
		}
	}

	useEffect(() => {
		if (modalProfileID) {
			setID(modalProfileID)
		}
	}, [modalProfileID])

	const getIsFavoriteProfile = () => {
		if (id) {
			triggerIsFavorite({
				profileId: id,
			})
				.unwrap()
				.then((r: IsFavoriteProfileResponse) => {
					if (r && r.count > 0) {
						setIsFavorite(true)
					} else {
						setIsFavorite(false)
					}
				})
				.catch((e) => {
					console.log(e)
				})
		}
	}

	useEffect(() => {
		setIsFavorite(false)
		getIsFavoriteProfile()
	}, [id])

	useEffect(() => {
		if (profileRequest) {
			setShowRequest(true)
		} else {
			setShowRequest(false)
		}
	}, [profileRequest])

	useEffect(() => {
		if (id) {
			triggerGetProfileData({
				profileId: id,
			})
		}
	}, [id])

	useEffect(() => {
		if (
			getProfileDataResponse &&
			getProfileDataResponse.status === "fulfilled"
		) {
			setGetProfileData(getProfileDataResponse.data)
		}
	}, [getProfileDataResponse])

	useEffect(() => {
		if (id) {
			triggerProfileAvailableToday({
				profile_id: id,
			})
		}
	}, [id])

	useEffect(() => {
		if (profileAvailableResponse && profileAvailableResponse.isSuccess) {
			setProfileAvailable(profileAvailableResponse.data)
		}
		if (profileAvailableResponse && profileAvailableResponse.isError) {
			setProfileAvailable(undefined)
		}
	}, [profileAvailableResponse])

	useEffect(() => {
		if (typeof id === "string") {
			triggerProfileIsBlock({
				page: 1,
				pageSize: 10,
				profile_id: id,
			})
			triggerBlockProfile({
				page: 1,
				pageSize: 10,
				blocking_profile: id,
			})
		}
	}, [id])

	useEffect(() => {
		if (userProfilesData && userProfilesData.profiles) {
			const pr = userProfilesData.profiles.map(
				(profile: any) => profile.id
			)
			const profileInfo = userProfilesData.profiles.find(
				(profile: any) => {
					return profile.id === userProfilesData.current_profile_id
				}
			)
			setSelfProfiles(pr)
			setSelfProfileInfo(profileInfo)
		}
		// setSelfProfiles(
		// 	userProfilesData?.profiles.map((profile: any) => profile.id)
		// )
	}, [userProfilesData])

	useEffect(() => {
		if (
			getProfileData &&
			getProfileData?.id &&
			userProfilesData &&
			userProfilesData?.current_profile_id &&
			userProfilesData?.current_profile_id !== getProfileData?.id
		) {
			triggerRequestsProfile({})
			triggerGetProfileBlogs({
				page: 1,
				pageSize: 3,
				search: "",
				current_profile_id: getProfileData?.id,
				ordering: "MOST_POPULAR",
			})
		}
	}, [getProfileData])

	useEffect(() => {
		if (getProfileData && getProfileData?.id) {
			triggerGetProfileBlogs({
				page: countBlogPages,
				pageSize: 3,
				search: "",
				current_profile_id: getProfileData?.id,
				ordering: "MOST_POPULAR",
			})
		}
	}, [countBlogPages, getProfileData])

	useEffect(() => {
		if (AllProfileBlogs && AllProfileBlogs?.data?.results) {
			setBlogs((prevProfile: any) =>
				uniqueArrayByParam(
					[...prevProfile, ...AllProfileBlogs?.data?.results],
					"slug"
				)
			)
		}
	}, [AllProfileBlogs])

	useEffect(() => {
		if (
			typeof id === "string" &&
			userProfilesData &&
			userProfilesData?.current_profile_id
		) {
			const requestingProfileId =
				userProfilesData?.current_profile_id.toString()
			registerGetProfileImages({
				myProfileId: id,
				profileId: requestingProfileId,
			})
				.unwrap()
				.then((r) => {
					setProfileImage(r.images)
					r.requests.forEach((request: any) => {
						if (
							request.profile_id === id &&
							request.requesting_profile_id === requestingProfileId
							&& request.status !== 'DISAPPROVED'
						) {
							setRequestPhotosStatus(true)
						} else if (
							request.profile_id === requestingProfileId &&
							request.requesting_profile_id === id
							&& request.status !== 'DISAPPROVED'
							) {
							setSendPhotosStatus(true)
						}
					})
				})
				.catch((e) => {
					console.log(e)
					// setProfileImage([])
				})
		}
	}, [id, userProfilesData])

	useEffect(() => {
		if (userProfilesData && userProfilesData?.current_profile_id) {
			registerGetProfileImages({
				myProfileId: userProfilesData?.current_profile_id.toString(),
				profileId: userProfilesData?.current_profile_id.toString(),
			})
				.unwrap()
				.then((r) => {
					setSelfImages(r.images)
				})
				.catch((e) => {
					console.log(e)
					// setProfileImage([])
				})
		}
	}, [userProfilesData])


	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false)
		}, 1000)
	}, [setIsLoading])

	// useEffect(() => {
	// 	if (uid && typeof uid === "string" && !modalProfileID) {
	// 		setID(uid)
	// 	}
	//
	// 	if (modalProfileID && !uid) {
	// 		setID(modalProfileID)
	// 	}
	// }, [uid, modalProfileID])

	useEffect(() => {
		if (id && !Array.isArray(id)) {
			triggerGetProfileRecommendations({
				profileId: id,
			})
		}
	}, [id])

	useEffect(() => {
		if (profileRecommendations) {
			setRecommendationList(profileRecommendations.data)
		}
	}, [profileRecommendations])

	const requestToBlockingProfile = () => {
		if (typeof id === "string") {
			registerBlockingProfile({
				uuid: id,
			})
				.unwrap()
				.then((r: any) => {
					setShowDrawer(false)
					triggerBlockProfile({
						page: 1,
						pageSize: 10,
						blocking_profile: id,
					})
				})
				.catch((e: any) => {
					console.log(e)
					setShowDrawer(false)
				})
		}
	}

	const requestToUnBlockingProfile = () => {
		if (
			profilesBlock?.length &&
			profilesBlock[0] &&
			typeof id === "string"
		) {
			registerUnBlockingProfile({
				uuid: profilesBlock[0]?.id,
			})
				.unwrap()
				.then((r: any) => {
					setShowDrawer(false)
					triggerBlockProfile({
						page: 1,
						pageSize: 10,
						blocking_profile: id,
					})
				})
				.catch((e: any) => {
					console.log(e)
					setShowDrawer(false)
				})
		}
	}

	const privateImages = profileImage.filter((image: any) =>
		["PRIVATE_BLUR", "PRIVATE"].includes(image.type)
	)

	const privateSelfImages = selfImages.filter((image: any) =>
		["PRIVATE_BLUR", "PRIVATE"].includes(image.type)
	)

	const optionsList: Option[] = [
		{
			id: 1,
			title: requestPhotosStatus
				? t("site.You have already asked to watch their private photos")
				: t("site.Ask a passionate couple to watch their privacy"), // request private info
			icon: <UnlockIcon />,
			callback: () => {
				requestToSeePrivateImages()
			},
			disabled:
				requestPhotosStatus ||
				(privateImages.length && selfImages.length ? false : true),
		},
		{
			id: 2,
			title: sendPhotosStatus
				? t("site.You have already open your photos to them")
				: t("site.Send your hot couple your privacy"), // open to them my private info
			icon: <PlaneIcon />,
			callback: () => {
				requestToSeeSelfPrivateImages()
			},
			disabled:
				sendPhotosStatus || (privateSelfImages.length ? false : true),
		},
		{
			id: 3,
			title: t("site.Write down what you think of a hot couple"), // recommendation
			icon: <RecommendationIcon />,
			callback: () => {
				router.push(`/profiles/${id}/recommendations/new`).then()
			},
		},
		{
			id: 4,
			title: profilesBlock.length
				? t("site.Unblock the hot couple")
				: t("site.Block the hot couple"), // block
			icon: <BlockIcon />,
			callback: () =>
				profilesBlock.length
					? requestToUnBlockingProfile()
					: requestToBlockingProfile(),
		},
		{
			id: 5,
			title: t("site.I want to report a hot couple"), // report
			icon: <ReportIcon />,
			callback: () => {
				router.push(`/profiles/${id}/report`).then()
			},
		},
	]

	const getLanguages = () =>
		getProfileData?.languages?.map((l: any) => l.title)
	const getActs = () => getProfileData?.acts?.map((l: any) => l.title)
	const getFavorites = () =>
		getProfileData?.favorites?.map((l: any) => l.title)
	const getSuits = () => getProfileData?.suits?.map((l: any) => l.title)
	const getStages = () => getProfileData?.stages?.map((l: any) => l.title)

	const getManStatistic = (man: any) => {
		const {
			height,
			age,
			sexual_orientation,
			body_hair,
			skin,
			most_impressive,
			body_structure,
			smoking,
			nickname,
			birthday_day,
			birthday_month,
		} = man
		return {
			nickname: nickname,
			profileType: "MAN",
			// birthday: `${birthday_day}/${birthday_month}`,
			age: age,
			height: height,
			bodyType: body_structure?.title,
			sexualOrientation: sexual_orientation?.title,
			impressive: most_impressive?.title,
			skinTone: skin?.title,
			bodyHair: body_hair?.title,
			smoking: smoking?.title,
		}
	}

	const getWomanStatistic = (woman: any) => {
		const {
			height,
			age,
			sexual_orientation,
			skin,
			most_impressive,
			body_structure,
			smoking,
			nickname,
			birthday_day,
			birthday_month,
			chest_size,
		} = woman
		return {
			nickname: nickname,
			profileType: "WOMAN",
			// birthday: `${birthday_day}/${birthday_month}`,
			age: age,
			height: height,
			bodyType: body_structure?.title,
			chestSize: chest_size?.title,
			sexualOrientation: sexual_orientation?.title,
			impressive: most_impressive?.title,
			skinTone: skin?.title,
			smoking: smoking?.title,
		}
	}

	// const getPreferSpace = (id: number) => {
	// 	switch (id) {
	// 		case 1:
	// 			return t("site.Prefer separate rooms")
	// 		case 2:
	// 			return t("site.Prefer one place")
	// 		case 3:
	// 			return t("site.Does not matter")
	// 		default:
	// 			return ""
	// 	}
	// }

	const man = getProfileData?.man
	const woman = getProfileData?.woman

	const isPair = man && woman
	const isMan = man && !getProfileData?.woman
	const isWoman = !getProfileData?.man && woman

	function closeProfile() {
		// if edit mode
		if (editProfileState && editProfileState.editMode) {
			goBackEditMode(router, toggleEditMode)
			return
		}

		// if from chat
		if (editProfileState && editProfileState.chatMode) {
			goBackEditMode(router, toggleChatMode)
			return
		}

		toggleBodyScroll(false)
		router.back()

		// router.back()
		// router
		// 	.push("/?profile_list_uid=", {pathname: "/"}, {scroll: false})
		// 	.then()

		// router.push("/", undefined, {shallow: true}).then()

		// // if modal
		// if (modalProfileID && closeModal) {
		// 	closeModal(false)
		// 	return
		// }
		//
		// // etc
		// goBack(router, "/", [
		// 	"/",
		// 	"/favorites",
		// 	"/favorites",
		// 	"/peek-at-me/",
		// ])
	}

	const getNickName = () => {
		switch (getProfileData?.profile_type) {
			case "MAN":
				return getProfileData?.man?.nickname
			case "WOMAN":
				return getProfileData?.woman?.nickname
			case "COUPLE":
				return getProfileData?.couple_nickname
		}
	}

	const makeAsFavorite = () => {
		if (cant_send_messages) {
			showCantMessageModal()
			return
		}
		if (!id) return
		let data = {
			profile: id,
		}

		registerAddToFavorite({
			data: data,
		})
			.unwrap()
			.then((r) => {
				getIsFavoriteProfile()
				console.log(r)
			})
			.catch((e) => {
				console.log(e)
			})
	}

	const removeFromFavorite = () => {
		if (cant_send_messages) {
			showCantMessageModal()
			return
		}
		if (!id) return
		registerRemoveFromFavorite({
			profileId: id,
		})
			.unwrap()
			.then((r) => {
				console.log(r)
				getIsFavoriteProfile()
			})
			.catch((e) => {
				console.log(e)
			})
	}

	const setStatusRequestProfile = (
		id: string,
		status: "APPROVED" | "DISAPPROVED"
	) => {
		registerChangeStatusRequest({
			requestId: id,
			status: status,
		})
			.unwrap()
			.then((r: any) => {
				setShowRequest(false)
			})
			.catch((e: any) => {
				console.log(e)
			})
	}

	const isMain = typeof id === "string" && selfProfiles?.includes(id)

	// if (!id || !modalProfileID) return null
	if (!id) return null

	return (
		<>
			<NextSeo title={`${t("site.Profiles")} | ${getNickName()}`} />
			{showSplash ? (
				<SplashScreen
					isLoading={isLoading}
					setShowSplash={setShowSplash}
				/>
			) : (
				<AppDefaultLayout useHeader={false} useTabBar={false}>
					<div className="Profile">
						<Drawer
							show={showDrawer}
							setShow={setShowDrawer}
							position={"bottom"}
							trigger={profileOptionsDrawerTrigger}
						>
							<div className="ProfileOptionsContainer">
								{optionsList &&
									optionsList
										.filter((item) => {
											if (ProfileIsBlock?.data?.detail) {
												return item.id === 4
											} else {
												return item
											}
										})
										.map(
											(option: Option, index: number) => {
												return (
													<SwitchOption
														key={index}
														title={option.title}
														icon={option.icon}
														onClick={
															option.callback
														}
														{...(option.disabled && {
															disabled: true,
														})}
													/>
												)
											}
										)}
							</div>
						</Drawer>
						<ProfileSlider
							images={profileImage}
							closeCallback={closeProfile}
							makeAsFavorite={makeAsFavorite}
							removeFromFavorite={removeFromFavorite}
							favorite={isFavorite}
							isMain={isMain}
							cantSendMessagesList={
								getProfileData?.can_send_messages
							}
							requestPhotosStatus={requestPhotosStatus}
							selfImages={selfImages}
							optionsCallback={setShowDrawer}
							requestToSeePrivateImages={
								requestToSeePrivateImages
							}
							subscription={
								getProfileData && getProfileData.subscription
									? getProfileData.subscription
									: "WITHOUT"
							}
							profileType={
								getProfileData && getProfileData.profile_type
									? getProfileData.profile_type
									: "COUPLE"
							}
							checkBlock={!ProfileIsBlock?.data?.detail}
						/>
						<BasicProfile
							profile={{
								nickname: getNickName(),
								status: getProfileData?.relation?.title,
								languages: getLanguages(),
								profileType: getProfileData?.profile_type,
							}}
							age={{
								man: getProfileData?.man?.age,
								woman: getProfileData?.woman?.age,
							}}
							location={{
								title: getProfileData?.location?.title,
								distance: 1,
							}}
							verifiedStatus={getProfileData?.verified || false}
							networkStatus={getProfileData?.is_online}
						/>

						<AvailableTodayBlock
							profileAvailable={profileAvailable}
						/>

						{getProfileData &&
							getProfileData.user_username &&
							!ProfileIsBlock?.data?.detail &&
							!isMain && (
								<ProfileActions
									profileID={id.toString()}
									profileUsername={
										getProfileData.user_username
									}
									nickname={getNickName()}
								/>
							)}

						{/* private images button*/}
						{!isMain && !ProfileIsBlock?.data?.detail && (
							<div className={styles.ProfileRequestButtons} style={{direction: dir === "ltr" ? "ltr" : "rtl"}}>
								<RequestPhotos
									callback={requestToSeePrivateImages}
									status={requestPhotosStatus}
									disabled={
										privateImages.length &&
										selfImages.length
											? false
											: true
									}
								/>
								<SendMyPrivatePhotos
									callback={requestToSeeSelfPrivateImages}
									status={sendPhotosStatus}
									disabled={
										privateSelfImages.length ? false : true
									}
								/>
							</div>
						)}

						<ProfileInfo
							profiles={
								isPair
									? [
											getManStatistic(
												getProfileData?.man
											),
											getWomanStatistic(
												getProfileData?.woman
											),
									  ]
									: isMan
									? [getManStatistic(getProfileData?.man)]
									: isWoman
									? [getWomanStatistic(getProfileData?.woman)]
									: []
							}
						/>
						<ProfileDescription rows={[getProfileData?.about]} />
						<DetailsProfile
							blocks={[
								{
									title: t("site.Suits_p"), // suits
									items: getSuits(),
								},
								{
									title: t("site.Preferred relationships"), // favourites
									items: getFavorites(),
								},
								{
									title: t("site.Stages"), // stages
									items: getStages(),
								},
								{
									title: t("site.The acts that turn us on"), // acts
									items: getActs(),
								},
								{
									title: t(
										"site.Prefer sex in separate rooms p"
									), // spaces
									items: getProfileData?.prefer_space
										? [getProfileData?.prefer_space.title]
										: [],
								},
								{
									title: t("site.smoking"), //smoke
									items: getProfileData?.smoking_prefer
										? [getProfileData?.smoking_prefer.title]
										: [],
								},
								{
									title: t("site.Drink alcohol"), // alcohol
									items: getProfileData?.alcohol
										? [getProfileData?.alcohol.title]
										: [],
								},
								{
									title: t("site.Available"), // available
									items: getProfileData?.available
										? [getProfileData?.available.title]
										: [],
								},
								{
									title: t("site.Hosted"), // hosted
									items: getProfileData?.hosted
										? [getProfileData?.hosted.title]
										: [],
								},
								// {
								// 	title: t("site.Separate room or one space"),
								// 	items: [
								// 		getPreferSpace(
								// 			getProfileData?.prefer_space
								// 		),
								// 	],
								// },
								{
									title: t("site.Experience"),
									items: getProfileData?.experience
										? [getProfileData?.experience.title]
										: [],
								},
							]}
						/>
						{recommendationList &&
							recommendationList.length > 0 &&
							!ProfileIsBlock?.data?.detail && (
								<ProfilesMet
									recommendations={recommendationList}
								/>
							)}
						{!!blogs.length && !ProfileIsBlock?.data?.detail && (
							<Section
								title={t("site.Blogs")}
								padding={"small"}
								boldTitle
								variant={"profile"}
							>
								<Divider />
								<div className="OtherBlogs">
									{blogs
										.filter(
											(blog: any) =>
												id === blog?.current_profile_id
										)
										.map(
											(profileAd: any, index: number) => {
												const {
													number_of_comments,
													number_of_views,
													title,
													text,
													slug,
													created,
												} = profileAd

												return (
													<BlogAd
														key={index}
														href
														images={profileAvatar}
														profile={{
															id: getProfileData?.id,
															manAge: getProfileData
																?.man?.age,
															womanAge:
																getProfileData
																	?.woman
																	?.age,
															profileType:
																getProfileData?.profile_type,
															description: text,
															verified: true,
															nickname:
																getNickName(),
															username:
																getProfileData?.user_username,
															dateCreate: `
													${t("site.Posted in")} -${" "}
													${format(new Date(created), "dd/MM/yyyy")}${" "}
													${t("site.At")} ${" "}
													${format(new Date(created), "HH:mm")}`,
															titleBlog: title,
															commentCount:
																number_of_comments,
															viewedCount:
																number_of_views,
															slug: slug,
														}}
													/>
												)
											}
										)}
									<LoadMoreButton
										page={countBlogPages}
										count={AllProfileBlogs?.data?.count}
										isLoading={AllProfileBlogs?.isFetching}
										label={t("site.the next")}
										id={"button_load_more"}
										onClick={() => {
											setCountBlogPages(
												countBlogPages + 1
											)
										}}
									/>
								</div>
							</Section>
						)}
					</div>
					<div
						className="RequestImagesPopup"
						style={{display: showRequest ? "block" : "none"}}
					>
						<div className="RequestImages">
							<div className="GoBack">
								<TransparentButton
									icon={<CloseIcon />}
									id={"transparent_button_go_back"}
									onClick={() => setShowRequest(false)}
								/>
							</div> 
							<p>
								{t("site.You received a request from Bunnies")}{" "}
								{t("site.To view your private photos")}
							</p>
							<div className="Actions">
								<Button
									type={"button"}
									mode={"submit"}
									prevent={false}
									fullWidth={true}
									onClick={() =>
										setStatusRequestProfile(
											profileRequest?.id,
											"APPROVED"
										)
									}
								>
									<p className="AcceptButtonText">
										{t("site.Privacy certificate")}
									</p>
								</Button>
								<Button
									type={"button"}
									mode={"submit"}
									prevent={false}
									fullWidth={true}
									color={"black"}
									variant={"outline"}
									onClick={() =>
										setStatusRequestProfile(
											profileRequest?.id,
											"DISAPPROVED"
										)
									}
								>
									<p className="ButtonText">
										{t("site.Reject")}
									</p>
								</Button>
							</div>
						</div>
					</div>
					<div
						className="RequestImagesPopup"
						style={{
							display: showCantSendMessage ? "block" : "none",
						}}
					>
						<div className="RequestImages">
							<div className="GoBack">
								<TransparentButton
									icon={<CloseIcon />}
									id={"transparent_button_go_back"}
									onClick={() =>
										setShowCantSendMessage(false)
									}
								/>
							</div>
							<p>
								{t(
									"site.This profile filters your profile type, but you can still try to send a message"
								)}
							</p>
						</div>
					</div>
				</AppDefaultLayout>
			)}
		</>
	)
}

// export default Profile
const mapStateToProps = (state: any) => ({
	editProfileState: state.EditProfileSlice,
})

const mapDispatchToProps = {
	toggleEditMode: toggleEditMode,
	toggleChatMode: toggleChatMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
