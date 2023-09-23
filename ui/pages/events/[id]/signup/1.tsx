import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import Logotype from "@/components/ui/Header/Logotype"
import Divider from "@/components/ui/Divider/Divider"
import Button from "@/components/ui/Button/Button/Button"
import {Controller, useForm} from "react-hook-form"
import InputText from "@/components/ui/Forms/Inputs/Text/InputText"
import React, {useEffect, useState} from "react"
import InputRadioVertical from "@/components/ui/Forms/Inputs/RadioVertical/InputRadioVertical"
import StyledIconRabbitEar1 from "@/components/ui/Icons/StyledIconRabbitEar1"
import StyledIconRabbitEar2 from "@/components/ui/Icons/StyledIconRabbitEar2"
import StyledIconRabbits from "@/components/ui/Icons/StyledIconRabbits"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import {useRouter} from "next/router"
import {useAppDispatch, useAppSelector} from "@/redux/store"
import {
	saveAnonStep1,
	saveAnonUserId,
} from "@/redux/slices/AnonEventSignUpSlice"
import {useAnonGetEventQuery} from "@/services/anonymous.service"
import {useAuth} from "@/components/auth/AuthProvider"
import {UserProfilesInfoProfile} from "@/services/users.service"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import {yupResolver} from "@hookform/resolvers/yup"
import {
	validationEventCoupleStep1,
	validationEventManStep1,
	validationEventWomanStep1,
} from "@/app/validationSchemas"
import {NextSeo} from "next-seo"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"

type Profile = {
	profile_type: "MAN" | "WOMAN" | "COUPLE"
	man?: {
		nickname?: string
		age?: number
	}
	woman?: {
		nickname?: string
		age?: number
	}
}

