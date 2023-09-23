import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import React, {useEffect} from "react"
import {useRouter} from "next/router"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import {Controller, useForm} from "react-hook-form"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import Logotype from "@/components/ui/Header/Logotype"
import Section from "@/components/ui/SignUp/Section/Section"
import Button from "@/components/ui/Button/Button/Button"
import {connect} from "react-redux"
import {savePhoneNumber, saveSignUpData} from "@/redux/slices/SignUpSlice"
import Link from "@/components/ui/Button/Link/Link"
import InputCode from "@/components/ui/Forms/Inputs/Code/InputCode"
// import {userProfileActions} from "@/redux/actions/userProfileActions"
import {clearObject} from "@/app/utils"
import {useRegisterUserMutation} from "@/redux/services"

type FormData = {
	otp: string
}

function SignUpPhoneOTP(props: any) {
	const {t} = useTranslation("site")

	// basic props
	const {
		signUpData,
		saveSignUpData,
		savePhoneNumber,

		// registerUser, registerUserData
	} = props
	// const {saving, success, error, data} = registerUserData
	const router = useRouter()
	const [registerUser] = useRegisterUserMutation()

	// react hook form
	const {handleSubmit, control, watch, setValue} = useForm<FormData>()

	useEffect(() => {
		if (signUpData.step < 2) {
			router.push(`/auth/signup`).then()
		}
	}, [router, signUpData.step])

	// on form submit
	function onFormSubmit(data: FormData) {
		if (!data.otp) return
		if (data.otp.length < 6) return

		// todo: register user here
		const userData = clearObject({
			username: signUpData.username,
			password: signUpData.password,
			confirmPassword: signUpData.password,
			email: signUpData.email,
			send_me_updates: saveSignUpData.send_me_updates,
			phone: signUpData.phone,
			otp: data.otp,
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

					savePhoneNumber({
						phone: "",
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

	function wrongPhoneNumberLinkClick() {
		router.push(`/auth/signup/phone`).then()
	}

	// on go back
	function onGoBackClick() {
		router.push(`/auth/signup/phone`).then()
	}

	if (signUpData.step < 2) return null

	return (
		<AppDefaultLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<div className="SignUpPhoneOTPContainer">
				<div className="StepOTPCode">
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
							<div className="OTPSection">
								<p className="Where">
									{t(
										"site.Enter the code you received for the number"
									)}{" "}
									{signUpData.phone}
								</p>
								<div className="Input">
									<Controller
										render={({field}) => (
											<InputCode
												codeLength={6}
												field={field}
												id={"input_otp_code"}
											/>
										)}
										name={"otp"}
										control={control}
										defaultValue={""}
									/>
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
									{t("site.lets start")}
								</p>
							</Button>
							<Link
								styled={true}
								onClick={wrongPhoneNumberLinkClick}
							>
								{t("site.I was wrong in the number")}
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
	// registerUserData: state.registerUserData,
})

const mapDispatchToProps = {
	saveSignUpData: saveSignUpData,
	savePhoneNumber: savePhoneNumber,
	// registerUser: userProfileActions.registerUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPhoneOTP)
