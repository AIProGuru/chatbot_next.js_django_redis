import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import Logotype from "@/components/ui/Header/Logotype"
import Section from "@/components/ui/SignUp/Section/Section"
import {Controller, useForm, useWatch} from "react-hook-form"
import React, {useEffect, useState} from "react"
import {useRouter} from "next/router"
import Button from "@/components/ui/Button/Button/Button"
import {connect} from "react-redux"
import Drawer from "@/components/ui/Drawer/Drawer/Drawer"
import {userProfileActions} from "@/redux/actions/userProfileActions"
import InputRadioHorizontalDefault from "@/components/ui/Forms/Inputs/RadioHorizontal/InputRadioHorizontalDefault"
// import InputText from "@/components/ui/Forms/Inputs/Text/InputText"
import InputCheckboxHorizontal from "@/components/ui/Forms/Inputs/CheckboxHorizontal/InputCheckboxHorizontal"
import {useTranslation} from "next-i18next"
import {useGetProfileDataQuery} from "@/services/users.service"
import {saveProfileType} from "@/redux/slices/RegisterProfileSlice"
import {getSelectedIds} from "@/components/ui/Functions/GetSelectedIDs"
import {clearObject} from "@/app/utils"
import {toggleEditMode} from "@/redux/slices/EditProfileSlice"
import {goBackEditMode} from "@/components/ui/Functions/GoBack"
import CleanLayout from "@/components/ui_app/AppLayouts/CleanLayout"
import InputSearch from "@/components/ui/Forms/Inputs/Search/InputSearch"
import ArrowIcon from "@/components/ui/Icons/ArrowIcon"
import ButtonLocation from "@/components/ui/Button/ButtonLocation/ButtonLocation"
import {yupResolver} from "@hookform/resolvers/yup"
import AdminMessage from "@/components/ui/AdminMessage/AdminMessage"
import {ProfileRegistrationStep2Schema} from "@/app/validation/ProfileRegistration/Step2.schema"
import {
	Area,
	Language,
	Region,
	useLazyGetAreasQuery,
	useLazyGetLanguagesQuery,
	useLazyGetRegionsQuery,
} from "@/services/static.service"

type FormData = {
	location_search: string
	location: number
	settlement: number
	language: any
}



