import React, {useCallback, useEffect, useState} from "react"
import SplashScreen from "@/components/ui/Splash/SplashScreen"
import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {TFunction, useTranslation} from "next-i18next"
import Button from "@/components/ui/Button/Button/Button"
import {useRouter} from "next/router"
import AvailableAd from "@/components/ui/AvailableToday/AvailableAd/AvailableAd"
import AvailablePlusIcon from "@/components/ui/Icons/AvailablePlus/AvailablePlusIcon"
import Section from "@/components/ui/SignUp/Section/Section"
import {Controller, useForm} from "react-hook-form"
import TextArea from "@/components/ui/Forms/Inputs/TextArea/TextArea"
import InputCheckboxHorizontal from "@/components/ui/Forms/Inputs/CheckboxHorizontal/InputCheckboxHorizontal"
import InputRadioAvailableToday from "@/components/ui/Forms/Inputs/RadioAvailableToday/InputRadioAvailableToday"
import {
	AvailableProfile,
	AvailableProfiles,
	AvailableTitle,
	ChangeAvailableTodayProps,
	CreateAvailableProps,
	SelfAvailable,
	useChangeAvailableTodayMutation,
	useCreateAvailableMutation,
	useDeleteAvailableTodayMutation,
	useLazyGetAvailableTodayQuery,
	useLazyGetSelfAvailableTodayQuery,
} from "@/services/available.service"
import EditPensilIcon from "@/components/ui/Icons/EditPensil/EditPensilIcon"
import Link from "@/components/ui/Button/Link/Link"
import {NextSeo} from "next-seo"
import Drawer from "@/components/ui/Drawer/Drawer/Drawer"
import LoadMoreButton from "@/components/ui/Button/LoadMoreButton/LoadMoreButton"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
import {intervalToDuration} from "date-fns"
import {uniqueArrayByParam} from "@/components/ui/Functions/UniqueArray"
import {connect} from "react-redux"
import dynamic from "next/dynamic"
import AdminMessage from "@/components/ui/AdminMessage/AdminMessage"
import {
	checkSubscription,
	Flag,
} from "@/components/ui/Functions/CheckSubscription"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import {userProfileActions} from "@/redux/actions/userProfileActions"

const DynamicFiltersAvailableCarousel = dynamic(
	() => import("@/components/ui/Carousel/Filters/FiltersAvailableCarousel")
)

export type AvailableTitleAssoc = {
	id: AvailableTitle
	title: string
}

type AvailableDate = {
	id: string
	value: number
	title: string
}

export const getTitleList = (t: TFunction): AvailableTitleAssoc[] => {
	return [
		//list
		{
			id: AvailableTitle.drinks,
			title: t("site.A drink is right for us"),
		},
		{
			id: AvailableTitle.knowEachOther,
			title: t("site.Introduction and flow"),
		},
		{
			id: AvailableTitle.touchOnly,
			title: t("site.Touch only"),
		},
		{
			id: AvailableTitle.fullSex,
			title: t("site.Full sex"),
		},
	]
}

