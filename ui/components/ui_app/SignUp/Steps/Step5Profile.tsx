import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import Logotype from "@/components/ui/Header/Logotype"
import {Controller, useForm, useWatch} from "react-hook-form"
import React, {useEffect, useMemo, useState} from "react"
import {useRouter} from "next/router"
import Button from "@/components/ui/Button/Button/Button"
import {connect} from "react-redux"
import {userProfileActions} from "@/redux/actions/userProfileActions"
import {TFunction, useTranslation} from "next-i18next"
import AccordionItem from "@/components/ui/Accordion/AccordionItem"
import AccordionGroup from "@/components/ui/Accordion/AccordionGroup"
import ProgressBar from "@/components/ui/Forms/Inputs/InProgressBar/ProgressBar"
import Drawer from "@/components/ui/Drawer/Drawer/Drawer"
import InputRadioHorizontalDefault from "@/components/ui/Forms/Inputs/RadioHorizontal/InputRadioHorizontalDefault"
import InputCheckboxHorizontal from "@/components/ui/Forms/Inputs/CheckboxHorizontal/InputCheckboxHorizontal"
import InputRadioGroupHG from "@/components/ui/Forms/Inputs/RadioHorizontalGradient/InputRadioGroupHG"
import InputRadioHorizontalGradient from "@/components/ui/Forms/Inputs/RadioHorizontalGradient/InputRadioHorizontalGradient"
import Section from "@/components/ui/SignUp/Section/Section"
import {getSelectedIds} from "@/components/ui/Functions/GetSelectedIDs"
import {clearObject} from "@/app/utils"
import {useGetProfileDataQuery} from "@/services/users.service"
import {saveProfileType} from "@/redux/slices/RegisterProfileSlice"
// import {getProgressLength} from "@/components/ui/Functions/GetProgressLength"
import {goBackEditMode} from "@/components/ui/Functions/GoBack"
import {toggleEditMode} from "@/redux/slices/EditProfileSlice"
import CleanLayout from "@/components/ui_app/AppLayouts/CleanLayout"
import {ProfileRegistrationStep5Schema} from "@/app/validation/ProfileRegistration/Step5.schema"
import {yupResolver} from "@hookform/resolvers/yup"
import AdminMessage from "@/components/ui/AdminMessage/AdminMessage"


type FormData = {
	suits: any
	favorites: any
	stages: any
	acts: any
	available: number
	hosted: number
	spaces: number
	smoke: number
	drink: number
	experience: number
	[x: string | number | symbol]: any
}

type TAccordionItem = {
	id: string
	title: string
	mode?: "drawer"
	callback?: Function
}

interface FormPartProps {
	data: any[]
	name: string
	control: any
	defaultValue: any
	drawerTrigger?: Function
}

type Preference = {
	id: string
	title: string
	data: any
	mode?: boolean
	profileType?: string
	limit: number
}

type ErrorTranslations = {
	[x: string]: any
}

const getErrorTranslations = (t: TFunction): ErrorTranslations => {
	return {
		yup_PRStep5_spaces_required: t("site.yup_PRStep5_spaces_required"),
		yup_PRStep5_suits_required: t("site.yup_PRStep5_suits_required"),
		yup_PRStep5_favorites_required: t(
			"site.yup_PRStep5_favorites_required"
		),
		yup_PRStep5_stages_required: t("site.yup_PRStep5_stages_required"),
		yup_PRStep5_acts_required: t("site.yup_PRStep5_acts_required"),
		yup_PRStep5_hosted_required: t("site.yup_PRStep5_hosted_required"),
	}
}

function FormPart(props: FormPartProps) {
	const {data, name, control, defaultValue, drawerTrigger} = props

	const arrayMode = ["available", "spaces"]

	return (
		<Controller
			render={({field}) => (
				<>
					{data &&
						data.map((item: any) => {
							return (
								<InputRadioHorizontalDefault
									key={
										arrayMode.includes(name)
											? item[0]
											: item.id
									}
									// id={
									// 	"input_radio_" +
									// 	name +
									// 	"_" +
									// 	arrayMode.includes(name)
									// 		? item[0]
									// 		: item.id
									// }
									field={field}
									value={
										arrayMode.includes(name)
											? item[0]
											: item.id
									}
									title={
										arrayMode.includes(name)
											? item[1]
											: item.title
									}
									drawerTrigger={() => {
										drawerTrigger && drawerTrigger()
									}}
								/>
							)
						})}
				</>
			)}
			name={name}
			control={control}
			defaultValue={defaultValue}
		/>
	)
}

