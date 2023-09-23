import React, {useEffect, useMemo, useState} from "react"
import SplashScreen from "@/components/ui/Splash/SplashScreen"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {TFunction, useTranslation} from "next-i18next"
import {useRouter} from "next/router"
import {NextSeo} from "next-seo"
import Divider from "@/components/ui/Divider/Divider"
import EditProfileListItem from "@/components/ui/List/EditProfile/EditProfileListItem"
import Drawer from "@/components/ui/Drawer/Drawer/Drawer"
import {Controller, useForm, useWatch} from "react-hook-form"
import InputCheckboxHorizontalTransparent from "@/components/ui/Forms/Inputs/CheckboxHorizontalTransparent/InputCheckboxHorizontalTransparent"
import {
	getSelectedKeysFromObject,
	getSelectedStringIds,
} from "@/components/ui/Functions/GetSelectedIDs"
import {connect} from "react-redux"
import BlogNewHeader from "@/components/ui/Blog/New/Header/BlogNewHeader"
import {goBackEditMode} from "@/components/ui/Functions/GoBack"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import {toggleEditMode} from "@/redux/slices/EditProfileSlice"
import {
	useLazyGetCanRecieveNotifyQuery,
	useLazyGetCanSendMessageQuery,
	useSetCanRecieveNotifyMutation,
	useSetCanSendMessageMutation,
} from "@/services/users.service"

interface NotificationsManagerProps {
	// nmState?: any
	editProfileState?: any
	// setNMSuit?: any
}

type SettingsItem = {
	id: number
	value: string
	title: string
	onClick: Function
}

type ChatConfigItem = {
	id: string
	title: string
}

const getPageTranslations = (t: TFunction) => {
	return {
		profile_types: {
			man: t("site.n_manager_filter_Man"),
			woman: t("site.n_manager_filter_Woman"),
			couple: t("site.n_manager_filter_Couple"),
		},
		settings: {
			who_can_write_me: t("site.You can contact me by chat"),
			updates_about_subscription: t(
				"site.I want to receive notifications about my subscription"
			),
			updates_about_parties: t("site.I want to get updates on parties"),
			updates_from_other_users: t(
				"site.I want to receive alerts from other users"
			),
		},
		header: {
			alert_management: t("site.Alert management"),
			title: t("site.Want to stay up to date all the time"),
		},
	}
}

