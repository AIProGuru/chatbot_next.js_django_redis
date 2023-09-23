import Logotype from "@/components/ui/Header/Logotype"
import WelcomeToIcon from "@/components/ui/Icons/WelcomeToIcon"
import Section from "@/components/ui/SignUp/Section/Section"
import {Controller, useForm} from "react-hook-form"
import InputRadioVertical from "@/components/ui/Forms/Inputs/RadioVertical/InputRadioVertical"
import React, {useCallback, useEffect, useState} from "react"
import StyledIconRabbitEar1 from "@/components/ui/Icons/StyledIconRabbitEar1"
import StyledIconRabbitEar2 from "@/components/ui/Icons/StyledIconRabbitEar2"
import StyledIconRabbits from "@/components/ui/Icons/StyledIconRabbits"
import {useRouter} from "next/router"
import Button from "@/components/ui/Button/Button/Button"
import InputText from "@/components/ui/Forms/Inputs/Text/InputText"
import InputRadioHorizontal from "@/components/ui/Forms/Inputs/RadioHorizontal/InputRadioHorizontal"
import {userProfileActions} from "@/redux/actions/userProfileActions"
import {connect} from "react-redux"
import {useTranslation} from "next-i18next"
import {saveProfileType} from "@/redux/slices/RegisterProfileSlice"
import { 
	useCreateEmptyProfileMutation,
	useGetProfileDataQuery,
	useLazyGetUserProfilesInfoQuery,
} from "@/services/users.service"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import {yupResolver} from "@hookform/resolvers/yup"
import {
	validationProfileSignupCoupleStep1,
	validationProfileSignupManStep1,
	validationProfileSignupWomanStep1,
} from "@/app/validationSchemas"
import {toggleEditMode} from "@/redux/slices/EditProfileSlice"
import {goBackEditMode} from "@/components/ui/Functions/GoBack"
import CleanLayout from "@/components/ui_app/AppLayouts/CleanLayout"
import getConfig from "next/config"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
import {useAppDispatch} from "@/redux/store"
import AdminMessage from "@/components/ui/AdminMessage/AdminMessage"
import {updateUserInfo} from "@/redux/slices/UserInfoSlice"
const {publicRuntimeConfig} = getConfig()

type FormData = {
	profile_type: string
	age: {
		man: string
		woman: string
	}
	couple_nickname: string
	relation: string
}

