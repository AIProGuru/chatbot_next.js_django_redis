import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import React, {useEffect, useMemo} from "react"
import {useRouter} from "next/router"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {TFunction, useTranslation} from "next-i18next"
import {Controller, useForm} from "react-hook-form"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import Logotype from "@/components/ui/Header/Logotype"
import Section from "@/components/ui/SignUp/Section/Section"
import InputText from "@/components/ui/Forms/Inputs/Text/InputText"
import Button from "@/components/ui/Button/Button/Button"
import {connect} from "react-redux"
import {savePhoneNumber, saveSignUpData} from "@/redux/slices/SignUpSlice"
import Link from "@/components/ui/Button/Link/Link"
import {userProfileActions} from "@/redux/actions/userProfileActions"
import {clearObject} from "@/app/utils"
import {useRegisterUserMutation} from "@/redux/services"
import InputPhoneNumber from "@/components/ui/Forms/Inputs/PhoneNumber/InputPhoneNumber"

type FormData = {
	phone_number: string
}

type ErrorTranslations = {
	[x: string]: any
}

const getErrorTranslations = (t: TFunction): ErrorTranslations => {
	return {
		yup_signup_phone_number_valid: "Please enter a valid phone number",
	}
}

function SignUpAddPhonePage(props: any) {
	const {t} = useTranslation("site")

	// basic props
	const {
		signUpData,
		saveSignUpData,
		savePhoneNumber,
		otpStatus,
		sendOTPPhone,
		// registerUser,
		// registerUserData,
	} = props
	// const {saving, success, error, data} = registerUserData
	const router = useRouter()
	const errorTranslations = useMemo(() => {
		return getErrorTranslations(t)
	}, [t])

	const [registerUser] = useRegisterUserMutation()

	// react hook form
	const {handleSubmit, control, watch, setValue, register, formState} =
		useForm<FormData>()

	useEffect(() => {
		if (signUpData.step < 1) {
			router.push(`/auth/signup`).then()
		}
	}, [router, signUpData.step])

	// on form submit
	function onFormSubmit(data: FormData) {
		if (!data.phone_number) return

		savePhoneNumber({
			phone: data.phone_number,
		})

		// todo: send otp code here
		sendOTPPhone(data.phone_number)

		router.push(`/auth/signup/phone/confirm`).then()
	}

	function skipEnterPhoneNumber() {
		// todo: register user here
		const userData = clearObject({
			username: signUpData.username,
			password: signUpData.password,
			confirmPassword: signUpData.password,
			email: signUpData.email,
			send_me_updates: signUpData.send_me_updates,
		})

		// registerUser(userData)
		registerUser({
			formData: userData,
		})
			.unwrap()
			.then((r) => {
				router.push(`/auth/signup/email/confirm`).then(() => {
					saveSignUpData({
						userData: {
							username: "",
							password: "",
							email: "",
							send_me_updates: "",
						},
					})
				})
			})
			.catch((e: any) => {
				console.log(e, e.data)
				if (
					e &&
					e.data &&
					e.data.message &&
					e.data.message.errorMessage
				) {
					alert(e.data.message.errorMessage)
				} else {
					alert("Something went wrong while saving user data")
				}
			})
	}

	// useEffect(() => {
	// 	if (success) {
	// 		router.push(`/auth/signup/email/confirm`)
	// 	}
	// }, [router, success])

	// on go back
	function onGoBackClick() {
		router.push(`/auth/signup`).then()
	}

	if (signUpData.step < 1) return null

	return (
		<AppDefaultLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<div className="SignUpAddPhonePageContainer">
				<div className="StepPhone">
					<div className="GoBack">
						<TransparentButton
							icon={<GoBackIcon />}
							onClick={onGoBackClick}
						/>
					</div>
					<div className="WelcomeLogotype">
						<Logotype size={"signup"} />
					</div>

					<form onSubmit={handleSubmit(onFormSubmit)}>
						<Section padding={"small"}>
							<div className="PhoneSection">
								<p className="Why">
									{t(
										"site.Want to log in next time easily and without remembering a password"
									)}
									?
								</p>
								<div className="Input">
									<InputPhoneNumber
										name={"phone_number"}
										register={register}
										setValue={setValue}
										defaultCountry={"il"}
										onlyCountries={["il", "ua", "us"]}
										preferredCountries={["il"]}
										error={
											formState.errors.phone_number
												?.message &&
											errorTranslations[
												formState.errors.phone_number
													.message
											]
										}
									/>
									{/*<Controller*/}
									{/*	render={({field}) => (*/}
									{/*		<InputText*/}
									{/*			field={field}*/}
									{/*			placeholder={t(*/}
									{/*				"site.Enter a mobile number"*/}
									{/*			)}*/}
									{/*			autoComplete={false}*/}
									{/*			spellCheck={false}*/}
									{/*		/>*/}
									{/*	)}*/}
									{/*	name={"phone_number"}*/}
									{/*	control={control}*/}
									{/*	defaultValue={signUpData.phone || ""}*/}
									{/*/>*/}
									<p className={"Info"}>
										{t(
											"site.Do not worry no one will see it it will only allow you to log in easily next time with your mobile number"
										)}
										.
									</p>
								</div>
							</div>
						</Section>

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
									{t("site.Send me a code")}
								</p>
							</Button>
							<Link styled={true} onClick={skipEnterPhoneNumber}>
								{t("site.Prefer not to add mobile")}
							</Link>
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

// export default AuthSignUpIndexPage
const mapStateToProps = (state: any) => ({
	signUpData: state.SignUpSlice,
	otpStatus: state.otpStatus,
	// registerUserData: state.registerUserData,
})

const mapDispatchToProps = {
	saveSignUpData: saveSignUpData,
	savePhoneNumber: savePhoneNumber,
	sendOTPPhone: userProfileActions.sendOTPPhone,
	// registerUser: userProfileActions.registerUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpAddPhonePage)