function NotificationManagerPage(props: NotificationsManagerProps) {
	// props
	const {
		// setNMSuit,
		// nmState,
		editProfileState,
	} = props
	const {t} = useTranslation("site")
	const router = useRouter()
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])

	// state
	const [isLoading, setIsLoading] = useState(true)
	const [showSplash, setShowSplash] = useState(true)
	const [showDrawerChatFilter, toggleDrawerChatFilter] =
		useState<boolean>(false)
	const [showDrawerReceiveNotifyFilter, toggleDrawerReceiveNotifyFilter] =
		useState<boolean>(false)
	const [nmSuit, setNMSuit] = useState<string[] | undefined | null>(undefined)
	const [canUpdate, setCanUpdate] = useState(false)
	const [nmSuitNotify, setNMSuitNotify] = useState<any>(undefined)
	const [canUpdateNotify, setCanUpdateNotify] = useState(false)

	// react hook form
	const {handleSubmit, control, watch, setValue} = useForm()
	const suit = useWatch({
		control,
		name: "chatFilter",
	})

	const suitNotify = useWatch({
		control,
		name: "receiveNotify",
	})

	// rtk
	const [triggerCanSendMessage, canSendMessageResponse] =
		useLazyGetCanSendMessageQuery()
	const [setCanSendMessageMutation] = useSetCanSendMessageMutation()
	const [triggerCanRecieveNotify, canRecieveNotifyResponse] =
		useLazyGetCanRecieveNotifyQuery()
	const [setCanRecieveNotifyMutation] = useSetCanRecieveNotifyMutation()

	useEffect(() => {
		triggerCanSendMessage({})
		triggerCanRecieveNotify({})
	}, [])

	useEffect(() => {
		if (canSendMessageResponse && canSendMessageResponse.isSuccess) {
			if (canSendMessageResponse.data.can_send_messages) {
				setNMSuit(canSendMessageResponse.data.can_send_messages)
			} else {
				setNMSuit([])
			}
		}
	}, [canSendMessageResponse])

	useEffect(() => {
		if (canRecieveNotifyResponse && canRecieveNotifyResponse.isSuccess) {
			if (canRecieveNotifyResponse.data) {
				console.log(canRecieveNotifyResponse.data)
				setNMSuitNotify(canRecieveNotifyResponse.data)
			} else {
				setNMSuitNotify([])
			}
		}
	}, [canRecieveNotifyResponse])

	// const
	const listChatFilter: ChatConfigItem[] = [
		{
			id: "MAN",
			title: pageTranslations.profile_types.man,
		},
		{
			id: "WOMAN",
			title: pageTranslations.profile_types.woman,
		},
		{
			id: "COUPLE",
			title: pageTranslations.profile_types.couple,
		},
	]

	const receiveMessagesFromOtherUsersFilter: ChatConfigItem[] = [
		{
			id: "chat",
			title: t("site.Chat"),
		},
		{
			id: "images",
			title: t("site.Images"),
		},
		{
			id: "favorite",
			title: t("site.Favorites"),
		},
		{
			id: "recommendation",
			title: t("site.Recommendations"),
		},
	]

	const settings: SettingsItem[] = [
		{
			id: 1,
			value: "", //suitWithTitles.join(", "),
			title: pageTranslations.settings.who_can_write_me,
			onClick: () => {
				toggleDrawerChatFilter(true)
			},
		},
		{
			id: 2,
			value: "", //suitWithTitles.join(", "),
			title: t("site.I want to receive notifications from other users"),
			onClick: () => {
				toggleDrawerReceiveNotifyFilter(true)
			},
		},
		// {
		// 	id: 2,
		// 	value: "",
		// 	title: pageTranslations.settings.updates_about_subscription,
		// 	onClick: () => {},
		// },
		// {
		// 	id: 3,
		// 	value: "",
		// 	title: pageTranslations.settings.updates_about_parties,
		// 	onClick: () => {},
		// },
		// {
		// 	id: 4,
		// 	value: "",
		// 	title: pageTranslations.settings.updates_from_other_users,
		// 	onClick: () => {},
		// },
	]

	// functions
	function getCheckboxParam(key: string, id: number) {
		if (!nmSuit || !Array.isArray(nmSuit)) return false
		return nmSuit.includes(id.toString())
	}
	function getCheckboxNotifyParam(key: string, id: number) {
		if (!nmSuitNotify) return false
		return getSelectedKeysFromObject(nmSuitNotify).includes(id.toString())
	}

	const goBack = () => {
		if (editProfileState && editProfileState.editMode) {
			goBackEditMode(router, toggleEditMode)
			return
		}

		router.push("/profiles/my/edit/").then()
	}

	// effects
	useEffect(() => {
		if (!suit) return
		setCanUpdate(true)

		const debounceFilters = setTimeout(() => {
			const ids = getSelectedStringIds(suit)
			setNMSuit(ids)
			console.log("nmSuit saved to state", ids)
		}, 1000)

		return () => {
			clearTimeout(debounceFilters)
		}
	}, [setNMSuit, suit])

	useEffect(() => {
		if (canUpdate && nmSuit && Array.isArray(nmSuit)) {
			console.log("nmSuit put here", nmSuit)
			setCanSendMessageMutation({
				profileTypesList: nmSuit,
			})
			// lsSetItem(lsNotificationsManagerStorage, JSON.stringify(nmState))
		}
	}, [nmSuit])

	useEffect(() => {
		if (!suitNotify) return
		setCanUpdateNotify(true)

		const debounceFilters = setTimeout(() => {
			setNMSuitNotify(suitNotify)
			console.log("nmSuit saved to state", suitNotify)
		}, 1000)

		return () => {
			clearTimeout(debounceFilters)
		}
	}, [setNMSuitNotify, suitNotify])

	useEffect(() => {
		if (canUpdateNotify && nmSuitNotify) {
			console.log("nmSuit put here", nmSuitNotify)
			setCanRecieveNotifyMutation({
				profileTypesList: nmSuitNotify,
			})
			// lsSetItem(lsNotificationsManagerStorage, JSON.stringify(nmState))
		}
	}, [nmSuitNotify])

	const scoreArr = suit ? Object.entries(suit) : []
	const scoreArrNotify = suitNotify ? Object.entries(suitNotify) : []

	const filteredArr = (scoreArray: [string, any][]) => {
		if (!scoreArray) []
		return scoreArray
			.filter(([key, value]) => {
				return value === true
			})
			.map(function ([key, value]) {
				return key
			})
	}

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false)
		}, 1000)
	}, [setIsLoading])

	if (!nmSuit) return null

	return (
		<>
			<NextSeo title={t("site.favorites")} />
			{showSplash ? (
				<SplashScreen
					isLoading={isLoading}
					setShowSplash={setShowSplash}
				/>
			) : (
				<>
					<div className="NotificationManagerPage">
						<BlogNewHeader
							callback={() => {
								goBack()
							}}
							icon={<CloseIcon style={"light"} />}
							title={pageTranslations.header.alert_management}
						/>
						<p className="Title">{pageTranslations.header.title}</p>
						{settings &&
							settings.map((item: any) => {
								return (
									<EditProfileListItem
										key={item.id}
										title={item.title}
										value={item.value}
										{...(item.onClick && {
											callback: item.onClick,
										})}
									/>
								)
							})}
					</div>
					<Drawer
						title={t("site.You can contact me by chat")}
						show={showDrawerChatFilter}
						setShow={toggleDrawerChatFilter}
						position={"bottom"}
					>
						<div className="DrawerNotify">
							<Divider />
							{listChatFilter &&
								listChatFilter.map((item: any) => {
									return (
										<Controller
											render={({field}) => (
												<>
													<InputCheckboxHorizontalTransparent
														title={item.title}
														field={field}
														value={item.id}
														id={
															"input_checkbox_horizontal_language_" +
															item.id
														}
														disabled={
															filteredArr(
																scoreArr
															).length === 2 &&
															!filteredArr(
																scoreArr
															).includes(
																`id_${item.id}`
															)
														}
													/>
												</>
											)}
											name={`chatFilter.id_${item.id}`}
											control={control}
											defaultValue={getCheckboxParam(
												"suit",
												item.id
											)}
											key={item.id}
										/>
									)
								})}
						</div>
					</Drawer>
					<Drawer
						title={t(
							"site.I want to receive notifications from other users"
						)}
						show={showDrawerReceiveNotifyFilter}
						setShow={toggleDrawerReceiveNotifyFilter}
						position={"bottom"}
					>
						<div className="DrawerNotify">
							<Divider />
							{receiveMessagesFromOtherUsersFilter &&
								receiveMessagesFromOtherUsersFilter.map(
									(item: any) => {
										return (
											<Controller
												render={({field}) => (
													<>
														<InputCheckboxHorizontalTransparent
															title={item.title}
															field={field}
															value={item.id}
															id={
																"input_checkbox_receive_notify_" +
																item.id
															}
															// disabled={
															// 	filteredArr(
															// 		scoreArrNotify
															// 	).length ===
															// 		2 &&
															// 	!filteredArr(
															// 		scoreArrNotify
															// 	).includes(
															// 		`${item.id}`
															// 	)
															// }
														/>
													</>
												)}
												name={`receiveNotify.${item.id}`}
												control={control}
												defaultValue={getCheckboxNotifyParam(
													"receiveNotify",
													item.id
												)}
												key={item.id}
											/>
										)
									}
								)}
						</div>
					</Drawer>
				</>
			)}
		</>
	)
}

NotificationManagerPage.requireAuth = true

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

// export default NotificationManagerPage

const mapStateToProps = (state: any) => ({
	editProfileState: state.EditProfileSlice,
	// nmState: state.NotificationManagerSlice,
})

const mapDispatchToProps = {
	// setNMSuit: setNMSuit,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NotificationManagerPage)
