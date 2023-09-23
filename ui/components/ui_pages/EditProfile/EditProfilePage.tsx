import styles from "./EditProfilePage.module.scss"
import BlogNewHeader from "@/components/ui/Blog/New/Header/BlogNewHeader"
import {TFunction, useTranslation} from "next-i18next"
import {useRouter} from "next/router"
import {useEffect, useMemo, useState} from "react"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import {connect} from "react-redux"
import InputText from "@/components/ui/Forms/Inputs/Text/InputText"
import TextArea from "@/components/ui/Forms/Inputs/TextArea/TextArea"
import EditProfileListItem from "@/components/ui/List/EditProfile/EditProfileListItem"
import SubscriptionNotification from "@/components/ui/Subscripbtions/Notification/SubscriptionNotification"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {cc} from "@/components/ui/Functions/Classnames"
import Button from "@/components/ui/Button/Button/Button"
import Link from "@/components/ui/Button/Link/Link"
import {
	GetProfileDataResponse,
	useLazyGetProfileDataQuery,
	useProfilePartialUpdateMutation,
} from "@/services/users.service"
import {useForm, Controller} from "react-hook-form"
import {toggleEditMode} from "@/redux/slices/EditProfileSlice"
import {yupResolver} from "@hookform/resolvers/yup"
import {EditMyProfileSchema} from "@/app/validation/EditMyProfile.schema"
import {debounce} from "@/components/ui/Functions/Debounce"
import { 
	ProfileAvatar,
	useLazyGetProfileAvatarsOptimisedQuery,
} from "@/services/images.service"
import {removeSpaces} from "@/components/ui/Functions/RemoveSpaces"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
import AdminMessage from "@/components/ui/AdminMessage/AdminMessage"

// import Drawer from "@/components/ui/Drawer/Drawer/Drawer"
import {
	checkSubscription, 
	Flag,
} from "@/components/ui/Functions/CheckSubscription"
import {format} from "date-fns"




type NavItem = {
	title: string
	callback?: Function
	value?: any
}

type ErrorTranslations = {
	[x: string]: any
}



const getPageTranslations = (t: TFunction) => {
	return {
		header: {
			title: t("site.Edit my profile"), // edit my profile
		},
		container: {
			basic_info: {
				nickname: t("site.Our nickname"), // nickname
				about: t("site.About Us"), // about
				aboutBox: t("site.About Us Box"), // about
			},
		},
		profile_nav: {
			edit_photo: t("site.Photo editing"),
			details_woman: t("site.Details of the woman"),
			details_man: t("site.Details of the man"),
			details_other: t("site.Some more details"),
			languages: t("site.Languages"),
			connection: t("site.The connection we built"),
			area: t("site.Area"),
			area2: t("site.Locality"),
			notifications: t("site.Alert management"),
		},
		profile_lists: {
			section_title: t("site.My lists"),
			blocked: t("site.Profiles I blocked"),
			recommendations: t("site.I was recommended"),
			comments: t("site.My comments"),
		},
		actions: {
			preview_profile: t("site.Want to see what your profile looks like"),
			freeze_profile: t("site.Freeze profile"),
		},
	}
}

const getErrorTranslations = (t: TFunction): ErrorTranslations => {
	return {
		profile_edit_about_min_length: t(
			"site.profile_edit_about_must_be_at_least_25_characters"
		),
		profile_edit_about_max_length: t("site.profile_edit_about_max_length"),
		profile_edit_nickname_startsWithSpace: t(
			"site.profile_edit_nickname_startsWithSpace"
		),
		profile_edit_nickname_noSpecialCharacters: t(
			"site.profile_edit_nickname_noSpecialCharacters"
		),
		yup_nickname_required: t("site.nickname_is_required"),
		yup_pr_step6_about_required: t("site.yup_pr_step6_about_required"),
		profile_edit_about_no_number: t("site.profile_edit_about_no_number")
	}
}