function SignUpProfileStep5(props: any) {
	const {t} = useTranslation("site")
	const errorTranslations = useMemo(() => {
		return getErrorTranslations(t)
	}, [t])

	// basic props
	const {
		registerProfileData,

		getSpacesPrefer,
		getSmokingPrefer,
		getAlcoholPrefer,
		getSuits,
		getFavorites,
		getStages,
		getActs,
		getAvailable,
		getHosted,
		getExperiences,

		spacesPrefer,
		smokingPrefer,
		alcoholPrefer,
		suits,
		favorites,
		stages,
		acts,
		available,
		hosted,
		experiences,

		updateProfile,
		saveProfileType,
		// editProfileState,
		toggleEditMode,
		profileProgress,
		editMode,
	} = props

	const {data: spacesPreferData} = spacesPrefer
	const {data: smokingPreferData} = smokingPrefer
	const {data: alcoholPreferData} = alcoholPrefer
	const {data: suitsData} = suits
	const {data: favoritesData} = favorites
	const {data: stagesData} = stages
	const {data: actsData} = acts
	const {data: availableData} = available
	const {data: hostedData} = hosted
	const {data: experiencesData} = experiences	
	const router = useRouter()
	const {profileID: id} = router.query
	const [open, setOpen] = useState(true)

	const {data: getProfileData, refetch: refetchProfileData} =
		useGetProfileDataQuery({
			profileId: id,
		})

	useEffect(() => {
		if (getProfileData) {
			if (getProfileData.profile_type) {
				saveProfileType({
					profile_type: getProfileData.profile_type,
				})
			}
		}
	}, [getProfileData, saveProfileType])

	useEffect(() => {
		getSpacesPrefer()
		getSmokingPrefer()
		getAlcoholPrefer()
		getSuits()
		getFavorites()
		getStages()
		getActs()
		getAvailable()
		getHosted()
		getExperiences()
	}, [ 
		getActs,
		getAlcoholPrefer,
		getAvailable,
		getFavorites,
		getHosted,
		getSmokingPrefer,
		getSpacesPrefer,
		getStages,
		getSuits,
		getExperiences,
	])

	
	
	// react hook form
	const {handleSubmit, control, watch, setValue, formState} =
		useForm<FormData>({
			resolver: yupResolver(ProfileRegistrationStep5Schema),
			mode: "onChange",
			reValidateMode: "onChange",
		})

		
 
	useEffect(() => {
		setTimeout(() => {
			handleSubmit(() => {})();
		}, 3000);
	}, []);



	const watcher: any = {
		spaces : useWatch({control, name: "spaces"}),
		smoke: useWatch({control, name: "smoke"}),
		drink: useWatch({control, name: "drink"}),
		available: useWatch({control, name: "available"}),
		hosted: useWatch({control, name: "hosted"}),
	}

	const watcherCheckbox: any = {
		suits: useWatch({control, name: "suits"}),
		favorites: useWatch({control, name: "favorites"}),
		stages: useWatch({control, name: "stages"}),
		acts: useWatch({control, name: "acts"}),
	}

	//initializes the form data to the data available in the database
	const setDataFromBase = () => {
		const profileData = getProfileData
		setValue(
			"spaces",
			profileData?.prefer_space?.toString() || ""

		)
		setValue(
			"smoke",
			profileData?.prefer_space?.toString() || ""

		)
		setValue(
			"drink",
			profileData?.alcohol?.toString() || ""

		)
		setValue(
			"available",
			profileData?.available?.toString() || ""

		)
		setValue(
			"hosted",
			profileData?.hosted?.toString() || ""

		)
	}
	//calls setDataFromBase
	useEffect(() => {
		setDataFromBase()
	}, [getProfileData])

	const dater: any = {
		spaces: spacesPreferData,
		smoke: smokingPreferData,
		drink: alcoholPreferData,
		available: availableData,
		hosted: hostedData,
	}

	const accordionGroup: Preference[] = useMemo(() => {
		return [
			{
				id: "suits",
				title: t("site.Suits"),
				data: suitsData,
				limit: 3,
			},
			{
				id: "favorites",
				title: t("site.favorite relationship"),
				data: favoritesData,
				profileType: registerProfileData.profile_type,
				limit: 5,
			},
			{
				id: "stages",
				title: t("site.Stage change to Our experience"),
				data: stagesData,
				profileType: registerProfileData.profile_type,
				limit: 5,
			},
			{
				id: "acts",
				title: t("site.Acts"),
				data: actsData,
				limit: 5,
			},
		]
	}, [suitsData, favoritesData, stagesData, actsData, registerProfileData])

	// const accordionGroup: Preference[] = [
	// 	{
	// 		id: "suits",
	// 		title: t("site.Suits"),
	// 		data: suitsData,
	// 		limit: 3,
	// 	},
	// 	{
	// 		id: "favorites",
	// 		title: t("site.favorite relationship"),
	// 		data: favoritesData,
	// 		profileType: registerProfileData.profile_type,
	// 		limit: 5,
	// 	},
	// 	{
	// 		id: "stages",
	// 		title: t("site.Stage change to Our experience"),
	// 		data: stagesData,
	// 		profileType: registerProfileData.profile_type,
	// 		limit: 5,
	// 	},
	// 	{
	// 		id: "acts",
	// 		title: t("site.Acts"),
	// 		data: actsData,
	// 		limit: 5,
	// 	},
	// 	// {
	// 	// 	id: "available",
	// 	// 	title: "Available",
	// 	// 	data: availableData,
	// 	// 	mode: true,
	// 	// },
	// 	// {
	// 	// 	id: "hosted",
	// 	// 	title: "Hosted",
	// 	// 	data: hostedData,
	// 	// },
	// ]

	const accordionGroupDrawer: TAccordionItem[] = [
		{
			id: "spaces",
			title: t("site.Prefer sex in separate rooms"),
			mode: "drawer",
			callback: () => {
				toggleDrawer(true, "spaces")
			},
		},
		{
			id: "smoke",
			title: t("site.Green brown smokers"),
			mode: "drawer",
			callback: () => {
				toggleDrawer(true, "smoke")
			},
		},
		{
			id: "drink",
			title: t("site.Drink here Drink there"),
			mode: "drawer",
			callback: () => {
				toggleDrawer(true, "drink")
			},
		},
		{
			id: "available",
			title: t("site.Available us"),
			mode: "drawer",
			callback: () => {
				toggleDrawer(true, "available")
			},
		},
		{
			id: "hosted",
			title: t("site.Hosts or hosted"),
			mode: "drawer",
			callback: () => {
				toggleDrawer(true, "hosted")
			},
		},
	]

	const [drawerMode, setDrawerMode] = useState("")
	const [drawerStatus, setDrawerStatus] = useState(false)
	const [drawerTrigger, setDrawerTrigger] = useState(false)

	function drawerTriggerAction() {
		setDrawerTrigger(true)
		setTimeout(() => {
			setDrawerTrigger(false)
		}, 100)
	}

	function toggleDrawer(state: boolean, mode?: string) {
		setDrawerStatus(state)
		if (mode) {
			setDrawerMode(mode)
		}
	}

	// on form submit
	function onFormSubmit(data: FormData) {
		//stage 5  ( "id", "suits", "prefer_space", "available", "favorites", "acts", "stages", "alcohol", "smoking_prefer", "experience", "hosted")
		const profileData = clearObject({
			suits: data.suits && getSelectedIds(data.suits),
			prefer_space: data.spaces && Number(data.spaces),
			available: data.available && Number(data.available),
			favorites: data.favorites && getSelectedIds(data.favorites),
			acts: data.acts && getSelectedIds(data.acts),
			spaces: data.spaces && getSelectedIds(data.spaces),
			stages: data.stages && getSelectedIds(data.stages),
			alcohol: data.drink && Number(data.drink),
			smoking_prefer: data.smoke && Number(data.smoke),
			experience: data.experience && Number(data.experience),
			hosted: data.hosted && Number(data.hosted),
		})

		updateProfile(id, 5, profileData)
		// refetchProfileData()

		if (editMode) {
			goBackEditMode(router, toggleEditMode)
			return
		}

		router.push(`/auth/signup/${id}/step/6`).then(() => {
			refetchProfileData()
		})
	}

	// on go back
	function onGoBackClick() {
		if (editMode) {
			goBackEditMode(router, toggleEditMode)
			return
		}

		switch (registerProfileData.profile_type) {
			case "COUPLE":
				router.push(`/auth/signup/${id}/step/4`).then(() => {
					refetchProfileData()
				})
				break

			case "WOMAN":
				router.push(`/auth/signup/${id}/step/3`).then(() => {
					refetchProfileData()
				})
				break

			case "MAN":
				router.push(`/auth/signup/${id}/step/4`).then(() => {
					refetchProfileData()
				})
				break
		}
	}

	function DrawerData() {
		let data: any = undefined
		let defaultValue = ""

		switch (drawerMode) {
			case "spaces":
				const sp: any = getProfileParam("prefer_space")
				defaultValue = sp ? sp.id : ""
				data = spacesPreferData
				break

			case "smoke":
				const sm: any = getProfileParam("smoking_prefer")
				defaultValue = sm ? sm.id : ""
				data = smokingPreferData
				break

			case "drink":
				const dr: any = getProfileParam("alcohol")
				defaultValue = dr ? dr.id : ""
				data = alcoholPreferData
				break

			case "available":
				const av: any = getProfileParam("available")
				defaultValue = av ? av.id : ""
				data = availableData
				break

			case "hosted":
				const ho: any = getProfileParam("hosted")
				defaultValue = ho ? ho.id : ""
				data = hostedData
				break
		}

		return (
			<>
				<FormPart
					data={data}
					name={drawerMode}
					control={control}
					defaultValue={defaultValue}
					drawerTrigger={drawerTriggerAction}
				/>
			</>
		)
	}

	function getDrawerTitle(): string {
		const search = accordionGroupDrawer.find((s) => s.id === drawerMode)
		if (search) {
			return search.title
		} else {
			return ""
		}
	}

	function getProfileParam(param: string): any {
		if (!getProfileData) return ""

		if (getProfileData && getProfileData[param]) {
			return getProfileData[param]
		} else {
			return ""
		}
	}

	function getProfileCheckboxParam(param: string, id: string): boolean {
		if (!getProfileData) return false

		if (getProfileData && getProfileData[param]) {
			const search = getProfileData[param].find(
				(s: any) => s.id.toString() === id.toString()
			)

			if (search) {
				return true
			} else {
				return false
			}
		} else {
			return false
		}
	}

	//filtering the first paragraph errors
	const asArray = Object.entries(formState.errors)
	const firstParagraphFiltered = asArray.filter(
		([key, value]) => ["suits", "favorites", "stages", "acts"].includes(key)
	)
	const firstJustStrings = Object.fromEntries(firstParagraphFiltered)
	const firstErrorsInfo = Object.values(firstJustStrings).map(
		(error) => errorTranslations[error.message]
	)
	
	//filtering the second paragraph errors
	const secondParagraphFiltered = asArray.filter(
		([key, value]) => ["spaces", "smoke", "drink", "available", "hosted"].includes(key)
	)
	const secondJustStrings = Object.fromEntries(secondParagraphFiltered)
	const secondErrorsInfo = Object.values(secondJustStrings).map(
		(error) => errorTranslations[error.message]
	)


	// const [defaultValuesSetupDone, setDefaultValueSetupDone] = useState(false)

	// todo: i'm so fucked up here, but I really don't know proper way to solve this issue
	useEffect(() => {
		if (accordionGroup) {
			accordionGroup.forEach((item) => {
				const defaultValues: number[] = []

				Array.isArray(item.data) &&
					item.data.forEach((row: any) => {
						const defaultValue = getProfileCheckboxParam(
							item.id,
							item.mode ? row[0] : row.id
						)

						if (defaultValue) {
							defaultValues.push(item.mode ? row[0] : row.id)
						}
					})

				const valuesToBeSetAsDefault = {}
				defaultValues.map((v) => {
					const vObj: any = {}
					vObj["_" + v] = true
					Object.assign(valuesToBeSetAsDefault, vObj)
				})

				setValue(item.id, valuesToBeSetAsDefault)
			})
			// setDefaultValueSetupDone(true)
		}
	}, [accordionGroup])

	function isDisabled(item: Preference, element: number) {
		const thisWatcher = watcherCheckbox[item.id]
		const ids = thisWatcher && getSelectedIds(thisWatcher)
		if (!ids) return false

		const profileType = registerProfileData.profile_type
		const list = item.data

		const correctIDs = ids
			.map((id: number) => {
				const search = list.find((s: any) => s.id === id)
				if (item.profileType) {
					if (search && search.profile_type === profileType) {
						return id
					}
				} else {
					return id
				}
			})
			.filter((e: any) => e)

		// return

		// todo: get profile type
		// todo: count only ids with correct profile type

		if (correctIDs.length >= item.limit) {
			return !correctIDs.includes(element)
		}

		return false
	}

	// todo: Fuck! This function is amazingly stupid! (as I am)
	function getAccordionCurrentValue(pid: string) {
		let id = pid

		if (pid === "spaces") {
			id = "prefer_space"
		}

		if (pid === "smoke") {
			id = "smoking_prefer"
		}

		if (pid === "drink") {
			id = "alcohol"
		}

		const profileParam = getProfileParam(id)
		const thisDater = dater[pid]
		const thisWatcher = watcher[pid]

		try {
			const arrays = ["available", "spaces"]
			const dataArray: any = Array.from(thisDater)

			if (dataArray) {
				// console.log(
				// 	"getParam",
				// 	pid,
				// 	id,
				// 	"profileParam:",
				// 	profileParam,
				// 	"thisDater:",
				// 	thisDater,
				// 	"watcher:",
				// 	thisWatcher,
				// 	"dataArray",
				// 	dataArray
				// )

				if (arrays.includes(pid)) {
					const search = dataArray.find(
						(s: any) => s[0] === Number(thisWatcher)
					)
					if (search) {
						return search[1]
					} else {
						const searchProfileParam = dataArray.find(
							(s: any) => s[0] === Number(profileParam.id)
						)

						if (searchProfileParam) {
							return searchProfileParam[1]
						} else {
							return ""
						}
					}
				} else {
					const search = dataArray.find(
						(s: any) => s.id === Number(thisWatcher)
					)

					if (search) {
						return search.title
					} else {
						if (profileParam) {
							return profileParam.title ? profileParam.title : ""
						}
					}
				}
			}
		} catch (e) {}
	}

	function skipStep() {
		// router.push(`/auth/signup/${id}/step/6`)
		router.push("/").then()
	}

	if (!getProfileData || !registerProfileData) return null

	return (
		<CleanLayout useTabBar={false} fullHeight={true}>
			<div className="SignUpPageContainer">
				<div className="Step5Profile">
					<div className="GoBack">
						<TransparentButton
							icon={<GoBackIcon />}
							onClick={onGoBackClick}
						/>
					</div>
					<div className="WelcomeLogotype">
						<Logotype size={"signup"} />
					</div>
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
					{profileProgress && (
						<div className="Progress">
							<ProgressBar
								// valueLength={100 / (6 / (3 - 1))} // total % / (total steps / current step - 1)
								valueLength={profileProgress}
								textInTop={t(
									"site.A few more steps and you have an amazing profile"
								)}
							/>
						</div>
					)}
					<form onSubmit={handleSubmit(onFormSubmit)} id="choice-form">
						<Drawer
							show={drawerStatus}
							setShow={toggleDrawer}
							title={getDrawerTitle()}
							position={"bottom"}
							trigger={drawerTrigger}
						>
							<div className="DrawerContainer">
								{DrawerData()}
							</div>
						</Drawer>

						<div className="Sections">
							<div className="SectionSuit">
								<Section
									// title={t("site.Can suit us")}
									padding={"small"}
								>
									<AccordionGroup>
										{accordionGroup &&
											accordionGroup.map((item: any) => {
												return (
													<AccordionItem
														title={item.title}
														key={item.id}
														variant={"step5"}
														select={
															formState.errors[
																item.id
															] &&
															t(
																`site.${
																	formState
																		.errors[
																		item.id
																	].message
																}`
															)
														}
													>
														<div className="AccordionContainer">
															{/*{JSON.stringify(*/}
															{/*	watcherCheckbox*/}
															{/*)}*/}
															{item.data &&
																item.data.map(
																	(
																		row: any
																	) => {
																		if (
																			item.profileType &&
																			row.profile_type !==
																				item.profileType
																		)
																			return null

																		return (
																			<Controller
																				render={({
																					field,
																				}) => (
																					<>
																						{/*isDis:{" "}*/}
																						{/*{isDisabled(*/}
																						{/*	item,*/}
																						{/*	item.mode*/}
																						{/*		? row[0]*/}
																						{/*		: row.id*/}
																						{/*).toString()}{" "}*/}
																						{/*/{" "}*/}
																						{/*lim:{" "}*/}
																						{/*{*/}
																						{/*	item.limit*/}
																						{/*}{" "}*/}
																						{/*/{" "}*/}
																						{/*val:{" "}*/}

																						{/*{watcherCheckbox[*/}
																						{/*	item*/}
																						{/*		.id*/}
																						{/*] &&*/}
																						{/*	getSelectedIds(*/}
																						{/*		watcherCheckbox[*/}
																						{/*			item*/}
																						{/*				.id*/}
																						{/*		]*/}
																						{/*	)*/}
																						{/*		.includes(*/}
																						{/*			row.id*/}
																						{/*		)*/}
																						{/*		.toString()}*/}
																						{/*{watcherCheckbox[*/}
																						{/*	item*/}
																						{/*		.id*/}
																						{/*] &&*/}
																						{/*	getSelectedIds(*/}
																						{/*		watcherCheckbox[*/}
																						{/*			item*/}
																						{/*				.id*/}
																						{/*		]*/}
																						{/*	)*/}
																						{/*		.length}*/}
																						<InputCheckboxHorizontal
																							title={
																								item.mode
																									? row[1]
																									: row.title
																							}
																							field={
																								field
																							}
																							value={
																								item.mode
																									? `${item.id}_${row[0]}`
																									: `${item.id}_${row.id}`
																							}
																							id={
																								item.mode
																									? `input_checkbox_horizontal_${item.id}_${row[0]}`
																									: `input_checkbox_horizontal_${item.id}_${row.id}`
																							}
																							variant={
																								"step5"
																							}
																							disabled={isDisabled(
																								item,
																								item.mode
																									? row[0]
																									: row.id
																							)}
																						/>
																					</>
																				)}
																				name={
																					item.mode
																						? `${item.id}._${row[0]}`
																						: `${item.id}._${row.id}`
																				}
																				control={
																					control
																				}
																				defaultValue={getProfileCheckboxParam(
																					item.id,
																					item.mode
																						? row[0]
																						: row.id
																				)}
																				key={
																					item.mode
																						? row[0]
																						: row.id
																				}
																			/>
																		)
																	}
																)}
														</div>
													</AccordionItem>
												)
											})}
									</AccordionGroup>
									{/* <div className="Error">
											{Object.values(firstErrorsInfo).join(
												", "
											)}
									</div> */}
									
									{/*A div that shows all of the errors from the fields*/}
									{/* <div className="Error">
									{Object.values(formState.errors)
										.map(
											(error: any) =>
												errorTranslations[
													error.message
												]
										)
										.join(", ")}
									</div> */}

									{/*<div className="ErrorContainer">*/}
									{/*	{formState.errors?.suits?.message && (*/}
									{/*		<p>*/}
									{/*			{t(*/}
									{/*				`site.${formState.errors?.suits?.message}`*/}
									{/*			)}*/}
									{/*		</p>*/}
									{/*	)}*/}
									{/*	{formState.errors?.favorites*/}
									{/*		?.message && (*/}
									{/*		<p>*/}
									{/*			{t(*/}
									{/*				`site.${formState.errors?.favorites?.message}`*/}
									{/*			)}*/}
									{/*		</p>*/}
									{/*	)}*/}
									{/*	{formState.errors?.stages?.message && (*/}
									{/*		<p>*/}
									{/*			{t(*/}
									{/*				`site.${formState.errors?.stages?.message}`*/}
									{/*			)}*/}
									{/*		</p>*/}
									{/*	)}*/}
									{/*	{formState.errors?.acts?.message && (*/}
									{/*		<p>*/}
									{/*			{t(*/}
									{/*				`site.${formState.errors?.acts?.message}`*/}
									{/*			)}*/}
									{/*		</p>*/}
									{/*	)}*/}
									{/*</div>*/}
								</Section>
							</div>
							<div className="SectionOther">
								<p className={"Title"}>
									{t("site.A little more about you")}
								</p>
								<AccordionGroup>
									{accordionGroupDrawer &&
										accordionGroupDrawer.map(
											(
												item: TAccordionItem,
												index: number
											) => {
												return (
													<AccordionItem
														title={item.title}
														key={index}
														select={getAccordionCurrentValue(
															item.id
														)}
														{...(item.mode && {
															mode: item.mode,
														})}
														{...(item.callback && {
															callback:
																item.callback,
														})}
													/>
												)
											}
										)}
								
								</AccordionGroup>
								<div className="Error">
									{Object.values(secondErrorsInfo).join(
										", "
									)}
								</div>
							</div>
							<div className="SectionOther">
								<p className={"Title"}>
									{t("site.Whats is your meeting experience")}
								</p>
							</div>
							<div className="SectionExperience">
								{/*	input radio horizontal gradient*/}
								<InputRadioGroupHG>
									<Controller
										render={({field}) => (
											<>
												{experiencesData &&
													experiencesData.map(
														(item: any) => {
															return (
																<InputRadioHorizontalGradient
																	key={
																		item.id
																	}
																	field={
																		field
																	}
																	id={
																		"input_radio_gradient_" +
																		"experiences" +
																		"_" +
																		item.id
																	}
																	value={
																		item.id
																	}
																	title={
																		item.title
																	}
																/>
															)
														}
													)}
											</>
										)}
										name={"experience"}
										control={control}
										defaultValue={
											getProfileParam("experience")
												? getProfileParam("experience")
														.id
												: ""
										}
									/>
								</InputRadioGroupHG>
							</div>
						</div>

						{/* actions */}
						<div className="Actions">
							{/* submit form */}
							<Button
								type={"button"}
								mode={"submit"}
								prevent={false}
								fullWidth={true}
							>
								<p className={"SubmitButtonText"}>
									{t("site.Let's go on")}
								</p>
							</Button>
						</div>
					</form>
				</div>
			</div>
		</CleanLayout>
	)
}

const mapStateToProps = (state: any) => ({
	spacesPrefer: state.preferSpaces,
	smokingPrefer: state.smokingPrefers,
	alcoholPrefer: state.alcohols,
	suits: state.suits,
	favorites: state.favorites,
	stages: state.stages,
	acts: state.acts,
	available: state.available,
	hosted: state.hosted,
	experiences: state.experiences,
	registerProfileData: state.RegisterProfileSlice,
	// editProfileState: state.EditProfileSlice,
})

const mapDispatchToProps = {
	getSpacesPrefer: userProfileActions.getPreferSpaces,
	getSmokingPrefer: userProfileActions.getSmokingPrefers,
	getAlcoholPrefer: userProfileActions.getAlcohols,
	getSuits: userProfileActions.getSuits,
	getFavorites: userProfileActions.getFavorites,
	getStages: userProfileActions.getStages,
	getActs: userProfileActions.getActs,
	getAvailable: userProfileActions.getAvailable,
	getHosted: userProfileActions.getHosted,
	getExperiences: userProfileActions.getExperiences,
	updateProfile: userProfileActions.updateProfile,
	saveProfileType: saveProfileType,
	toggleEditMode: toggleEditMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpProfileStep5)
