import Button from "@/components/ui/Button/Button/Button"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import Logotype from "@/components/ui/Header/Logotype"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import SuccessRabbitIcon from "@/components/ui/Icons/SuccessRabbitIcon"
import {useRouter} from "next/router"
import {useTranslation} from "next-i18next"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import Section from "@/components/ui/SignUp/Section/Section"
import {Controller, useForm} from "react-hook-form"
import React, {useCallback, useEffect} from "react"
import {useSetCurrentProfileMutation} from "@/services/users.service"
import InputRadioHorizontal from "@/components/ui/Forms/Inputs/RadioHorizontal/InputRadioHorizontal"
import {NextSeo} from "next-seo"
import CleanLayout from "@/components/ui_app/AppLayouts/CleanLayout"
import PageLoader from "@/components/ui/Loader/PageLoader/PageLoader"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"

type FormData = {
	profile_select: string
}

function Select(props: any) {
	const {data, control, defaultValue} = props
	const {t} = useTranslation("site")
	function getProfileTitle(profile_type: string): string {
		switch (profile_type) {
			case "WOMAN":
				return t("site.Woman") // translate here

			case "MAN":
				return t("site.Man") // translate here

			case "COUPLE":
				return t("site.We are a couple") // translate here

			default:
				return "-"
		}
	}

	return (
		<Controller
			render={({field}) => (
				<>
					{data &&
						data.map((profile: any) => {
							return (
								<InputRadioHorizontal
									key={profile.id}
									value={profile.id}
									field={field}
									id={
										"input_radio_profile_select_" +
										profile.id
									}
									title={getProfileTitle(
										profile.profile_type
									)}
								/>
							)
						})}
				</>
			)}
			name={"profile_select"}
			control={control}
			defaultValue={defaultValue}
		/>
	)
}

function SignInSelectProfile(props: any) {
	const router = useRouter()
	const {t} = useTranslation("site")

	const {handleSubmit, control, reset, setValue} = useForm<FormData>()

	const [setCurrentProfile] = useSetCurrentProfileMutation({})
	const userProfilesData = useGetUserProfilesInfo()

	// useEffect(() => {
	// 	if (userProfilesData && userProfilesData.profiles) {
	// 		if (userProfilesData.profiles.length < 1) {
	// 			router.push(`/auth/signup/0/step/1`).then()
	// 		}
	// 	}
	// }, [userProfilesData])

	const onFormSubmit = useCallback((data: FormData) => {
		if (!data.profile_select) return

		setCurrentProfile({
			profileId: data.profile_select && data.profile_select,
		})
			.unwrap()
			.then((r: any) => {
				router.push("/").then(() => {
					// router.reload()
				})
			})
			.catch((e: any) => {
				console.log(e)
				if (e.message === "You do not have permission to perform this action.") {
					router.push("/profiles/my/subscriptions")
					return
				}
				alert("Something went wrong")
			})
			.finally(() => {
				reset()
			})
	}, [])

	// useEffect(() => {
	// 	if (userProfilesData && userProfilesData.profiles) {
	// 		if (userProfilesData.profiles.length === 1) {
	// 			onFormSubmit({
	// 				profile_select: userProfilesData.profiles[0].id,
	// 			})
	// 		}
	// 	}
	// }, [userProfilesData])

	// on go back
	function onGoBackClick() {
		router.push(`/`).then()
	}

	// useEffect(() => {
	// 	if (userProfilesData && userProfilesData.current_profile_id) {
	// 		setValue("profile_select", userProfilesData.current_profile_id)
	// 	}
	// }, [userProfilesData])

	// if (!userProfilesData) {
	// 	return <PageLoader />
	// }

	// if (
	// 	userProfilesData &&
	// 	userProfilesData.profiles &&
	// 	userProfilesData.profiles.length < 2
	// )
	// 	return null

	// if (!userProfilesData.current_profile_id) return null

	return (
		<CleanLayout useTabBar={false} fullHeight={true}>
			<NextSeo title={t("site.select a profile")} />
			<div className="SignUpPageContainer">
				<div className="StepSelectProfile">
					<div className="GoBack">
						<TransparentButton
							icon={<CloseIcon style={"light"} />}
							onClick={onGoBackClick}
						/>
					</div>
					<div className="WelcomeLogotype">
						<Logotype size={"signup"} />
					</div>
					<div className="SuccessRabbitContainer">
						<SuccessRabbitIcon size={"small"} />
						<p>
							{t(
								"site.Hot couple, you have successfully connected to the site"
							)}
							<br />
							{t(
								"site.We detected that you have 2 profiles under mobile email"
							)}
							<br />
						</p>
						<p>
							{t(
								"site.Which profile would you like to connect with"
							)}
						</p>
					</div>
					<form onSubmit={handleSubmit(onFormSubmit)}>
						<div className="ProfileSelect">
							<Section padding={"small"}>
								{userProfilesData.current_profile_id ? (
									<Select
										data={userProfilesData.profiles}
										control={control}
										defaultValue={
											userProfilesData.current_profile_id
										}
									/>
								) : (
									<Select
										data={userProfilesData.profiles}
										control={control}
										defaultValue={""}
									/>
								)}
							</Section>
						</div>
						<div className={"Actions"}>
							{/* submit form */}
							<div className="Button">
								<Button
									type={"button"}
									mode={"submit"}
									prevent={false}
									fullWidth={true}
									id={"button_go_fill_profile"}
									onClick={() => {}}
								>
									<p className={"SubmitButtonText"}>
										{t("site.Take me to the site")}
									</p>
								</Button>
							</div>
							<div className="Info">
								<p>
									{t(
										"site.You can switch between the profiles later as well"
									)}
								</p>
							</div>
						</div>
					</form>
				</div>
			</div>
		</CleanLayout>
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

SignInSelectProfile.requireAuth = true

export default SignInSelectProfile