function AvailableToday(props: any) {
	// props
	const {t} = useTranslation("site")
	const router = useRouter()

	const {filtersAvailableState} = props

	// react hook form
	const {handleSubmit, control, watch, setValue} = useForm()
	const suit = watch("suit")
	const description = watch("description")
	const dateExpField = watch("date_exp")

	// state
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [showSplash, setShowSplash] = useState<boolean>(true)
	const [page, setPage] = useState<number>(1)
	const [pageSize, setPageSize] = useState<number>(10)
	const [availableTodayCount, setAvailableTodayCount] = useState<number>(0)
	const [availableTodayNearMeCount, setAvailableTodayNearMeCount] =
		useState<number>(0)
	const [availableToday, setAvailableToday] = useState<AvailableProfiles[]>(
		[]
	)
	const [selfAvailable, setSelfAvailable] = useState<
		SelfAvailable | undefined
	>(undefined)
	const [timerCounter, setTimerCounter] = useState(0)
	const [timerReady, setTimerReady] = useState(false)
	const [error, setError] = useState<string[] | undefined>(undefined)
	const [updateSubWindow, setUpdateSubWindow] = useState<boolean>(false)
	const [profilesSubscription, setProfilesSubscription] = useState<boolean>(true)
	const [showDrawer, toggleDrawer] = useState<boolean>(false)
	const [showBouncePopup, setShowBouncePopup] = useState<boolean>(false)
	const [showDeleteHidePopup, setShowDeleteHidePopup] =
		useState<boolean>(false)
	const [availableEdit, setAvailableEdit] = useState<
		SelfAvailable | undefined
	>()

	const [errors, setErrors] = useState<any>(null)

	const titleList: AvailableTitleAssoc[] = getTitleList(t)

	const dateList: AvailableDate[] = [
		//dateExp
		{
			id: "10",
			value: 7,
			title: t("site.week"),
		},
		{
			id: "11",
			value: 2,
			title: t("site.48 hours"),
		},
		{
			id: "12",
			value: 1,
			title: t("site.24 hours"),
		},
	]

	// rtk
	const userProfilesData = useGetUserProfilesInfo()
	const [triggerAvailableToday, availableTodayResponse] =
		useLazyGetAvailableTodayQuery()
	const [triggerSelfAvailableToday, selfAvailableResponse] =
		useLazyGetSelfAvailableTodayQuery()
	const [registerCreateAvailableToday] = useCreateAvailableMutation()
	const [registerChangeAvailableToday] = useChangeAvailableTodayMutation()
	const [registerDeleteAvailableToday] = useDeleteAvailableTodayMutation()

	const isFilterAllowed = useCallback(() => {
		// return filtersAvailableState && !filtersAvailableState.lock
		if (filtersAvailableState && filtersAvailableState.lock === true) {
			return false
		} else {
			return true
		}
	}, [filtersAvailableState])

	// functions
	const getAvailableToday = useCallback(() => {
		triggerAvailableToday({
			page: page,
			pageSize: pageSize,
			nickname: isFilterAllowed()
				? filtersAvailableState?.nickname
				: null,
			is_near_me: isFilterAllowed()
				? filtersAvailableState?.is_near_me
				: null,
			settlement: isFilterAllowed()
				? filtersAvailableState?.location
				: null,
			profile_type: isFilterAllowed()
				? filtersAvailableState?.profile_type
				: null,
			title: isFilterAllowed() ? filtersAvailableState?.title : null,
			is_online: isFilterAllowed()
				? filtersAvailableState?.is_online
				: null,
			verified: isFilterAllowed() ? filtersAvailableState.verified : null,
			hosted: isFilterAllowed() ? filtersAvailableState?.hosted : null,
		})

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, pageSize, filtersAvailableState])

	useEffect(() => {
		if (filtersAvailableState && !filtersAvailableState.lock) {
			updateStates()
		}
	}, [filtersAvailableState])

	useEffect(() => {
		if (showDrawer === false) {
			setShowDeleteHidePopup(false)
		}
	}, [showDrawer])

	useEffect(() => {
		if (
			userProfilesData &&
			userProfilesData.subscription &&
			userProfilesData.subscription?.subscription &&
			!checkSubscription(
				userProfilesData.subscription.subscription,
				Flag.showAvailableDescription
			)
		) {
			setProfilesSubscription(false)
			setUpdateSubWindow(true)
		}
	}, [userProfilesData])

	const getSelectedTitles = (titleCodes: AvailableTitle[]): string => {
		if (!titleCodes) return "-"
		return titleCodes
			.map((title) => {
				const search = titleList.find((s) => s.id === title)
				if (search) {
					return search.title
				}
			})
			.filter((e) => e)
			.join(", ")
	}

	const getProfileNickname = (profile: AvailableProfile): string => {
		switch (profile.profile_type) {
			case "MAN":
				return profile.man.nickname

			case "WOMAN":
				return profile.woman.nickname

			case "COUPLE":
				return profile.couple_nickname

			default:
				return "-"
		}
	}

	const isSelfAvailable = (): boolean => {
		return !!(
			selfAvailable &&
			selfAvailable.available &&
			selfAvailable.available.id
		)
	}

	const isSelfAvailableDeleted = (): boolean => {
		return !!(
			selfAvailable &&
			selfAvailable.available_block_time !== null &&
			selfAvailable.available_block_time > 0
		)
	}

	const isSelfAvailableHidden = (): boolean => {
		return !!(
			selfAvailable &&
			selfAvailable.available &&
			selfAvailable.available.id &&
			selfAvailable.available.status === "HIDDEN"
		)
	}

	const clearForm = () => {
		setValue("date_exp", "")
		setValue("description", "")
		titleList.map((item) => {
			setValue(`suit._${item.id}`, false)
		})
	}

	const updateStates = () => {
		setAvailableToday([])
		setAvailableTodayCount(0)
		setAvailableTodayNearMeCount(0)
		triggerSelfAvailableToday({})
		if (page !== 1) {
			setPage(1)
		} else {
			getAvailableToday()
		}
	}

	useEffect(() => {
		if (!filtersAvailableState.lock) {
			updateStates()
		}
	}, [filtersAvailableState.lock])

	const addZeros = (val: string) => {
		if (val && val.length < 2) {
			return ["0", val].join("")
		} else {
			return val
		}
	}

	const getDayExpiration = () => {
		if (!selfAvailable?.available) return
		const dateExpiration = new Date(
			selfAvailable?.available?.expiration_date
		).getTime()
		const dateCreate = new Date(selfAvailable?.available?.created).getTime()
		if (dateExpiration && dateCreate) {
			const sum = (dateExpiration - dateCreate) / 1000 / 86400
			const result = Math.round(sum)
			if (result) {
				setValue("date_exp", result.toString())
			}
		}
	}

	useEffect(() => {
		getDayExpiration()
	}, [selfAvailable])

	const getTime = () => {
		if (!timerCounter) return

		const time = intervalToDuration({
			start: 0,
			end: timerCounter * 1000,
		})

		const d = time?.days?.toString() || null
		const h = time?.hours?.toString() || null
		const m = time?.minutes?.toString() || null
		const s = time?.seconds?.toString() || null

		const days = d ? addZeros(d) : null
		const hours = h ? addZeros(h) : null
		const minutes = m ? addZeros(m) : null
		const seconds = s ? addZeros(s) : null

		return [days, hours, minutes, seconds]
			.filter((e) => e)
			.filter((e) => e !== "00")
			.join(":")
	}

	const submitDeleteAvailable = () => {
		if (selfAvailable && isSelfAvailable() && !isSelfAvailableDeleted()) {
			registerDeleteAvailableToday({
				availableId: selfAvailable.available.id,
			})
				.unwrap()
				.then((r: any) => {
					console.log(r)
					clearForm()
					updateStates()
					toggleDrawer(false)
				})
				.catch((e: any) => {
					console.log(e)
				})
		}
	}

	const submitHideAvailable = (unhide = false) => {
		if (!selfAvailable) return

		const data: ChangeAvailableTodayProps = {
			availableId: selfAvailable.available.id,
			status: unhide ? "ACTIVE" : "HIDDEN",
			isEdit: true,
		}

		registerChangeAvailableToday(data)
			.unwrap()
			.then((r) => {
				clearForm()
				updateStates()
				toggleDrawer(false)
			})
			.catch((e) => {
				setErrors(e.data)
				if (e.message === "There is no subscription") {
					router.push(`/profiles/my/subscriptions`).then()
				}
			})
	}

	const scoreArr = suit ? Object.entries(suit) : []

	const filteredArr =
		scoreArr &&
		scoreArr
			.filter(function ([key, value]) {
				return value === true
			})
			.map(function ([key, value]) {
				return key
			})

	const suitWithTitles = titleList
		.filter((item) =>
			filteredArr?.map((item) => item.replace("_", "")).includes(item.id)
		)
		.map((item) => item.id)

	const submitForm = () => {
		setError(undefined)
		setErrors(null)
		if (!suitWithTitles && !description && !dateExpField) return

		const data: CreateAvailableProps = {
			title: suitWithTitles,
			description: description,
			daysToExpiration: Number(dateExpField),
		}

		registerCreateAvailableToday(data)
			.unwrap()
			.then((r) => {
				clearForm()
				updateStates()
				toggleDrawer(false)
			})
			.catch((e) => {
				setErrors(e.data)

				if (
					e &&
					e.data &&
					e.data.detail &&
					Array.isArray(e.data.detail)
				) {
					const errors = e.data.detail.map((row: any) => {
						return row.loc.join("_") + "_" + row.msg
					})

					setError(errors)
				}
			})
	}

	function getKeyByValue(object: any, value: string) {
		return Object.keys(object).find((key) => key === value)
	}
	function deleteStateVariable(param: any) {
		if (!getKeyByValue(errors, param)) return
		const {[param]: tmp, ...rest} = errors
		setErrors(rest)
	}

	useEffect(() => {
		if (suitWithTitles.length > 0 && errors) {
			deleteStateVariable("title")
		}
		if (dateExpField && errors) {
			deleteStateVariable("days_to_expiration")
		}
	}, [suitWithTitles, dateExpField])

	const submitEditForm = () => {
		if (!suitWithTitles && !description && !dateExpField) return

		if (!selfAvailable) return

		const data: ChangeAvailableTodayProps = {
			availableId: selfAvailable.available.id,
			title: suitWithTitles,
			description: description,
			popup: false,
			isEdit: true,
			status: "ACTIVE",
		}

		registerChangeAvailableToday(data)
			.unwrap()
			.then((r) => {
				clearForm()
				updateStates()
				toggleDrawer(false)
			})
			.catch((e) => {
				console.log(e)
				setErrors(e.data)
				if (e.message === "There is no subscription") {
					router.push(`/profiles/my/subscriptions`).then()
				}
			})
	}

	const submitPopup = () => {
		if (!suitWithTitles && !description && !dateExpField) return

		if (!selfAvailable) return

		const data: ChangeAvailableTodayProps = {
			availableId: selfAvailable.available.id,
			title: suitWithTitles,
			description: description,
			popup: true,
			isPopup: true,
			status: "ACTIVE",
		}

		registerChangeAvailableToday(data)
			.unwrap()
			.then((r) => {
				clearForm()
				updateStates()
				toggleDrawer(false)
				if (profilesSubscription === false){
					setShowBouncePopup(true)
				}
			})
			.catch((e) => {
				console.log(e)
				if (e.message === "There is no subscription") {
					router.push(`/profiles/my/subscriptions`).then()
				}
			})
	}

	// effects
	// get self available
	useEffect(() => {
		triggerSelfAvailableToday({})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// save self available info
	useEffect(() => {
		if (selfAvailableResponse && selfAvailableResponse.isSuccess) {
			setSelfAvailable(selfAvailableResponse.data)
		}
	}, [selfAvailableResponse])

	// get available today list
	useEffect(() => {
		getAvailableToday()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, pageSize])

	// save available today list to state
	useEffect(() => {
		if (
			availableTodayResponse &&
			availableTodayResponse.isSuccess &&
			!availableTodayResponse.isFetching
		) {
			setAvailableTodayCount(availableTodayResponse.data.count)
			setAvailableTodayNearMeCount(availableTodayResponse.data.near_me)
			setAvailableToday((prevState) =>
				uniqueArrayByParam(
					[...prevState, ...availableTodayResponse.data.results],
					"id"
				)
			)
		}
	}, [availableTodayResponse])

	// timer
	useEffect(() => {
		if (selfAvailable) {
			if (!isSelfAvailableDeleted()) {
				setTimerCounter(selfAvailable.available.last_popup_time)
				setTimerReady(true)
			} else {
				setTimerCounter(selfAvailable.available_block_time)
				setTimerReady(true)
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selfAvailable])

	useEffect(() => {
		if (!timerReady) return

		const timer = setInterval(() => {
			setTimerCounter((prevState) => prevState - 1)
			return 1
		}, 1000)

		return () => {
			clearInterval(timer)
		}
	}, [timerReady])

	useEffect(() => {
		if (availableEdit) {
			setValue("description", availableEdit.available.description || "")
			if (availableEdit.available.title.length) {
				titleList
					.filter((item) => {
						return availableEdit.available.title.includes(item.id)
					})
					.map((item) => {
						return setValue(`suit._${item.id}`, true)
					})
			}
		}
	}, [availableEdit])

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false)
		}, 1000)
	}, [])

	if (showSplash) {
		return (
			<SplashScreen isLoading={isLoading} setShowSplash={setShowSplash} />
		)
	}

	return (
		<>
			<NextSeo title={t("site.Available today")} />
			{showSplash ? (
				<SplashScreen
					isLoading={isLoading}
					setShowSplash={setShowSplash}
				/>
			) : (
				<AppDefaultLayout
					useHeader={true}
					useTabBar={true}
					fullHeight={true}
					useFilters={true}
				>
					<AdminMessage
						open={updateSubWindow}
						setOpen={setUpdateSubWindow}
						text={
							<p>
								{t("site.If you want to see description")}{" "}
								<Link
									variant={"purple"}
									onClick={() =>
										router.push(
											"/profiles/my/subscriptions"
										)
									}
									styled={true}
								>
									{t("site.buy a subscription")}
								</Link>
							</p>
						}
					/>
					<div className="AvailableAdPage">
						<div className="AvailableTodayCount">
							<div className="Counter">
								<p>
									<span>{availableTodayCount}</span>{" "}
									{t("site.Available today")}
								</p>
							</div>
							<div className="Line" />
							<div className="Counter">
								<p>
									<span>{availableTodayNearMeCount}</span>{" "}
									{t("site.In your area")}
								</p>
							</div>
						</div>
						{isSelfAvailable() && !isSelfAvailableDeleted() && (
							<div className="EditActions">
								<Button
									type={"button"}
									mode={"submit"}
									prevent={false}
									fullWidth={true}
									background={"whiteGray"}
									onClick={submitPopup}
									disabled={timerCounter > 0}
								>
									{timerCounter < 1 ? (
										<p className="EditButtonText">
											{t("site.Bounce my ad")}
										</p>
									) : (
										<p className="EditButtonText">
											{t("site.You can bounce ad in")}{" "}
											{""}
											{getTime()}
										</p>
									)}
								</Button>
								{isSelfAvailableHidden() ? (
									<Button
										type={"button"}
										mode={"submit"}
										onClick={() =>
											submitHideAvailable(true)
										}
										variant={"available-today"}
									>
										<p className="EditButtonText">
											{t("site.Your ad is hidden")}
										</p>
									</Button>
								) : (
									<Button
										type={"button"}
										mode={"submit"}
										prevent={false}
										onClick={() => {
											setAvailableEdit(selfAvailable)
											toggleDrawer(true)
										}}
										icon={<EditPensilIcon />}
										variant={"available-today"}
									>
										<p className="EditButtonText">
											{t("site.Editing an ad")}
										</p>
									</Button>
								)}
							</div>
						)}

						{isSelfAvailableDeleted() && (
							<div className="ExceededLimit">
								{t("site.Exceeded limit")} {getTime()}
							</div>
						)}

						{!isSelfAvailable() && !isSelfAvailableDeleted() && (
							<div className="Actions">
								{/* submit form */}
								<Button
									type={"button"}
									mode={"submit"}
									prevent={false}
									fullWidth={true}
									onClick={() => toggleDrawer(true)}
									icon={<AvailablePlusIcon />}
								>
									<p className="ActionButtonText">
										{t("site.Join the vacancies today")}
									</p>
								</Button>
							</div>
						)}

						<div className="StoriesCarousel">
							<DynamicFiltersAvailableCarousel
								filters={filtersAvailableState}
							/>
						</div>

						<div className="AvailableAdContainer">
							{availableToday && availableToday.length > 0 && (
								<>
									{availableToday.map(
										(profileAd, index: number) => {
											return (
												<AvailableAd
													key={index}
													href={`/profiles/${profileAd.profile.id}`}
													status={
														profileAd.profile
															.is_online
															? 1
															: 0
													}
													location={{
														title:
															(profileAd &&
																profileAd.profile &&
																profileAd
																	.profile
																	.location &&
																profileAd
																	.profile
																	.location
																	.title &&
																profileAd
																	.profile
																	.location
																	.title) ||
															"",
														distance: 0,
													}}
													title={getSelectedTitles(
														profileAd.title
													)}
													profile={{
														id: profileAd.profile
															.id,
														manAge:
															profileAd.profile
																.man &&
															profileAd.profile
																.man.age,
														womanAge:
															profileAd.profile
																.woman &&
															profileAd.profile
																.woman.age,
														profileType:
															profileAd.profile
																.profile_type,
														description:
															profileAd.description,
														verified:
															profileAd.profile
																.verified,
														nickname:
															getProfileNickname(
																profileAd.profile
															),
														avatarImage:
															profileAd.profile
																.avatar_image,
														subscription: profileAd.profile.subscription
													}}
												/>
											)
										}
									)}
									<LoadMoreButton
										page={page}
										count={availableTodayCount}
										isLoading={
											availableTodayResponse.isLoading
										}
										label={t("site.the next")}
										id={"button_load_more"}
										onClick={() => {
											setPage(
												(prevState) => prevState + 1
											)
										}}
									/>
								</>
							)}
							<div
								className="RequestImagesPopup"
								style={{
									display: showBouncePopup ? "block" : "none",
									marginBottom: "3rem",
								}}
							>
								<div className="RequestImages">
									<div className="GoBack">
										<TransparentButton
											icon={<CloseIcon />}
											id={"transparent_button_go_back"}
											onClick={() =>
												setShowBouncePopup(false)
											}
										/>
									</div>
									<p>
										{t("site.First time on us")}{" "}
										{t(
											"site.Next time you would need to subscribe to VIP"
										)}
									</p>
									<div className="Actions">
										<Button
											type={"button"}
											mode={"submit"}
											onClick={() =>
												router.push(
													"/profiles/my/subscriptions"
												)
											}
										>
											<p className="AcceptButtonText">
												{t("site.Subscribe")}
											</p>
										</Button>
										<Button
											type={"button"}
											mode={"submit"}
											color={"black"}
											variant={"outline"}
											onClick={() =>
												setShowBouncePopup(false)
											}
										>
											<p className="ButtonText">
												{t(
													"site.Thanks for the bounce"
												)}
											</p>
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<Drawer
						title={t("site.Hi hot couple, free today")}
						show={showDrawer}
						setShow={toggleDrawer}
						position={"bottom"}
					>
						<div className={"PartyScreen"}>
							<div
								className={"BottomDrawer"}
								style={{paddingTop: 0}}
							>
								<Section
									title={t(
										"site.Tell everyone what's right for you"
									)}
									description={t(
										"site.You can select up to 2 options"
									)}
									padding={"small"}
								>
									{titleList &&
										titleList.map((item: any) => {
											return (
												<Controller
													render={({field}) => (
														<>
															<InputCheckboxHorizontal
																title={
																	item.title
																}
																field={field}
																value={item.id}
																id={
																	"input_checkbox_horizontal_language_" +
																	item.id
																}
																disabled={
																	filteredArr.length ===
																		2 &&
																	!filteredArr.includes(
																		`_${item.id}`
																	)
																}
															/>
														</>
													)}
													name={`suit._${item.id}`}
													control={control}
													defaultValue={false}
													key={item.id}
												/>
											)
										})}
									<div className="Error">
										{errors &&
											errors?.title &&
											errors?.title[0] && (
												<p>{errors?.title[0]}</p>
											)}
									</div>
								</Section>
								<Section
									title={t(
										"site.How long do you want to perform available today"
									)}
									padding={"small"}
								>
									<div className="DateExpContainer">
										<Controller
											render={({field}) => {
												return (
													<>
														{dateList &&
															dateList.map(
																(
																	item,
																	index
																) => (
																	<InputRadioAvailableToday
																		value={item.value.toString()}
																		title={
																			item.title
																		}
																		id={
																			item.id
																		}
																		key={
																			item.id
																		}
																		field={
																			field
																		}
																		disabled={
																			isSelfAvailable() &&
																			!isSelfAvailableDeleted()
																		}
																	/>
																)
															)}
													</>
												)
											}}
											name={"date_exp"}
											control={control}
										/>
									</div>
									<div className="Error">
										{errors &&
											errors?.days_to_expiration &&
											errors?.days_to_expiration[0] && (
												<p>
													{
														errors
															?.days_to_expiration[0]
													}
												</p>
											)}
									</div>
								</Section>
								<Section
									title={t(
										"site.Tell a little, what are you looking for"
									)}
									padding={"small"}
								>
									<Controller
										render={({field}) => {
											return (
												<TextArea
													field={field}
													row={7}
													maxLength={250}
													error={errors?.description}
													placeholder={t(
														"site.What is your head, what are you looking for"
													)}
													id={"description.textarea"}
												/>
											)
										}}
										name={"description"}
										control={control}
										defaultValue={""}
									/>

									<div className="Error">
										{error &&
											error.map((e) => {
												return t(
													`site.available_today_error_${e}`
												)
											})}
									</div>
								</Section>

								<div className="Actions">
									{/* submit form */}
									<Button
										type={"button"}
										mode={"submit"}
										prevent={false}
										disabled={
											!suitWithTitles ||
											!dateExpField ||
											!description ||
											description.length < 20
										}
										fullWidth={true}
										onClick={
											isSelfAvailable() &&
											!isSelfAvailableDeleted()
												? submitEditForm
												: submitForm
										}
									>
										<p className="SubmitButtonText">
											{t("site.Post us")}
										</p>
									</Button>
								</div>
								<div
									className="RequestImagesPopup"
									style={{
										display: showDeleteHidePopup
											? "block"
											: "none",
										marginBottom: "3rem",
									}}
								>
									<div className="RequestImages">
										<div className="GoBack">
											<TransparentButton
												icon={<CloseIcon />}
												id={
													"transparent_button_go_back"
												}
												onClick={() =>
													setShowDeleteHidePopup(
														false
													)
												}
											/>
										</div>
										<p style={{color: "red"}}>
											{t("site.Warning")}{" "}
										</p>
										<p>
											{t(
												"site.After deleting available today ad"
											)}{" "}
											{t(
												"site.You can hide ad and bring it back later"
											)}
										</p>
										<div className="Actions">
											<Button
												type={"button"}
												mode={"submit"}
												color={"black"}
												variant={"outline"}
												onClick={submitDeleteAvailable}
											>
												<p className="ButtonText">
													{t("site.Delete ad")}
												</p>
											</Button>
											<Button
												type={"button"}
												mode={"submit"}
												color={"black"}
												variant={"outline"}
												onClick={() =>
													submitHideAvailable()
												}
											>
												<p className="ButtonText">
													{t("site.Hide ad")}
												</p>
											</Button>
										</div>
									</div>
								</div>
								{isSelfAvailable() &&
									!isSelfAvailableDeleted() && (
										<div className={"DeleteButton"}>
											<Link
												onClick={() =>
													setShowDeleteHidePopup(true)
												}
												styled={true}
											>
												{t("site.Delete or Hide ad")}
											</Link>
										</div>
									)}
							</div>
						</div>
					</Drawer>
				</AppDefaultLayout>
			)}
		</>
	)
}

AvailableToday.requireAuth = true

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

const mapStateToProps = (state: any) => ({
	filtersAvailableState: state.FiltersAvailableTodaySlice,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AvailableToday)