function EditProfilePage(props: any) {
	const {toggleEditMode} = props
	const {t} = useTranslation("site")
	const router = useRouter()
	const dir = getDirection(router)
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])
	const errorTranslations = useMemo(() => {
		return getErrorTranslations(t)
	}, [t])
	const {control, handleSubmit, watch} = useForm({
		resolver: yupResolver(EditMyProfileSchema),
		mode: "onChange",
		shouldFocusError: false,
	})

	const userProfilesData = useGetUserProfilesInfo()

	// rtk
	const [triggerGetProfileData, getProfileData] = useLazyGetProfileDataQuery()
	const [getProfilesAvatar] = useLazyGetProfileAvatarsOptimisedQuery()
	const [profilePartialUpdate] = useProfilePartialUpdateMutation()

	// state
	const [profileData, setProfileData] = useState<
		GetProfileDataResponse | undefined
	>(undefined)
	const [profileNav, setProfileNav] = useState<NavItem[]>([])
	const [profileAvatars, setProfileAvatars] = useState<
		ProfileAvatar | undefined
	>(undefined)
	const [avatar, setAvatar] = useState("")
	const [open, setOpen] = useState(true)
	// const [drawerState, setDrawerState] = useState(false)
	// const [drawerTrigger, setDrawerTrigger] = useState(false)

	// function updateDrawer(state: boolean) {
	// 	setDrawerState(state)
	// }

	const [saved, setSaved] = useState(false)

	useEffect(() => {
		setTimeout(() => setSaved(false), 1800)
	}, [saved])

	const debouncedSubmit = debounce((data: any) => {
		if (
			(data.nickname || data.nickname.length >= 0) &&
			(data.about || data.about.length >= 0)
		) {
			profilePartialUpdate({
				body: {
					nickname: removeSpaces(data.nickname),
					about: removeSpaces(data.about),
				},
			})
				.unwrap()
				.then((r) => {
					setSaved(true)
					console.log(
						"profilePartialUpdate",
						data.nickname,
						data.about,
						r
					)
				})
				.catch((e) => {
					console.log("profilePartialUpdate", e)
				})
		}
		// if (data.nickname) {
		// 	profilePartialUpdate({
		// 		body: {
		// 			nickname: removeSpaces(data.nickname),
		// 		},
		// 	})
		// 		.unwrap()
		// 		.then((r) => {
		// 			console.log(
		// 				"profilePartialUpdate:nickname",
		// 				data.nickname,
		// 				r
		// 			)
		// 		})
		// 		.catch((e) => {
		// 			console.log("profilePartialUpdate:nickname", e)
		// 		})
		// }
		//
		// if (data.about || data.about.length >= 0) {
		// 	profilePartialUpdate({
		// 		body: {
		// 			about: removeSpaces(data.about),
		// 		},
		// 	})
		// 		.unwrap()
		// 		.then((r) => {
		// 			console.log("profilePartialUpdate:about", data.about, r)
		// 		})
		// 		.catch((e) => {
		// 			console.log("profilePartialUpdate:about", e)
		// 		})
		// }
	}, 1000)

	const onSubmit = (data: any) => {
		debouncedSubmit(data)
	}

	useEffect(() => {
		const subscription = watch(() => handleSubmit(onSubmit)())
		return () => subscription.unsubscribe()
	}, [])

	// get profile data
	useEffect(() => {
		if (userProfilesData && userProfilesData.current_profile_id) {
			triggerGetProfileData({
				profileId: userProfilesData.current_profile_id,
			})
		}
	}, [userProfilesData, triggerGetProfileData])

	useEffect(() => {
		if (userProfilesData && userProfilesData.current_profile_id) {
			getProfilesAvatar({
				profileId: userProfilesData.current_profile_id,
			})
				.unwrap()
				.then((r) => {
					setProfileAvatars(r)
				})
				.catch((e) => {
					console.log(e)
				})
		}
	}, [userProfilesData])

	// save profile data
	useEffect(() => {
		if (
			getProfileData &&
			getProfileData.status === "fulfilled" &&
			getProfileData.data
		) {
			setProfileData(getProfileData.data)
		}
	}, [getProfileData])

	const getProfilePhoto = () => {
		const profileType = profileData ? profileData.profile_type : "COUPLE"

		if (profileAvatars) {
			const avatars: ProfileAvatar = profileAvatars

			if (avatars && avatars.s3_url) {
				return setAvatar(avatars.s3_url)
			} else {
				return profileType
					? setAvatar(
							`/profiles/avatar_${profileType.toLowerCase()}_64.png`
					  )
					: setAvatar("/profiles/avatar_couple_64.png")
			}
		} else {
			return profileType
				? setAvatar(
						`/profiles/avatar_${profileType.toLowerCase()}_64.png`
				  )
				: setAvatar("/profiles/avatar_couple_64.png")
		}
	}

	useEffect(() => {
		if (getProfileData.isSuccess && !getProfileData.isFetching) {
			getProfilePhoto()
		}
	}, [profileAvatars, profileData])

	// get profile nickname
	function getProfileNickname() {
		if (profileData) {
			switch (profileData.profile_type) {
				case "WOMAN":
					return profileData.woman.nickname

				case "MAN":
					return profileData.man.nickname

				case "COUPLE":
					return profileData.couple_nickname
			}
		}

		return ""
	}

	// get profile param
	function getProfileParam(param: string) {
		if (profileData) {
			const value = profileData[param]
			if (value) {
				return value
			} else {
				return ""
			}
		}

		return ""
	}

	function handleCallback(href: string) {
		href &&
			router.push(href).then(() => {
				toggleEditMode({state: true})
			})
	}

	useEffect(() => {
		if (profileData && avatar && userProfilesData.current_profile_id) {
			// nav list
			let profileNavPrepare: NavItem[] = [
				{
					title: pageTranslations.profile_nav.edit_photo, // photo editing
					callback: () => {
						handleCallback(
							`/profiles/my/edit/images/${userProfilesData.current_profile_id}`
						)
					},
					value: <img src={avatar} />,
				},
			]

			if (
				profileData &&
				(profileData.profile_type === "WOMAN" ||
					profileData.profile_type === "COUPLE")
			) {
				profileNavPrepare.push({
					title: pageTranslations.profile_nav.details_woman, // woman details
					callback: () => {
						handleCallback(
							`/auth/signup/${userProfilesData.current_profile_id}/step/3-edit`
						)
					},
				})
			}

			if (
				profileData &&
				(profileData.profile_type === "MAN" ||
					profileData.profile_type === "COUPLE")
			) {
				profileNavPrepare.push({
					title: pageTranslations.profile_nav.details_man, // man details
					callback: () => {
						handleCallback(
							`/auth/signup/${userProfilesData.current_profile_id}/step/4-edit`
						)
					},
				})
			}

			profileNavPrepare = [
				...profileNavPrepare,
				{
					title: pageTranslations.profile_nav.details_other, // other details
					callback: () => {
						handleCallback(
							`/auth/signup/${userProfilesData.current_profile_id}/step/5-edit`
						)
					},
				},
				{
					title: pageTranslations.profile_nav.languages, //languages
					callback: () => {
						handleCallback(
							`/auth/signup/${userProfilesData.current_profile_id}/step/2-edit`
						)
					},
				},
				{
					title: pageTranslations.profile_nav.connection, // the connection we built
					callback: () => {
						handleCallback(
							`/auth/signup/${userProfilesData.current_profile_id}/step/1-edit`
						)
					},
				},
				{
					title: pageTranslations.profile_nav.area, // area
					callback: () => {
						handleCallback(
							`/auth/signup/${userProfilesData.current_profile_id}/step/2-edit`
						)
					},
				},
				{
					title: pageTranslations.profile_nav.notifications, // notifications
					callback: () => {
						// todo: open notifications page
						// alert("Destination not specified")
						handleCallback(`/profiles/my/notification-manager`)
					},
				},
			]

			setProfileNav(profileNavPrepare)
		}
	}, [userProfilesData, pageTranslations, profileData, avatar])

	// nav list 2
	const profileLists: NavItem[] = [
		{
			title: pageTranslations.profile_lists.blocked, // blocked profiles
			callback: () => {
				router.push(`/blocks`).then()
			},
		},
		{
			title: pageTranslations.profile_lists.recommendations, // recommendations
			callback: () => {
				handleCallback(`/profiles/my/recommendations`)
			},
		},
		// {
		// 	title: pageTranslations.profile_lists.comments, // comments
		// 	callback: () => {
		// 		// todo: open comments page
		// 		alert("Destination not specified")
		// 	},
		// },
	]

	// go back
	function goBackAction() {
		// router.back()
		router.push("/").then()
	}

	function previewProfile() {
		if (profileData && profileData.id) {
			router.push(`/profiles/${profileData.id}`).then(() => {
				toggleEditMode({state: true})
			})
		}
	}

	function freezeProfile() {
		router.push("/profiles/my/freeze")
	}

	const getTypeSub = () => {
		if (userProfilesData &&
			userProfilesData.subscription &&
			["MULTI", "SINGLE"].includes(userProfilesData.subscription.subscription)) {
			return "VIP"
		}

		return "Free"
	}

	const getValidSub = () => {
		if (
			userProfilesData &&
			userProfilesData.subscription_date_to
		) {
			return format(
				new Date(userProfilesData.subscription_date_to).getTime(),
				"yyyy-MM-dd"
			)
		}

		return undefined
	}

	if (!userProfilesData || !profileData || !profileAvatars) return null

	return (
		<>
			<div className={cc([styles.EditProfilePage, dir && styles[dir]])}>
				<BlogNewHeader
					title={pageTranslations.header.title}
					callback={goBackAction}
					icon={<GoBackIcon />}
				/>
				<div className={styles.Container}>
					<div className={styles.BasicInfo}>
						<AdminMessage
							open={open}
							setOpen={setOpen}
							text={
								<p>
								שימו לב - גם אתם אם חדשים וגם אם אתם כבר חברים שלנו בקהילה
								פרופיל מלא הוא פרופיל שמקבל יותר פניות
								דאגו למלא את כל השדות בפרופיל ואז גם תקודמו בתוצאות חיפוש
								קדימה - דקה שתיים ואתם משודרגים
								</p>
							}
						/> 
						<div className={styles.Field}>
							<p>
								{pageTranslations.container.basic_info.nickname}
							</p>
							<Controller
								render={({field, fieldState}) => {
									return (
										<InputText
											placeholder={
												pageTranslations.container
													.basic_info.nickname
											}
											field={field}
											isSaved={saved}
											maxLength={20}
											id={"input_nickname"}
											error={
												fieldState.error?.message &&
												errorTranslations[
													fieldState.error.message
												]
											}
										/>
									)
								}}
								name={"nickname"}
								control={control}
								defaultValue={getProfileNickname()}
							/>
						</div>
						<div className={styles.Field}>
							<p>{pageTranslations.container.basic_info.about}</p>
							<Controller
								render={({field, fieldState}) => {
									return (
										<TextArea
											placeholder={
												pageTranslations.container
													.basic_info.aboutBox
											}
											field={field}
											isSaved={saved}
											maxLength={500}
											error={
												fieldState.error?.message &&
												errorTranslations[
													fieldState.error?.message
												]
											}
										/>
									)
								}}
								name={"about"}
								control={control}
								defaultValue={getProfileParam("about")}
							/>
						</div>
					</div>
				</div>

				<div className={styles.ProfileNav}>
					{profileNav &&
						profileNav.map((item: NavItem, index: number) => {
							return (
								<EditProfileListItem
									key={index}
									title={item.title}
									{...(item.value && {value: item.value})}
									{...(item.callback && {
										callback: item.callback,
									})}
								/>
							)
						})}
				</div>

				<div className={styles.SubscriptionBanner}>
					<SubscriptionNotification
						subscription={{
							type: getTypeSub(),
							valid_until: getValidSub(),
						}}
						onClick={() => {
							if (
								userProfilesData.subscription &&
								userProfilesData.subscription.subscription &&
								checkSubscription(
									userProfilesData.subscription.subscription,
									Flag.subscriptionEdit
								)
							) {
								// updateDrawer(true)
							} else {
								handleCallback("/profiles/my/subscriptions")
							}
						}}
					/>
				</div>

				<div className={styles.ProfileLists}>
					<p>{pageTranslations.profile_lists.section_title}</p>
					{profileLists &&
						profileLists.map((item: NavItem, index: number) => {
							return (
								<EditProfileListItem
									key={index}
									title={item.title}
									{...(item.callback && {
										callback: item.callback,
									})}
								/>
							)
						})}
				</div>

				<div className={styles.Actions}>
					<div className={styles.ButtonPreviewProfile}>
						<Button
							type={"button"}
							variant={"outline"}
							color={"white"}
							fullWidth={true}
							onClick={previewProfile}
						>
							<p className={styles.PreviewProfileButtonText}>
								{pageTranslations.actions.preview_profile}
							</p>
						</Button>
					</div>
					<div className={styles.ButtonDeleteProfile}>
						<Link
							styled={true}
							onClick={() => {
								freezeProfile()
							}}
						>
							{pageTranslations.actions.freeze_profile}
						</Link>
					</div>
				</div>
			</div>
			{/* TODO: fix the get user subscription to get from user profiles info and activate */}
			{/* <Drawer
				show={drawerState}
				setShow={setDrawerState}
				position={"bottom"}
				trigger={drawerTrigger}
				title={t("site.Editing a tariff")}
			>
				<SubsciptionsModal />
			</Drawer> */}
		</>
	)
}

const mapStateToProps = (state: any) => ({
	editProfileState: state.EditProfileSlice,
})

const mapDispatchToProps = {
	toggleEditMode: toggleEditMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfilePage)