function SignUpProfileStep1(props: any) {
	const {t} = useTranslation("site")

	const {
		getRelations,
		relations,
		registerProfileData,
		saveProfileType,
		updateProfile,
		// editProfileState,
		toggleEditMode,
		editMode,
	} = props
	const router = useRouter()
	const {profileID: id} = router.query

	const {data: getProfileData, refetch: refetchProfileData} =
		useGetProfileDataQuery({
			profileId: id,
		})
	const userProfilesData = useGetUserProfilesInfo()
	const [createEmptyProfile] = useCreateEmptyProfileMutation({})

	const dispatch = useAppDispatch()

	const [profileTypeSwitchCount, setProfileSwitchCount] = useState(0)
	const [newIdProfile, setNewIdProfile] = useState<string | undefined>(
		undefined
	)

	// validation
	const [validationType, setValidationType] = useState<any>()
	const formCoupleOptions = useCallback(() => {
		return {
			resolver: yupResolver(validationProfileSignupCoupleStep1),
		}
	}, [])
	const formManOptions = useCallback(() => {
		return {
			resolver: yupResolver(validationProfileSignupManStep1),
		}
	}, [])
	const formWomanOptions = useCallback(() => {
		return {
			resolver: yupResolver(validationProfileSignupWomanStep1),
		}
	}, [])

	const {handleSubmit, control, watch, setValue, formState, reset} =
		useForm<FormData>(validationType)




	useEffect(() => {
		setTimeout(() => {
			handleSubmit(() => {})();
		}, 3000);
	}, []);



	const {errors} = formState
	const profileType = watch("profile_type")
    const [open, setOpen] = useState(true)
	// rtk
	const [getUserProfilesInfoQuery, userProfilesInfoResponse] =
		useLazyGetUserProfilesInfoQuery()

	const getValidation = useCallback(() => {
		switch (profileType) {
			case "MAN":
				return setValidationType(formManOptions)
			case "WOMAN":
				return setValidationType(formWomanOptions)
			case "COUPLE":
				return setValidationType(formCoupleOptions)
		}
	}, [formCoupleOptions, formManOptions, formWomanOptions, profileType])

	useEffect(() => {
		getValidation()
		// setValue("relation", "")
	}, [getValidation, profileType])

	useEffect(() => {
		if (profileType) {
			if (profileTypeSwitchCount > 0) {
				setValue("relation", "")
			}

			setProfileSwitchCount((prevState) => prevState + 1)
		}
	}, [profileType])

	useEffect(() => {
		if (
			userProfilesInfoResponse &&
			userProfilesInfoResponse.isSuccess &&
			userProfilesInfoResponse.data &&
			newIdProfile
		) {

			dispatch(
				updateUserInfo({
					value: userProfilesInfoResponse.data,
				})
			)
			if (newIdProfile) {
				router.push(`/auth/signup/${newIdProfile}/step/2`).then(() => {
					refetchProfileData()
				})
			}
		}
	}, [newIdProfile, userProfilesInfoResponse])

	// get relations
	useEffect(() => {
		getRelations()
	}, [getRelations])

	useEffect(() => {
		if (getProfileData) {
			setValue("profile_type", getProfileData.profile_type)
		}
	}, [getProfileData])

	// const clearCoupleInputs = () => {
	// 	setValue("relation", "")
	// 	setValue("couple_nickname", "")
	// }
	// // reset relation radio input when profile type is not couple, so after switch there is no default value
	// useEffect(() => {
	// 	switch (profileType) {
	// 		case "MAN":
	// 			clearCoupleInputs()
	// 			break
	//
	// 		case "WOMAN":
	// 			clearCoupleInputs()
	// 			break
	// 	}
	// }, [profileType, setValue])

	const allowedProfileTypes = ["MAN", "WOMAN", "COUPLE"]
	const profileTypeList = [
		{
			icon: <StyledIconRabbitEar1 />,
			value: "MAN",
			title: t("site.Man"),
			id: "profile_type.man",
		},
		{
			icon: <StyledIconRabbitEar2 />,
			value: "WOMAN",
			title: t("site.Woman"),
			id: "profile_type.woman",
		},
		{
			icon: <StyledIconRabbits />,
			value: "COUPLE",
			title: t("site.We are a couple"),
			id: "profile_type.couple",
		},
	]

	const getFormData = (data: FormData) => {
		const man = parseInt(data.age.man)
		const woman = parseInt(data.age.woman)
		switch (data.profile_type) {
			case "COUPLE":
				return {
					profile_type: data.profile_type,
					man_age: man,
					woman_age: woman,
					couple_nickname: data.couple_nickname,
					relation: data.relation,
				}
			case "MAN":
				return {
					profile_type: data.profile_type,
					man_age: man,
					relation: Number(data.relation),
				}
			case "WOMAN":
				return {
					profile_type: data.profile_type,
					woman_age: woman,
					relation: Number(data.relation),
				}
		}
	}

	useEffect(() => {
		if (getProfileData?.relation) {
			setValue("relation", getProfileParam("relation")?.id)
		}
	}, [getProfileData])

	function getProfileParam(param: string): any {
		if (!getProfileData) return ""

		if (getProfileData && getProfileData[param]) {
			return getProfileData[param]
		} else {
			return ""
		}
	}

	async function onFormSubmit(data: FormData) {
		if (data.profile_type === undefined || Object.keys(errors).length !== 0)
			return
		// if (!data.profile_type) return

		// return

		saveProfileType({
			profile_type: data.profile_type,
		})

		const profileData = getFormData(data)

		console.log(profileData)

		// return/

		// if (id && Number(id) > 0) {
		if (id && Number(id) !== 0) {
			await updateProfile(id, 1, profileData)

			if (editMode) {
				goBackEditMode(router, toggleEditMode)
				return
			}

			router.push(`/auth/signup/${id}/step/2`).then(() => {
				refetchProfileData()
			})
		} else {
			createEmptyProfile({body: profileData})
				.unwrap()
				.then((r: any) => {
					setNewIdProfile(r.id)
					getUserProfilesInfoQuery({})
				})
				.catch((e: any) => {
					console.log(e)
					alert("Something went wrong")
				})
		}
	}

	function getCoupleNickname() {
		if (id && Number(id) === 0) {
			return userProfilesData?.username || ""
		} else {
			return getProfileData?.couple_nickname || ""
		}
	}

	function onGoBackClick() {
		if (editMode) {
			goBackEditMode(router, toggleEditMode)
			return
		}
	}

	const getDisabledProfileTypes = (value: string) => {
		if (id && Number(id) !== 0) {
			return true
		}

		if (
			userProfilesData &&
			userProfilesData.profiles &&
			userProfilesData.profiles.length > 0
		) {
			const types: string[] = userProfilesData.profiles.map((profile) => {
				return profile.profile_type
			})

			return types.includes(value)
		}

		return false

		// !!(
		// 	id &&
		// 	Number(
		// 		id
		// 	) !==
		// 	0
		// )
	}

	if (!userProfilesData || !id) return null

	return (
		<CleanLayout useTabBar={false} fullHeight={true}>
			<div className="SignUpPageContainer">
				<div className="Step1">
					{/* go back */}
					{editMode && (
						<div className="GoBack">
							<TransparentButton
								icon={<GoBackIcon />}
								onClick={onGoBackClick}
								type={"button"}
							/>
						</div>
					)}

					{/* logotype */}
					<div className="WelcomeLogotype">
						<WelcomeToIcon />
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

					{/* info */}
					<div className="WelcomeMessage">
						<p>
							{t(
								"site.Make a short note and you will get to know couples women and men just like you Do not worry everything is discreet"
							)}
						</p>
						{/*<p>{JSON.stringify(errors)}</p>*/}
					</div>

					{/* form */}
					<form onSubmit={handleSubmit(onFormSubmit)}>
						<div className="Sections">
							{/* profile type section */}
							<Section
								title={t(
									"site.Let's get to know each other a bit Who are you"
								)}
							>
								<div className={"ProfileType"}>
									<Controller
										render={({field}) => {
											return (
												<>
													{profileTypeList.map(
														(profile, index) =>
															allowedProfileTypes.includes(
																profile.value
															) && (
																<InputRadioVertical
																	icon={
																		profile.icon
																	}
																	value={
																		profile.value
																	}
																	title={
																		profile.title
																	}
																	id={
																		profile.id
																	}
																	key={
																		profile.id
																	}
																	field={
																		field
																	}
																	disabled={
																		getDisabledProfileTypes(
																			profile.value
																		)
																		// !!(
																		// 	id &&
																		// 	Number(
																		// 		id
																		// 	) !==
																		// 		0
																		// )
																	}
																/>
															)
													)}
												</>
											)
										}}
										name={"profile_type"}
										control={control}
									/>
								</div>
							</Section>

							{/* age section */}
							{profileType && (
								<Section>
									{/* woman age */}
									<div className={"Age"}>
										{(profileType === "WOMAN" ||
											profileType === "COUPLE") && (
											<div className="InputColumn">
												<Controller
													render={({field}) => (
														<InputText
															field={field}
															required={true}
															placeholder={t(
																"site.The age of the woman"
															)}
															type={"number"}
															id={"age.woman"}
															error={
																errors.age
																	?.woman
																	?.message &&
																t(
																	`site.${errors.age?.woman?.message}`
																)
															}
														/>
													)}
													name={"age.woman"}
													control={control}
													defaultValue={
														(getProfileData &&
															getProfileData.woman &&
															getProfileData.woman
																.age &&
															getProfileData.woman.age.toString()) ||
														""
													}
												/>
											</div>
										)}

										{/* man age */}
										{(profileType === "MAN" ||
											profileType === "COUPLE") && (
											<div className="InputColumn">
												<Controller
													render={({field}) => (
														<InputText
															field={field}
															required={true}
															placeholder={t(
																"site.The age of the man"
															)}
															type={"number"}
															id={"age.man"}
															error={
																errors.age?.man
																	?.message &&
																t(
																	`site.${errors.age?.man?.message}`
																)
															}
														/>
													)}
													name={"age.man"}
													control={control}
													defaultValue={
														(getProfileData &&
															getProfileData.man &&
															getProfileData.man
																.age &&
															getProfileData.man.age.toString()) ||
														""
													}
												/>
											</div>
										)}
									</div>

									{profileType === "COUPLE" && (
										<div className={"CoupleNickname"}>
											<Controller
												render={({field}) => (
													<InputText
														field={field}
														required={true}
														placeholder={t(
															"site.couple_nickname_placeholder"
														)}
														type={"text"}
														id={
															"input_nickname_couple"
														}
														error={
															errors
																.couple_nickname
																?.message &&
															t(
																`site.${errors.couple_nickname?.message}`
															)
														}
													/>
												)}
												name={"couple_nickname"}
												control={control}
												defaultValue={getCoupleNickname()}
											/>
										</div>
									)}
								</Section>
							)}

							{/* relation (only for couple) */}
							{/*{profileType === "COUPLE" && (*/}
							<Section
								title={
									profileType === "MAN" ||
									profileType === "WOMAN"
										? t("site.status")
										: t("site.The connection we built")
								}
							>
								<div className="Relation">
									<Controller
										render={({field}) => (
											<>
												{relations &&
													relations.data &&
													relations.data
														.filter(
															(e: any) =>
																e.profile_type ===
																profileType
														)
														.map((item: any) => (
															<>
																<InputRadioHorizontal
																	key={
																		item.id
																	}
																	value={
																		item.id
																	}
																	field={
																		field
																	}
																	title={
																		item.title
																	}
																	id={
																		"input_radio_horizontal_relation_" +
																		item.id
																	}
																/>
															</>
														))}
											</>
										)}
										name={"relation"}
										control={control}
										defaultValue={
											getProfileParam("relation")
												? getProfileParam("relation").id
												: ""
										}
									/>

									{formState.errors.relation && (
										<div className="ErrorContainer">
											<p>
												{t(
													`site.${formState.errors.relation.message}`
												)}
											</p>
										</div>
									)}
								</div>
							</Section>
							{/*)}*/}
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

// export default SignUpStep1

const mapStateToProps = (state: any) => ({
	relations: state.relations,
	registerProfileData: state.RegisterProfileSlice,
	// editProfileState: state.EditProfileSlice,
})

const mapDispatchToProps = {
	getRelations: userProfileActions.getRelations,
	updateProfile: userProfileActions.updateProfile,
	saveProfileType: saveProfileType,
	toggleEditMode: toggleEditMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpProfileStep1)
