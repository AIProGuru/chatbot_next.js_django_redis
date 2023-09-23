import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import Logotype from "@/components/ui/Header/Logotype"
import Section from "@/components/ui/SignUp/Section/Section"
import {Controller, useForm, useWatch} from "react-hook-form"
import React, {useEffect, useMemo, useState} from "react"
import {useRouter} from "next/router"
import Button from "@/components/ui/Button/Button/Button"
import {connect} from "react-redux"
import {userProfileActions} from "@/redux/actions/userProfileActions"
import InputText from "@/components/ui/Forms/Inputs/Text/InputText"
import {TFunction, useTranslation} from "next-i18next"
import AccordionItem from "@/components/ui/Accordion/AccordionItem"
import AccordionGroup from "@/components/ui/Accordion/AccordionGroup"
import ProgressBar from "@/components/ui/Forms/Inputs/InProgressBar/ProgressBar"
import Drawer from "@/components/ui/Drawer/Drawer/Drawer"
import InputRadioHorizontalDefault from "@/components/ui/Forms/Inputs/RadioHorizontal/InputRadioHorizontalDefault"
import InputCalendar from "@/components/ui/Forms/Inputs/Calendar/InputCalendar"
import {clearObject} from "@/app/utils"
import {format, isValid} from "date-fns"
import {useGetProfileDataQuery} from "@/services/users.service"
import {saveProfileType} from "@/redux/slices/RegisterProfileSlice"
// import Picker from "@/components/ui/Forms/Inputs/RollPickerSelect/Picker/Picker"
import {goBackEditMode} from "@/components/ui/Functions/GoBack"
import {toggleEditMode} from "@/redux/slices/EditProfileSlice"
import CleanLayout from "@/components/ui_app/AppLayouts/CleanLayout"
import {yupResolver} from "@hookform/resolvers/yup"
import {
	Step3SchemaMan,
	Step3SchemaWoman,
} from "@/app/validation/ProfileRegistration/Step3.schema"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
import AdminMessage from "@/components/ui/AdminMessage/AdminMessage"
// import PickerItem from "@/components/ui/Forms/Inputs/RollPickerSelect/PickerItem/PickerItem"