function SignUpProfileStep2(props: any) {
	const {
		registerProfileData,
		updateProfile,
		saveProfileType,
		// editProfileState,
		toggleEditMode,
		editMode,
	} = props
	const {t} = useTranslation("site")
	const router = useRouter()
	const {profileID: id} = router.query

	// react hook form
	const {handleSubmit, control, watch, formState, setValue} =
		useForm<FormData>({
			resolver: yupResolver(ProfileRegistrationStep2Schema),
		})


	useEffect(() => {
		setTimeout(() => {
			handleSubmit(() => {})();
		}, 3000);
	}, []);


	
	const locationInput = watch("location")
	const areaInput = watch("settlement")
	const locationSearchInput = useWatch({
		control,
		name: "location_search",
		defaultValue: "",
	})
	const locationWatch = useWatch({
		control,
		name: "location",
	})
	const areaWatch = useWatch({
		control,
		name: "settlement",
	})

	// state
	const [locationDrawerShow, setLocationDrawerShow] = useState(false)
	const [isArea, setIsArea] = useState(false)
	const [locationDrawerTrigger, setLocationDrawerTrigger] = useState(false)
	const [locationTitle, setLocationTitle] = useState("")
	const [areaTitle, setAreaTitle] = useState("")
	// const [langList, setLangList] = useState<any[]>([])
	const [regions, setRegions] = useState<Region[]>([])
	const [areas, setAreas] = useState<Area[]>([])
	const [languages, setLanguages] = useState<Language[]>([])
	const [open, setOpen] = useState(true)

	// rtk
	const {data: getProfileData, refetch: refetchProfileData} =
		useGetProfileDataQuery({
			profileId: id,
		})
	const [triggerRegions, regionsResponse] = useLazyGetRegionsQuery()
	const [triggerLanguages, languagesResponse] = useLazyGetLanguagesQuery()
	const [triggerAreas, areasResponse] = useLazyGetAreasQuery()

	useEffect(() => {
		triggerLanguages({})
		triggerAreas({})
	}, [])

	useEffect(() => {
		if (languagesResponse && languagesResponse.isSuccess) {
			setLanguages(languagesResponse.data)
		}

		if (areasResponse && areasResponse.isSuccess) {
			setAreas(areasResponse.data.results)
		}

		if (regionsResponse && regionsResponse.isSuccess) {
			setRegions(regionsResponse.data.results)
		}
	}, [languagesResponse, areasResponse, regionsResponse])

	const searchRegions = (query: string) => {
		triggerRegions({
			search: query,
			settlement_id: areaWatch,
			page: 1,
			page_size: 100,
		})
	}

	useEffect(() => {
		if (areaWatch) {
			searchRegions("")
		}
	}, [areaWatch])

	useEffect(() => {
		if (getProfileData) {
			if (getProfileData.profile_type) {
				saveProfileType({
					profile_type: getProfileData.profile_type,
				})
			}
		}
	}, [getProfileData])

	function locationDrawerTriggerAction() {
		setLocationDrawerTrigger(true)
		setTimeout(() => {
			setLocationDrawerTrigger(false)
		}, 100)
	}

	useEffect(() => {
		if (locationWatch || areaWatch) {
			locationDrawerTriggerAction()
		}
	}, [locationWatch, areaWatch])

	// const searchRegions = useCallback(
	// 	(query: string) => {
	// 		getRegions(query, 50, 1)
	// 	},
	// 	[getRegions]
	// )
	//
	// useEffect(() => {
	// 	searchRegions("")
	// }, [searchRegions])
	//
	// useEffect(() => {
	// 	getLanguages()
	// 	getArea()
	// }, [getLanguages, getArea])

	// useEffect(() => {
	// 	if (languages && languages.data && languages.data.length > 0) {
	// 		const newLangs = Array.from(languages.data)
	// 		newLangs.sort((a: any, b: any) => {
	// 			if (a.id > b.id) return 1
	// 			if (a.id < b.id) return -1
	// 			return 0
	// 		})
	// 		setLangList(newLangs)
	// 	}
	// }, [languages])
	//
	useEffect(() => {
		if (locationInput && regions) {
			const search = regions.find(
				(s: any) => s.id === Number(locationInput)
			)
			if (search) {
				setLocationTitle(search.title)
			}
		}
	}, [locationInput, regions])

	useEffect(() => {
		if (areaInput && areas) {
			const search = areas.find((s: any) => s.id === Number(areaInput))
			if (search) {
				setAreaTitle(search.title)
			}
		}
	}, [areaInput, areas])

	useEffect(() => {
		const debounceSearch = setTimeout(() => {
			searchRegions(locationSearchInput)
		}, 1000)

		return () => {
			clearTimeout(debounceSearch)
		}
	}, [locationSearchInput])

	useEffect(() => {
		if (getProfileData) {
			if (getProfileData.location && getProfileData.location.id) {
				setValue("location", getProfileData.location.id)
			}
			if (
				getProfileData.nearest_settlement &&
				getProfileData.nearest_settlement.id
			) {
				setValue("settlement", getProfileData.nearest_settlement.id)
			}
		}
	}, [getProfileData])

	// location drawer toggle
	function toggleLocationDrawer(state: boolean) {
		setLocationDrawerShow(state)
		setIsArea(false)
	}

	// location drawer button click handler
	function onOpenLocationDrawerButtonClick(param: string) {
		toggleLocationDrawer(true)
		if (param === "area") {
			setIsArea(true)
		}
	}

	// on form submit
	function onFormSubmit(data: any) {
		// let skipLocationCheck = false
		// let skipAreaCheck = false

		// if (getProfileData) {
		// 	if (getProfileData.location && getProfileData.location.id) {
		// 		skipLocationCheck = true
		// 	}
		// }
		//
		// if (getProfileData) {
		// 	if (getProfileData.settlement && getProfileData.settlement.id) {
		// 		skipAreaCheck = true
		// 	}
		// }

		// if (!data.location && !skipLocationCheck) {
		// 	alert("Please, select location")
		// 	return
		// }
		// if (!data.settlement && !skipAreaCheck) {
		// 	alert("Please, select area")
		// 	return
		// }
		// if (!data.language) return

		const langIDs = (data.language && getSelectedIds(data.language)) || []

		// if (langIDs.length < 1) {
		// 	alert("Please, select at least 1 language")
		// 	return
		// }

		const formData = clearObject({
			location: parseInt(data.location),
			nearest_settlement: parseInt(data.settlement),
			languages_ids: langIDs,
		})

		updateProfile(id, 2, formData)

		// refetchProfileData()

		if (editMode) {
			goBackEditMode(router, toggleEditMode)
			return
		}

		switch (registerProfileData.profile_type) {
			case "COUPLE":
				router.push(`/auth/signup/${id}/step/3`).then(() => {
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

	// on go back
	function onGoBackClick() {
		if (editMode) {
			goBackEditMode(router, toggleEditMode)
			return
		}

		router.push(`/auth/signup/${id}/step/1`).then(() => {
			refetchProfileData()
		})
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

	// if (!getProfileData || !regions || !languages) return null
	if (!getProfileData) return null

	return (
		<CleanLayout useTabBar={false} fullHeight={true}>
			<div className="SignUpPageContainer">
				<div className="Step2">
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

					<form onSubmit={handleSubmit(onFormSubmit)}>
						<Drawer
							show={locationDrawerShow}
							setShow={toggleLocationDrawer}
							position={"bottom"}
							title={isArea ? t("site.Area") : t("site.Location")}
							trigger={locationDrawerTrigger}
							fixedHeight={!isArea}
						>
							<div className="LocationDrawerContainer">
								{!isArea && (
									<>
										<div className="Search">
											<Controller
												render={({field}) => (
													// <InputText
													// 	placeholder={"Search"}
													// 	type={"text"}
													// 	id={
													// 		"input_location_search"
													// 	}
													// 	field={field}
													// />
													<InputSearch
														placeholder={"Search"}
														type={"text"}
														id={
															"input_location_search"
														}
														field={field}
													/>
												)}
												name={"location_search"}
												control={control}
												defaultValue={""}
											/>
										</div>
										<Controller
											render={({field}) => (
												<>
													{regions &&
														regions.map(
															(region: any) => {
																return (
																	<InputRadioHorizontalDefault
																		key={
																			region.id
																		}
																		// id={
																		// 	"input_radio_location_" +
																		// 	region.id
																		// }
																		field={
																			field
																		}
																		value={
																			region.id
																		}
																		title={
																			region.title
																		}
																	/>
																)
															}
														)}
												</>
											)}
											name={"location"}
											control={control}
											defaultValue={
												getProfileParam("location")
													? getProfileParam(
															"location"
													  ).id
													: ""
											}
										/>
									</>
								)}

								{isArea && (
									<Controller
										render={({field}) => (
											<>
												{areas &&
													areas.map((area: any) => {
														return (
															<InputRadioHorizontalDefault
																key={area.id}
																// id={
																// 	"input_radio_location_" +
																// 	region.id
																// }
																field={field}
																value={area.id}
																title={
																	area.title
																}
															/>
														)
													})}
											</>
										)}
										name={"settlement"}
										control={control}
										defaultValue={
											getProfileParam(
												"nearest_settlement"
											)
												? getProfileParam(
														"nearest_settlement"
												  ).id
												: ""
										}
									/>
								)}
							</div>
						</Drawer>

						{/* sections */}
						<div className="Sections">
							{/* location */}
							<Section title={t("site.What area are you from")}>
								<div className="Area">
									<ButtonLocation
										type={"button"}
										prevent={true}
										id={"button_open_location_drawer"}
										fullWidth={true}
										onClick={() => {
											onOpenLocationDrawerButtonClick(
												"area"
											)
										}}
										icon={<ArrowIcon />}
									>
										<p
											className={
												"ButtonOpenLocationDrawer"
											}
										>
											{getProfileParam(
												"nearest_settlement"
											) && !areaTitle
												? getProfileParam(
														"nearest_settlement"
												  ).title
												: areaTitle
												? areaTitle
												: t("site.Select an area")}
										</p>
									</ButtonLocation>
									{formState.errors.settlement && (
										<div className="ErrorContainer">
											<p>
												{t(
													`site.${formState.errors.settlement.message}`
												)}
											</p>
										</div>
									)}
								</div>
 
								<div className="Location">
									<ButtonLocation
										type={"button"}
										prevent={true}
										id={"button_open_location_drawer"}
										fullWidth={true}
										onClick={() => {
											onOpenLocationDrawerButtonClick(
												"location"
											)
										}}
										icon={<ArrowIcon />}
										disabled={!areaWatch}
									>
										<p
											className={
												"ButtonOpenLocationDrawer"
											}
										>
											{getProfileParam("location") &&
											!locationTitle
												? getProfileParam("location")
														.title
												: locationTitle
												? locationTitle
												: t("site.Select an area")}
										</p>
									</ButtonLocation>
									{formState.errors.location && (
										<div className="ErrorContainer">
											<p>
												{t(
													`site.${formState.errors.location.message}`
												)}
											</p>
										</div>
									)}
								</div>
							</Section>

							{/* language */}
							<Section title={t("site.We speak languages")}>
								{languages &&
									languages.map((lang: any) => {
										return (
											<Controller
												render={({field}) => (
													<>
														<InputCheckboxHorizontal
															title={lang.title}
															field={field}
															value={lang.id}
															id={
																"input_checkbox_horizontal_language_" +
																lang.id
															}
														/>
													</>
												)}
												name={`language._${lang.id}`}
												control={control}
												defaultValue={getProfileCheckboxParam(
													"languages",
													lang.id
												)}
												key={lang.id}
											/>
										)
									})}

								{formState.errors.language && (
									<div className="ErrorContainer">
										<p>
											{t(
												`site.${formState.errors.language.message}`
											)}
										</p>
									</div>
								)}
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

// export default SignUpStep2

const mapStateToProps = (state: any) => ({
	// regions: state.regions,
	// languages: state.languages,
	registerProfileData: state.RegisterProfileSlice,
	// editProfileState: state.EditProfileSlice,
	// area: state.area,
})

const mapDispatchToProps = {
	// getRegions: userProfileActions.getRegions,
	updateProfile: userProfileActions.updateProfile,
	// getLanguages: userProfileActions.getLanguages,
	saveProfileType: saveProfileType,
	toggleEditMode: toggleEditMode,
	// getArea: userProfileActions.getArea,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpProfileStep2)