function WhoAreYou() {
	const {t} = useTranslation("site")
	const [profile, setProfile] = useState<UserProfilesInfoProfile | undefined>(
		undefined
	)
	const [profilesType, setProfilesType] = useState<string[]>([])
	const [validationType, setValidationType] = useState<any>()
	const [errorProfileType, setErrorProfileType] = useState<string>("")

	const formCoupleOptions = {
		resolver: yupResolver(validationEventCoupleStep1),
	}
	const formManOptions = {resolver: yupResolver(validationEventManStep1)}
	const formWomanOptions = {resolver: yupResolver(validationEventWomanStep1)}

	// router
	const router = useRouter()
	const {id} = router.query
	const {handleSubmit, watch, control, formState, setValue} =
		useForm(validationType)
	const {errors} = formState

	// redux
	const dispatch = useAppDispatch()

	const auth = useAuth()

	// redux state
	const anonSignUpData = useAppSelector((state) => state.anonEventSignUp)

	// rtk get user data
	const userProfilesData = useGetUserProfilesInfo()

	// rtk get event data
	const {data: anonGetEvent} = useAnonGetEventQuery({
		eventId: id,
	})

	useEffect(() => {
		if (auth && profilesType.length > 0) {
			if (profilesType.includes("COUPLE")) {
				setValue(
					"profile_type",
					profilesType.find((type) => type === "COUPLE")
				)
				return
			}
			setValue("profile_type", profilesType[0])
		}
	}, [profilesType])

	const profileType = watch("profile_type")

	const getValidation = () => {
		switch (profileType) {
			case "MAN":
				return setValidationType(formManOptions)
			case "WOMAN":
				return setValidationType(formWomanOptions)
			case "COUPLE":
				return setValidationType(formCoupleOptions)
		}
	}

	useEffect(() => {
		getValidation()
	}, [profileType])

	// const capitalizeFirstLetter = (string: string): string => {
	// 	return string.charAt(0).toUpperCase() + string.slice(1)
	// }

	useEffect(() => {
		if (profileType && auth && !profilesType.includes(profileType)) {
			setErrorProfileType(
				`You haven't ${profileType.toLowerCase()} profile type`
			)
		} else {
			setErrorProfileType("")
		}
	}, [profileType])

	const userProfiles = userProfilesData?.profiles || []
	const allowedProfileTypes = anonGetEvent?.profile_type || []
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
			title: t("site.Couple"),
			id: "profile_type.couple",
		},
	]

	const getDataWithOtherProfiles = (): UserProfilesInfoProfile => {
		const man = userProfiles.find((profile) =>
			["MAN"].includes(profile.profile_type)
		)
		const woman = userProfiles.find((profile) =>
			["WOMAN"].includes(profile.profile_type)
		)

		return {
			id: "0",
			couple_nickname: "",
			profile_type: "",
			man: {
				id: 0,
				nickname: man?.man?.nickname || "",
				age: man?.man?.age || 0,
			},
			woman: {
				id: 0,
				nickname: woman?.woman?.nickname || "",
				age: woman?.woman?.age || 0,
			},
		}
	}

	const checkProfileTypes = () => {
		const isCouple = userProfiles.find((profile) =>
			["COUPLE"].includes(profile.profile_type)
		)
		switch (profileType) {
			case "MAN":
				return setProfile(
					userProfiles.find((profile) =>
						["MAN"].includes(profile.profile_type)
					)
				)
			case "WOMAN":
				return setProfile(
					userProfiles.find((profile) =>
						["WOMAN"].includes(profile.profile_type)
					)
				)
			case "COUPLE":
				return setProfile(
					isCouple ? isCouple : getDataWithOtherProfiles()
				)
		}
	}

	const getProfilesType = () => {
		userProfiles.map((profile) =>
			setProfilesType((prevState) => [...prevState, profile.profile_type])
		)
	}

	useEffect(() => {
		if (
			(profilesType.includes("WOMAN") || profilesType.includes("MAN")) &&
			!profilesType.includes("COUPLE")
		) {
			setProfilesType((prevState) => [...prevState, "COUPLE"])
		}
	}, [profilesType])

	const setDataInValue = () => {
		setValue("nickname_man", profile?.man?.nickname || "")
		setValue("nickname_woman", profile?.woman?.nickname || "")
		setValue("age_man", profile?.man?.age || "")
		setValue("age_woman", profile?.woman?.age || "")
	}

	// effects
	useEffect(() => checkProfileTypes(), [profileType])

	useEffect(() => getProfilesType(), [userProfilesData])

	useEffect(() => setDataInValue(), [profile])

	// on form submit
	const onSubmit = (data: any) => {
		if (
			data.profile_type === undefined ||
			(auth && errorProfileType) ||
			Object.keys(errors).length !== 0
		)
			return
		if (auth) {
			dispatch(saveAnonUserId({userId: userProfilesData?.id}))
		}
		dispatch(saveAnonStep1(data))
		router.push(`/events/${id}/signup/2`).then((r) => r)
	}

	// when go back from page
	const handleStepBack = () => {
		router.push(`/events/${id}/`).then((r) => r)
	}

	return (
		<AppDefaultLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<NextSeo title={t("site.Step 1 Who are you")} />
			<div className={"WhoAreYouScreen"}>
				<div className={"GoBack"}>
					<TransparentButton
						icon={<GoBackIcon />}
						id={"transparent_button_go_back"}
						onClick={handleStepBack}
					/>
				</div>
				<div className={"Logotype"}>
					<Logotype />
				</div>
				<div className={"Guide"}>
					<p>
						{t("site.Already waiting to meet you at the party")}
						<br />
						{t("site.Until then tell us")}
					</p>
				</div>

				<div className="Form">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className={"Header"}>
							<p>
								{t("site.who are you")}
								<span>?</span>
							</p>
						</div>
						<div className={"ProfileType"}>
							<div className={"ProfileTypeContainer"}>
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
																id={profile.id}
																key={profile.id}
																field={field}
																// disabled={
																// 	auth &&
																// 	!profilesType.includes(
																// 		profile.value
																// 	)
																// }
															/>
														)
												)}
											</>
										)
									}}
									name={"profile_type"}
									control={control}
									// defaultValue={
									// 	allowedProfileTypes[
									// 		allowedProfileTypes.length - 1
									// 	]
									// }
								/>
							</div>
							<div className={"ErrorContainer"}>
								{errorProfileType && (
									<p className={"ErrorProfileType"}>
										{errorProfileType}
									</p>
								)}
							</div>
						</div>
						<Divider />
						{!!profileType &&
							(auth
								? profilesType.includes(profileType)
								: true) && (
								<>
									<div className={"Nickname"}>
										{(profileType === "WOMAN" ||
											profileType === "COUPLE") && (
											<Controller
												render={({field}) => (
													<InputText
														field={field}
														required={true}
														placeholder={t(
															"site.Nickname for a woman"
														)}
														type={"text"}
														id={"nickname_woman"}
														error={
															errors
																.nickname_woman
																?.message
														}
														disabled={
															profile?.woman
																?.nickname
																? true
																: false
														}
													/>
												)}
												name={"nickname_woman"}
												control={control}
												defaultValue={""}
											/>
										)}

										{(profileType === "MAN" ||
											profileType === "COUPLE") && (
											<Controller
												render={({field}) => (
													<InputText
														field={field}
														required={true}
														placeholder={t(
															"site.Nickname for a man"
														)}
														type={"text"}
														id={"nickname_man"}
														error={
															errors.nickname_man
																?.message
														}
														disabled={
															profile?.man
																?.nickname
																? true
																: false
														}
													/>
												)}
												name={"nickname_man"}
												control={control}
												defaultValue={""}
											/>
										)}
									</div>
									<div className={"Age"}>
										{(profileType === "WOMAN" ||
											profileType === "COUPLE") && (
											<Controller
												render={({field}) => (
													<InputText
														field={field}
														required={true}
														placeholder={t(
															"site.The age of the woman"
														)}
														type={"number"}
														id={"age_woman"}
														error={
															errors.age_woman
																?.message
														}
													/>
												)}
												name={"age_woman"}
												control={control}
												defaultValue={""}
											/>
										)}

										{(profileType === "MAN" ||
											profileType === "COUPLE") && (
											<Controller
												render={({field}) => (
													<InputText
														field={field}
														required={true}
														placeholder={t(
															"site.The age of the man"
														)}
														type={"number"}
														id={"age_man"}
														error={
															errors.age_man
																?.message
														}
													/>
												)}
												name={"age_man"}
												control={control}
												defaultValue={""}
											/>
										)}
									</div>
								</>
							)}
						<div className={"Actions"}>
							<Button
								type={"button"}
								fullWidth={true}
								mode={"submit"}
								id={"button.submit"}
								prevent={false}
								disabled={
									(auth && errorProfileType) ||
									Object.keys(errors).length !== 0
										? true
										: false
								}
							>
								<p className={"SubmitButtonText"}>
									{t("site.Let's go on")}
								</p>
							</Button>
						</div>
					</form>
				</div>
			</div>
		</AppDefaultLayout>
	)
}

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default WhoAreYou
