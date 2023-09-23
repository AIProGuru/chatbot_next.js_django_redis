import React, {useEffect, useMemo, useRef, useState} from "react"
import {useRouter} from "next/router"
import Button from "@/components/ui/Button/Button/Button"
import {useForm} from "react-hook-form"
import {validationSignInPhone} from "@/app/validationSchemas"
import {yupResolver} from "@hookform/resolvers/yup"
import {connect} from "react-redux"
import {userProfileActions} from "@/redux/actions/userProfileActions"
import {TFunction, useTranslation} from "next-i18next"
import {saveCaptcha} from "@/redux/slices/AuthSlice"
import InputPhoneNumber from "@/components/ui/Forms/Inputs/PhoneNumber/InputPhoneNumber"
import ReCAPTCHA from "@llamalinknet/react-google-recaptcha";


type ErrorTranslations = {
	[x: string]: any
}

const getErrorTranslations = (t: TFunction): ErrorTranslations => {
	return {
		yup_signup_phone_number_valid: "Please enter a valid phone number",
	}
}

function SignInPhone(props: any) {
	// props
	const {t} = useTranslation("site")
	const router = useRouter()
	const errorTranslations = useMemo(() => {
		return getErrorTranslations(t)
	}, [t])

	const {
		// signInPhone,
		// signInData,
		sendOTPPhone,
		otpStatus,
		captchaKey,
		saveCaptcha,
	} = props
	const {data: dataOTP} = otpStatus
	const {success: successOTP} = dataOTP || {}

	//explicitly set the types in order to make phone_number able to be an array index
	type FormData = {
		phone_number: string
		[x: string]: any
	}

	// react hook form
	const formOptions = {resolver: yupResolver(validationSignInPhone)}
	const {register, handleSubmit, formState, control, setValue} =
		useForm<FormData>(formOptions)

	// state
	const recaptchaRef = useRef<any>(null)
	const [captcha, setCaptcha] = useState<string | undefined>(undefined)
	const [captchaReady, setCaptchaReady] = useState(false)
	const [formData, setFormData] = useState<any>()
	const [loadingSignIn, setLoadingSignIn] = useState(false)
	const [disabledBtn, setDisabledBtn] = useState(false)

	//set recaptcha settings and after that make the captcha ready
	useEffect(() => {
		window.recaptchaOptions = {
			useRecaptchaNet: true,
			enterprise: true,
		};

		setCaptchaReady(true)
	})

	// on form submit
	const onSubmit = (data: any) => {
		// if (disabledBtn) return
		if (!captchaReady) return
		//
		setLoadingSignIn(true)
		recaptchaRef.current.execute()
		setFormData(data)
	}

	useEffect(() => {
		// if (captcha) {
		if (!captcha) return

		if (formData) {
			sendOTPPhone(formData.phone_number.split(" ").join(""))
				.then((l: any) =>
					router
						.push(
							`/auth/signin/${formData.phone_number
								.split(" ")
								.join("")}/`
						)
						.then(() => {
							// setDisabledBtn(false)
							setLoadingSignIn(false)
							saveCaptcha({captcha: captcha})
						})
				)
				.catch((err: any) => {
					console.log("SendOTPPhone Error: ", err)
					// setDisabledBtn(false)
					setLoadingSignIn(false)
				})
		}
		// }
	}, [formData, router, sendOTPPhone, captcha])

	const onError = (errors: any, e: any) => console.log(errors, e)

	return (
		<div className={"TabPanelContainer"}>
			<form onSubmit={handleSubmit(onSubmit, onError)}>
				<ReCAPTCHA
						ref={recaptchaRef}
						sitekey={captchaKey}
						size="invisible"
						onChange={() => {
							setCaptcha(recaptchaRef.current.getValue())
						}}
						action={"login"}
					/>
				
				<div className="Input">
					<InputPhoneNumber
						name={"phone_number"}
						register={register}
						setValue={setValue}
						// defaultCountry={"il"}
						// onlyCountries={["il", "ua", "us"]}
						// preferredCountries={["il"]}
						error={
							formState.errors.phone_number?.message &&
							errorTranslations[
								formState.errors.phone_number.message
							]
						}
					/>

					{/*<Controller*/}
					{/*	render={({field}) => {*/}
					{/*		return (*/}
					{/*			<InputText*/}
					{/*				field={field}*/}
					{/*				placeholder={t("site.Phone Number")}*/}
					{/*				id={"phone"}*/}
					{/*				type={"number"}*/}
					{/*			/>*/}
					{/*		)*/}
					{/*	}}*/}
					{/*	name={"phone"}*/}
					{/*	control={control}*/}
					{/*	defaultValue={""}*/}
					{/*/>*/}
				</div>
				<div className="Button">
					<Button
						type={"button"}
						prevent={false}
						mode={"submit"}
						fullWidth={true}
						isLoading={loadingSignIn}
						disabled={!captchaReady}
					>
						<p className="SubmitButtonText">
							{t("site.Send me a code")}
						</p>
					</Button>
				</div>
			</form>
		</div>
	)
}

const mapStateToProps = (state: any) => ({
	signInData: state.signInData,
	otpStatus: state.otpStatus,
})

const mapDispatchToProps = {
	signInPhone: userProfileActions.signInPhone,
	sendOTPPhone: userProfileActions.sendOTPPhone,
	saveCaptcha: saveCaptcha,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInPhone)