type FormData = {
	nickname: string
	birthday: string
	height: string
	body_structure: string
	breast_size: string
	body_hair: string
	sexual_orientation: string
	skin_tone: string
	most_impressive: string
	smoking: string
	[x: string]: any
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

type ErrorTranslations = {
	[x: string]: any
}

const getErrorTranslations = (t: TFunction): ErrorTranslations => {
	return {
		yup_pr_step3_nickname_startsWithSpace: t(
			"site.yup_pr_step3_nickname_startsWithSpace"
		),
		yup_pr_step3_nickname_noSpecialCharacters: t(
			"site.yup_pr_step3_nickname_noSpecialCharacters"
		),
		yup_pr_step3_height_120_220: t(
			"site.Height must be between 120 and 220"
		),
		yup_height_required: t("site.Height is required"),
		yup_nickname_required: t("site.nickname_is_required"),
		yup_birthday_required: t("site.Birthday is required"),
		yup_body_structure_required: t("site.Body structure is required"),
		yup_sexual_orientation_required: t(
			"site.Sexual orientation is required"
		),
		yup_skin_tone_required: t("site.Skin tone is required"),
		yup_most_impressive_required: t("site.Most impressive is required"),
		yup_smoking_required: t("site.Smoking is required"),
		yup_body_hair_required: t("site.Body hair is required"),
		yup_breast_size_required: t("site.Breast size is required"),
	}
}

function FormPart(props: FormPartProps) {
	const {data, name, control, defaultValue, drawerTrigger} = props

	return (
		<Controller
			render={({field}) => (
				<>
					{data &&
						data.map((item: any) => {
							return (
								<InputRadioHorizontalDefault
									key={item.id}
									id={"input_radio_" + name + "_" + item.id}
									field={field}
									value={item.id}
									title={item.title}
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

function SignUpProfileStep3(props: any) {
	const {t} = useTranslation("site")
	const errorTranslations = useMemo(() => {
		return getErrorTranslations(t)
	}, [t])

	// basic props
	const {
		getBodyStructures,
		getChestSizes,
		getBodyHair,
		getSexualOrientations,
		getSkinTones,
		getMostImpressive,
		getSmokingTypes,

		bodyStructures,
		chestSizes,
		bodyHair,
		sexualOrientations,
		skinTones,
		mostImpressive,
		registerProfileData,
		smokingTypes,

		thisPageProfile,
		profileProgress,

		updateProfile,
		saveProfileType,
		// editProfileState,
		toggleEditMode,
		editMode,
	} = props

	const {data: bodyStructuresData} = bodyStructures
	const {data: chestSizesData} = chestSizes
	const {data: bodyHairData} = bodyHair
	const {data: sexualOrientationsData} = sexualOrientations
	const {data: skinTonesData} = skinTones
	const {data: mostImpressiveData} = mostImpressive
	const {data: smokingTypesData} = smokingTypes
	const [open, setOpen] = useState(true)
	const router = useRouter()
	const {profileID: id} = router.query

	const {data: getProfileData, refetch: refetchProfileData} =
		useGetProfileDataQuery({
			profileId: id,
		})
	const userProfilesData = useGetUserProfilesInfo()

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
		getBodyStructures()
		getChestSizes()
		getBodyHair()
		getSexualOrientations()
		getSkinTones()
		getMostImpressive()
		getSmokingTypes()
	}, [
		getBodyStructures,
		getChestSizes,
		getBodyHair,
		getMostImpressive,
		getSexualOrientations,
		getSkinTones,
		getSmokingTypes,
	])
 
	// react hook form
	const {
		handleSubmit,
		control,
		watch,
		setValue,
		register,
		getValues,
		formState,
	} = useForm<FormData>({
		resolver: yupResolver(
			thisPageProfile === "WOMAN" ? Step3SchemaWoman : Step3SchemaMan
		),
		mode: "onChange",
		shouldFocusError: false,
	})


	useEffect(() => {
		setTimeout(() => {
			handleSubmit(() => {})();
		}, 3000);
	}, []);


	const watcher: any = {
		body_structure: useWatch({control, name: "body_structure"}),
		breast_size: useWatch({control, name: "breast_size"}),
		body_hair: useWatch({control, name: "body_hair"}),
		sexual_orientation: useWatch({control, name: "sexual_orientation"}),
		skin_tone: useWatch({control, name: "skin_tone"}),
		most_impressive: useWatch({control, name: "most_impressive"}),
		smoking: useWatch({control, name: "smoking"}),
		height: useWatch({control, name: "height"}),
	}

	const setDataFromBase = () => {
		const man = getProfileData?.man
		const woman = getProfileData?.woman
		if (thisPageProfile === "MAN" && man) {
			setValue(
				"body_structure",
				man?.body_structure?.id?.toString() || ""
			)
			setValue("body_hair", man?.body_hair?.id?.toString() || "")
			setValue(
				"sexual_orientation",
				man?.sexual_orientation?.id?.toString() || ""
			)
			setValue("skin_tone", man?.skin?.id?.toString() || "")
			setValue(
				"most_impressive",
				man.most_impressive?.id?.toString() || ""
			)
			setValue("smoking", man?.smoking?.id?.toString() || "")
		}
		if (thisPageProfile === "WOMAN" && woman) {
			setValue(
				"body_structure",
				woman?.body_structure?.id?.toString() || ""
			)
			setValue("breast_size", woman?.chest_size?.id?.toString() || "")
			setValue(
				"sexual_orientation",
				woman?.sexual_orientation?.id?.toString() || ""
			)
			setValue("skin_tone", woman?.skin?.id?.toString() || "")
			setValue(
				"most_impressive",
				woman?.most_impressive?.id?.toString() || ""
			)
			setValue("smoking", woman?.smoking?.id?.toString() || "")
		}
	}

	useEffect(() => {
		setDataFromBase()
	}, [getProfileData])

	const dater: any = {
		body_structure: bodyStructuresData,
		breast_size: chestSizesData,
		body_hair: bodyHairData,
		sexual_orientation: sexualOrientationsData,
		skin_tone: skinTonesData,
		most_impressive: mostImpressiveData,
		smoking: smokingTypesData,
	}

	const accordionGroup: TAccordionItem[] = [
		// {
		// 	id: "height",
		// 	title: t("site.height"),
		// 	mode: "drawer",
		// 	callback: () => {
		// 		toggleDrawer(true, "height")
		// 	},
		// },
		{
			id: "body_structure",
			title: t("site.body structure"),
			mode: "drawer",
			callback: () => {
				toggleDrawer(true, "body_structure")
			},
		},
		{
			id: thisPageProfile === "WOMAN" ? "breast_size" : "body_hair",
			title:
				thisPageProfile === "WOMAN"
					? t("site.Breast size")
					: t("site.Body hair"),
			mode: "drawer",
			callback: () => {
				toggleDrawer(
					true,
					thisPageProfile === "WOMAN" ? "breast_size" : "body_hair"
				)
			},
		},
		{
			id: "sexual_orientation",
			title: t("site.Sexual orientation"),
			mode: "drawer",
			callback: () => {
				toggleDrawer(true, "sexual_orientation")
			},
		},
		{
			id: "skin_tone",
			title: t("site.skin tone"),
			mode: "drawer",
			callback: () => {
				toggleDrawer(true, "skin_tone")
			},
		},
		{
			id: "most_impressive",
			title: t("site.Most impressive to me"),
			mode: "drawer",
			callback: () => {
				toggleDrawer(true, "most_impressive")
			},
		},
		{
			id: "smoking",
			title: t("site.smoking_step3"),
			mode: "drawer",
			callback: () => {
				toggleDrawer(true, "smoking")
			},
		},
	]

	const [drawerMode, setDrawerMode] = useState("")
	const [drawerStatus, setDrawerStatus] = useState(false)
	// const [heightDrawer, setHeightDrawer] = useState(false)
	// const [heightDrawerTrigger, setHeightDrawerTrigger] = useState(false)
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
		let bDate = parseInt(data.birthday)

		const profile = {}
		const profileData = clearObject({
			nickname: data.nickname,
			birthday_month: bDate && format(new Date(bDate), "MM"), //data.birthday.toISOString(),
			birthday_day: bDate && format(new Date(bDate), "dd"), //data.birthday.toISOString(),
			height: data.height && Number(data.height),
			body_structure: data.body_structure && Number(data.body_structure),
			chest_size: data.breast_size && Number(data.breast_size),
			body_hair: data.body_hair && Number(data.body_hair),
			sexual_orientation:
				data.sexual_orientation && Number(data.sexual_orientation),
			skin: data.skin_tone && Number(data.skin_tone),
			most_impressive:
				data.most_impressive && Number(data.most_impressive),
			smoking: data.smoking && Number(data.smoking),
		})

		if (thisPageProfile === "WOMAN") {
			Object.assign(profile, {woman: profileData})
		} else {
			Object.assign(profile, {man: profileData})
		}

		// return

		updateProfile(id, thisPageProfile === "WOMAN" ? 4 : 3, profile)

		if (editMode) {
			goBackEditMode(router, toggleEditMode)
			return
		}

		routeSwitchForward()
	}

	function skipStep() {
		// routeSwitchForward()
		router.push("/").then()
	}

	function routeSwitchForward() {
		switch (registerProfileData.profile_type) {
			case "COUPLE":
				if (thisPageProfile === "MAN") {
					router.push(`/auth/signup/${id}/step/5`).then(() => {
						refetchProfileData()
					})
				} else {
					router.push(`/auth/signup/${id}/step/4`).then(() => {
						refetchProfileData()
					})
				}

				break

			case "WOMAN":
				router.push(`/auth/signup/${id}/step/5`).then(() => {
					refetchProfileData()
				})
				break

			case "MAN":
				router.push(`/auth/signup/${id}/step/5`).then(() => {
					refetchProfileData()
				})
				break
		}
	}

	function routeSwitchBackward() {
		if (thisPageProfile === "MAN") {
			if (registerProfileData.profile_type === "COUPLE") {
				router.push(`/auth/signup/${id}/step/3`).then(() => {
					refetchProfileData()
				})
			} else {
				router.push(`/auth/signup/${id}/step/2`).then(() => {
					refetchProfileData()
				})
			}
		} else {
			router.push(`/auth/signup/${id}/step/2`).then(() => {
				refetchProfileData()
			})
		}
	}

	// on go back
	function onGoBackClick() {
		if (editMode) {
			goBackEditMode(router, toggleEditMode)
			return
		}

		routeSwitchBackward()
		// router.push(`/auth/signup/${id}/step/3`)
	}

	function DrawerData() {
		let data: any = undefined
		let defaultValue = ""

		switch (drawerMode) {
			case "body_structure":
				const bs: any = getProfileParam("body_structure")
				defaultValue = bs ? bs.id : ""
				data = bodyStructuresData
				break

			case "breast_size":
				const bsize: any = getProfileParam("chest_size")
				defaultValue = bsize ? bsize.id : ""
				data = chestSizesData
				break

			case "body_hair":
				const bh: any = getProfileParam("body_hair")
				defaultValue = bh ? bh.id : ""
				data = bodyHairData
				break

			case "sexual_orientation":
				const so: any = getProfileParam("sexual_orientation")
				defaultValue = so ? so.id : ""
				data =
					(sexualOrientationsData &&
						Array.isArray(sexualOrientationsData) &&
						sexualOrientationsData
							.map((orient: any) => {
								if (orient.profile_type === thisPageProfile) {
									return orient
								}
							})
							.filter((e) => e)) ||
					[]
				break

			case "skin_tone":
				const st: any = getProfileParam("skin")
				defaultValue = st ? st.id : ""
				data = skinTonesData
				break

			case "most_impressive":
				const mi: any = getProfileParam("most_impressive")
				defaultValue = mi ? mi.id : ""
				data = mostImpressiveData
				break

			case "smoking":
				const smkng: any = getProfileParam("smoking")
				defaultValue = smkng ? smkng.id : ""
				data = smokingTypesData
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
		const search = accordionGroup.find((s) => s.id === drawerMode)
		if (search) {
			return search.title
		} else {
			return ""
		}
	}

	function getProgressLength(): number {
		// total % / (total steps / current step - 1)
		if (registerProfileData.profile_type === "COUPLE") {
			if (thisPageProfile === "WOMAN") {
				return 100 / (6 / (3 - 1))
			} else {
				return 100 / (6 / (4 - 1))
			}
		} else {
			return 100 / (6 / (3 - 1))
		}
	}

	function getProfileParam(param: string): any {
		if (!getProfileData) return ""

		if (thisPageProfile === "WOMAN") {
			if (getProfileData.woman && getProfileData.woman[param]) {
				return getProfileData.woman[param]
			} else {
				return ""
			}
			// return getProfileData.woman[param] || ""
		} else {
			// return getProfileData.man[param] || ""
			if (getProfileData.man && getProfileData.man[param]) {
				return getProfileData.man[param]
			} else {
				return ""
			}
		}
	}

	// todo: Fuck! This function is amazingly stupid! (as I am)
	function getAccordionCurrentValue(pid: string) {
		let id = pid

		if (id == "breast_size") {
			id = "chest_size"
		}

		if (id == "skin_tone") {
			id = "skin"
		}

		const profileParam = getProfileParam(id)
		const value = watcher[pid]

		// if (profileParam) {
		// 	return profileParam.title ? profileParam.title : ""
		// }
		
		try {
			const dataArray: any = Array.from(dater[pid])

			if (dataArray) {
				const search = dataArray.find(
					(s: any) => s.id === Number(value)
				)

				if (search) {
					return search.title
				} else {
					if (profileParam) {
						return profileParam.title ? profileParam.title : ""
					}
				}
			}
		} catch (e) {
			// console.log(e)
		}
	}

	function getHeight() {
		const profileParam = getProfileParam("height")
		const value = watcher.height

		if (value) {
			return Number(value)
		}

		if (profileParam) {
			return Number(profileParam)
		}

		return undefined

		// console.log("getHeight", profileParam, value)
		//
		// return 150
	}

	function getBirthdayDefaultValue() {
		const d = getProfileParam("birthday_day")
		const m = getProfileParam("birthday_month")

		if (!m || !d) return
		return new Date(`${new Date().getFullYear()}/${m}/${d}`).getTime()
	}

	function getProfileNickname() {
		const profileNickname = getProfileParam("nickname")

		if (!profileNickname) {
			return userProfilesData?.username || ""
		} else {
			return profileNickname
		}
	}

	if (!getProfileData) return null
	if (
		!bodyStructuresData ||
		!chestSizesData ||
		!bodyHairData ||
		!sexualOrientationsData ||
		!skinTonesData ||
		!mostImpressiveData ||
		!userProfilesData
	)
		return null

	const disabledBirth = () => {
		if (
			thisPageProfile === "WOMAN" &&
			getProfileData?.woman?.birthday_day &&
			getProfileData?.woman?.birthday_month &&
			editMode
		) {
			return true
		}
		if (
			thisPageProfile === "MAN" &&
			getProfileData?.man?.birthday_day &&
			getProfileData?.man?.birthday_month &&
			editMode
		) {
			return true
		}
		return false
	}

	const birth = watch("birthday")

	const asArray = Object.entries(formState.errors)
	const filtered = asArray.filter(
		([key, value]) => !["birthday", "height", "nickname"].includes(key)
	)
	const justStrings = Object.fromEntries(filtered)

	const errorsInfo = Object.values(justStrings).map(
		(error) => errorTranslations[error != undefined && error.message != undefined ? error.message as keyof typeof errorTranslations : ""]
	)

	return (
		<CleanLayout useTabBar={false} fullHeight={true}>
			{/*<div style={{position: "absolute", top: "16px", left: "64px"}}>*/}
			{/*	{thisPageProfile === "MAN" && "MAN"}*/}
			{/*	{thisPageProfile === "WOMAN" && "WOMAN"}*/}
			{/*</div>*/}
			<div className="SignUpPageContainer">
				<div className="Step3Profile">
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

					<form onSubmit={handleSubmit(onFormSubmit)}>
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

						{/*<Drawer*/}
						{/*	show={heightDrawer}*/}
						{/*	setShow={setHeightDrawer}*/}
						{/*	position={"bottom"}*/}
						{/*	title={t("site.Height")}*/}
						{/*>*/}
						{/*	<Controller*/}
						{/*		render={({field}) => {*/}
						{/*			return (*/}
						{/*				<Picker*/}
						{/*					min={120}*/}
						{/*					max={220}*/}
						{/*					sort={"reverse"}*/}
						{/*					field={field}*/}
						{/*				/>*/}
						{/*			)*/}
						{/*		}}*/}
						{/*		name={"height"}*/}
						{/*		control={control}*/}
						{/*	/>*/}
						{/*</Drawer>*/}

						<div className="Sections">
							<Section
								title={
									thisPageProfile === "WOMAN"
										? t("site.A little about the woman")
										: thisPageProfile === "MAN"
										? t("site.A little about the man")
										: ""
								}
								padding={"small"}
							>
								<div className="Profile">
									<div className="ProfileBasic">
										{/*	nickname & birthday month */}
										<div className="InputColumn">
											<Controller
												render={({
													field,
													fieldState,
												}) => {
													return (
														<InputText
															field={field}
															// required={true}
															placeholder={t(
																"site.Fake name optional"
															)}
															type={"text"}
															id={
																"input_nickname"
															}
															maxLength={20}
															error={
																formState.errors
																	?.nickname
																	?.message &&
																errorTranslations[
																	formState
																		.errors
																		.nickname
																		.message
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

										<div className="InputColumn">
											<InputCalendar
												placeholder={t("site.Birthday")}
												register={register}
												setValue={setValue}
												name={"birthday"}
												disabled={disabledBirth()}
												// defaultValue={`${new Date().getFullYear()}-${getProfileParam(
												// 	"birthday_month"
												// )}-${getProfileParam(
												// 	"birthday_day"
												// )}`}
												error={
													formState.errors?.birthday
														?.message &&
													errorTranslations[formState.errors.birthday.message]
												}
												defaultValue={getBirthdayDefaultValue()}
											/>
										</div>
									</div>
									<div className="ProfileHeight">
										<Controller
											render={({field, fieldState}) => (
												<InputText
													field={field}
													// required={true}
													placeholder={t(
														"site.height"
													)}
													type={"number"}
													id={"input_height"}
													error={
														formState.errors?.height
															?.message &&
														errorTranslations[
															formState.errors
																.height.message
														]
													}
												/>
											)}
											name={"height"}
											control={control}
											defaultValue={getProfileParam(
												"height"
											)}
										/>
									</div>

									<div className="ProfileDetails">
										<AccordionGroup>
											{/*<AccordionItem*/}
											{/*	title={t("site.Height")}*/}
											{/*	// select={"110"}*/}
											{/*	select={getHeight()?.toString()}*/}
											{/*	mode={"drawer"}*/}
											{/*	callback={() => {*/}
											{/*		// setHeightDrawerTrigger(*/}
											{/*		// 	false*/}
											{/*		// )*/}
											{/*		setHeightDrawer(true)*/}
											{/*	}}*/}
											{/*/>*/}
											{accordionGroup &&
												accordionGroup.map(
													(
														item: TAccordionItem,
														index: number
													) => {
														return (
															<AccordionItem
																key={index}
																title={
																	item.title
																}
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
											{Object.values(errorsInfo).join(
												", "
											)}
										</div>
									</div>
								</div>
							</Section>
						</div>

						{/* actions */}
						<div className="Actions">
							{/* submit form */}
							<Button
								type={"button"}
								mode={"submit"}
								prevent={false}
								fullWidth={true}
								disabled={!!errorsInfo.length}
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
	bodyStructures: state.bodyStructures,
	chestSizes: state.chestSizes,
	bodyHair: state.bodyHeir,
	sexualOrientations: state.sexualOrientations,
	skinTones: state.skinTones,
	mostImpressive: state.mostImpressive,
	smokingTypes: state.smokingTypes,
	registerProfileData: state.RegisterProfileSlice,
	// editProfileState: state.EditProfileSlice,
})

const mapDispatchToProps = {
	getBodyStructures: userProfileActions.getBodyStructures,
	getChestSizes: userProfileActions.getChestSizes,
	getBodyHair: userProfileActions.getBodyHair,
	getSexualOrientations: userProfileActions.getSexualOrientation,
	getSkinTones: userProfileActions.getSkinTones,
	getMostImpressive: userProfileActions.getMostImpressive,
	getSmokingTypes: userProfileActions.getSmokingTypes,
	updateProfile: userProfileActions.updateProfile,
	saveProfileType: saveProfileType,
	toggleEditMode: toggleEditMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpProfileStep3)
