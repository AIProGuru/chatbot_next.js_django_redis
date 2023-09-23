import React, {useEffect, useMemo, useRef, useState} from "react"
import {useRouter} from "next/router"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
//import {TFunction} from "next-i18next"
import {TFunction, useTranslation} from "next-i18next"
import {Controller, useForm, useWatch} from "react-hook-form"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import Logotype from "@/components/ui/Header/Logotype"
import Section from "@/components/ui/SignUp/Section/Section"
import InputText from "@/components/ui/Forms/Inputs/Text/InputText"
import InputPassword from "@/components/ui/Forms/Inputs/Password/InputPassword"
import Button from "@/components/ui/Button/Button/Button"
import {connect} from "react-redux"
import {savePhoneNumber, saveSignUpData} from "@/redux/slices/SignUpSlice"
import InputCheckBox from "@/components/ui/Forms/Inputs/Checkbox/InputCheckBox"
import Link from "@/components/ui/Button/Link/Link"
import InputCode from "@/components/ui/Forms/Inputs/Code/InputCode"
import {userProfileActions} from "@/redux/actions/userProfileActions"
import {useRegisterUserMutation} from "@/services/auth.service"
import {clearObject} from "@/app/utils"
import getConfig from "next/config"
// import InputRadioHorizontal from "@/components/ui/Forms/Inputs/RadioHorizontal/InputRadioHorizontal"
import {yupResolver} from "@hookform/resolvers/yup"
import {SignUpSchema} from "@/app/validation/SignUp.schema"
import {NextSeo} from "next-seo"
import InputPhoneNumber from "@/components/ui/Forms/Inputs/PhoneNumber/InputPhoneNumber"
import Head from "next/head"
import NoAuthLayout from "@/components/ui_app/AppLayouts/NoAuthLayout"
import ReCAPTCHA from "@llamalinknet/react-google-recaptcha"
// import parsePhoneNumber from "libphonenumber-js"
// import {
// 	SignUpValidationTypes,
// 	ValidateSignUpData,
// } from "@/services/common.service"
// import CleanLayout from "@/components/ui_app/AppLayouts/CleanLayout"

const {publicRuntimeConfig} = getConfig()

type FormData = {
	username: string
	email: string
	password: string
	password_confirmation: string
	// send_me_updates: boolean
	agreement: boolean
	phone_number?: string
	otp?: string
	notifications?: string
}

type Error = {
	field: string
	message: string
}

export type NotificationService = {
	id: string
	value: string
	title: string
}

type ErrorTranslations = {
	[x: string]: any
}

const getErrorTranslations = (t: TFunction): ErrorTranslations => {
	return {
		yup_signup_username_required: t("site.yup_signup_username_required"),
		yup_signup_username_startsWithSpace: t(
			"site.yup_signup_username_startsWithSpace"
		),
		yup_signup_username_noSpecialCharacters: t(
			"site.yup_signup_username_noSpecialCharacters"
		),
		yup_signup_username_already_exist: t(
			"site.yup_signup_username_already_exist"
		),
		yup_signup_email_required: t("site.yup_signup_email_required"),
		yup_signup_email_must_be_email: t(
			"site.yup_signup_email_must_be_email"
		),
		yup_signup_email_already_exist: t(
			"site.yup_signup_email_already_exist"
		),
		yup_password_required: t("site.yup_signup_password_required"),
		yup_password_confirmation_required: t(
			"site.yup_signup_password_confirmation_required"
		),
		yup_password_confirmation_not_match: t(
			"site.yup_signup_password_confirmation_not_match"
		),
		yup_password_lowercase: t("site.yup_signup_password_lowercase"),
		yup_password_uppercase: t("site.yup_signup_password_uppercase"),
		yup_password_digit: t("site.yup_signup_password_digit"),
		yup_password_length: t("site.yup_signup_password_length"),
		yup_signup_phone_number_valid: t("site.yup_signup_phone_number_valid"),
		yup_signup_phone_already_exist: t(
			"site.yup_signup_phone_already_exist"
		),
		yup_signup_agreement_required: t("site.yup_signup_agreement_required"),
		notification_service_not_selected: t(
			"site.notification_service_not_selected"
		),
		wrong_otp: t("site.wrong_otp"),
	}
}

function AuthSignUpIndexPage(props: any) {
	// props
	const {signUpData, saveSignUpData, sendOTPPhone} = props
	const router = useRouter()
	const {t} = useTranslation("site")
	const captchaKey = publicRuntimeConfig?.captchaClientKey || ""
	const baseUrl = publicRuntimeConfig?.baseUrl || ""
	const errorTranslations = useMemo(() => {
		return getErrorTranslations(t)
	}, [t])

	// state
	const recaptchaRef = useRef<any>(null)
	const [errors, setErrors] = useState<Error[]>([])
	const [allowSubmit, setAllowSubmit] = useState(false)
	const [fillOTP, setFillOTP] = useState(false)
	const [captcha, setCaptcha] = useState<string | undefined>(undefined)
	const [formData, setFormData] = useState<any>()
	const [otpError, setOTPError] = useState<boolean>(false)
	const [notificationsError, setNotificationsError] = useState<boolean>(false)
	const [captchaReady, setCaptchaReady] = useState(false)
	const [captchaError, setCaptchaError] = useState(false)
	const [disabledBtn, setDisabledBtn] = useState(false)
	const [serverError, setServerError] = useState<string>("")
	const [phoneNumberError, setPhoneNumberError] = useState<
		string | undefined
	>(undefined)

	// react hook form
	const {
		handleSubmit,
		control,
		watch,
		setValue,
		reset,
		register,
		formState,
		trigger,
	} = useForm<FormData>({
		resolver: yupResolver(SignUpSchema),
		mode: "all",
		// reValidateMode: "onChange",
	})
	const agreementWatch = useWatch({
		control,
		name: "agreement",
	})

	// rtk
	const [registerUser] = useRegisterUserMutation()

	const watcher: FormData = {
		username: useWatch({control, name: "username"}),
		email: useWatch({control, name: "email"}),
		password: useWatch({control, name: "password"}),
		password_confirmation: useWatch({
			control,
			name: "password_confirmation",
		}),
		agreement: useWatch({control, name: "agreement"}),
		phone_number: useWatch({control, name: "phone_number"}),
		otp: useWatch({control, name: "otp"}),
		notifications: useWatch({control, name: "notifications"}),
	}

	const notificationServices: NotificationService[] = [
		{
			id: "SMS",
			value: "SMS",
			title: "SMS", // locale here
		},
		{
			id: "WhatsAPP",
			value: "WhatsAPP",
			title: "WhatsApp", // locale here
		},
	]

	//set recaptcha settings and after that make the captcha ready
	useEffect(() => {
		window.recaptchaOptions = {
			useRecaptchaNet: true,
			enterprise: true,
		}

		setCaptchaReady(true)
	})

	useEffect(() => {
		if (agreementWatch) {
			setAllowSubmit(true)
		} else {
			setAllowSubmit(false)
		}
	}, [agreementWatch])

	function sendOTPSubmit(data: FormData) {
		// setTimeout(() => {
		if (!data.phone_number || fillOTP) return
		// if (!data.notifications) return

		// todo: send otp code here
		sendOTPPhone(data.phone_number.split(" ").join(""), "SMS")
			.then((l: any) => {
				setDisabledBtn(false)
				setFillOTP(true)
			})
			.catch((err: any) => {
				setDisabledBtn(false)
				console.log("SendOTPPhone Error: ", err)
			})
		// }, 300);
	}

	// on go back
	function onGoBackClick() {
		router.push(`/auth/signin`).then()
	}

	// on form submit
	async function onFormSubmit(data: FormData) {
		if (phoneNumberError) {
			setDisabledBtn(false)
			return
		}
		// setErrors([])
		setDisabledBtn(true)
		setOTPError(false)
		// setNotificationsError(false)
		console.log("signup", data)

		// return

		// todo: move validation to yup, this is just for demo
		// if (
		// 	!data.password ||
		// 	!data.password_confirmation ||
		// 	!data.username ||
		// 	!data.email
		// )
		// 	return

		// if (data.password !== data.password_confirmation) {
		// 	const error: Error = {
		// 		field: "password",
		// 		message: "Passwords does not match",
		// 	}
		// 	setErrors((prevState) => [...prevState, error])
		// 	return
		// }

		if (data.phone_number) {
			// if (!data.notifications) {
			// 	setNotificationsError(true)
			// 	return
			// }
			sendOTPSubmit(data)
		}

		if (data.phone_number && (!data.otp || data.otp.length < 6)) return

		if (recaptchaRef && recaptchaRef.current) {
			recaptchaRef.current.execute()
		}
		setFormData(data)

		return
	}

	useEffect(() => {
		if (!captcha) return
		if (Object.keys(formState.errors).length) {
			setDisabledBtn(false)
			return
		}
		setServerError("")
		if (formData) {
			const userData = clearObject({
				username: formData.username,
				password: formData.password,
				confirmPassword: formData.password,
				email: formData.email,
				// send_me_updates: formData.send_me_updates,
				phone:
					(formData.phone_number &&
						formData.phone_number.split(" ").join("")) ||
					null,
				otp: formData.otp || null,
				recaptcha_value: captcha,
			})

			registerUser({
				formData: userData,
			})
				.unwrap()
				.then((r) => {
					setDisabledBtn(false)
					router.push(`/auth/signup/email/confirm`).then(() => {
						reset()
					})
				})
				.catch((e: any) => {
					console.log(e, e.data)
					setDisabledBtn(false)
					setServerError(e.data.message)
					// if (e && e.data && e.data.code === "keycloak_error") {
					// 	alert("User or email already registered")
					// } else if (
					// 	e &&
					// 	e.data &&
					// 	e.data.code === "register_error"
					// ) {
					// 	// alert("Wrong otp")
					// 	setOTPError(true)
					// } else {
					// 	alert("Something went wrong while saving user data")
					// }
				})
		}
	}, [formData, registerUser, reset, router, captcha])

	const schemaDataWebPage = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: t("site.homepage"),
				item: `${baseUrl}/${t("site.en")}/`,
			},

			{
				"@type": "ListItem",
				position: 2,
				name: t("site.Sign up for the Swingers World"),
				item: `${baseUrl}/${t("site.en")}/auth/signup`,
			},
		],

		"@graph": [
			{
				"@type": "Organization",
				"@id": `${baseUrl}#organization`,
				name: t("site.Swingers exchange couples"),
				url: `${baseUrl}`,
				email: "webmaster@swingers.co.il",
				description: t(
					"site.Enter the world of swingers the world of fantasies"
				),
				logo: {
					"@type": "ImageObject",
					url: `${baseUrl}/seo.jpg`,
					width: "217",
					height: "49",
				},
				contactPoint: {
					"@type": "ContactPoint",
					contactType: "customer support",
					telephone: "+972 50-534-5050",
					email: "webmaster@swingers.co.il",
				},
			},

			{
				"@type": "WebSite",
				"@id": `${baseUrl}/#website`,
				url: `${baseUrl}`,
				name: t("site.Swingers exchange couples"),
				inLanguage: t("site.en_US"),
				publisher: {"@id": `${baseUrl}/#organization`},
			},

			{
				"@type": "WebPage",
				"@id": `${baseUrl}/${t("site.en")}/auth/signup/#webpage`,

				isPartOf: {"@id": `${baseUrl}/#website`},
				url: `${baseUrl}/${t("site.en")}/auth/signup/`,
				name: t("site.Sign up for Swingers World"),
				description: t(
					"site.Sign up for the Swingers website the world of fantasies"
				),
			},

			{
				"@type": "RegisterAction",
				"@id": `${baseUrl}/${t("site.en")}/auth/signup/#RegisterAction`,
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": `${baseUrl}/${t("site.en")}/auth/signup/#webpage`,
				},
				image: [
					{
						"@type": "ImageObject",
						url: `${baseUrl}/seo.jpg`,
						height: "217",
						width: "49",
						caption: "Swingers logo",
					},
					{
						"@type": "ImageObject",
						url: `${baseUrl}/favicon.ico`,
						height: "217",
						width: "49",
						caption: "Swingers favicon",
					},
				],
			},
		],
	}

	return (
		<NoAuthLayout useTabBar={false} fullHeight={true}>
			<NextSeo
				title={t("site.Sign up")}
				description={t(
					"site.Sign up for the Swingers website the world of fantasies"
				)}
				openGraph={{
					type: "website",
					url: `${baseUrl}/${t("site.en")}/auth/signup`,
					title: t("site.Sign up"),
					description: t(
						"site.Sign up for the Swingers website the world of fantasies"
					),
				}}
			/>
			<Head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(schemaDataWebPage),
					}}
				/>
			</Head>
			<div className="SignUpPageContainer">
				<div className="Step4">
					<div className="GoBack">
						<TransparentButton
							icon={<GoBackIcon />}
							onClick={onGoBackClick}
						/>
					</div>
					<div className="WelcomeLogotype">
						<Logotype size={"signup"} />
					</div>

					<form
						onSubmit={(e) => {
							e.preventDefault()
							setDisabledBtn(true)
							trigger().then(() => {
								if (
									(!watcher.otp && fillOTP) ||
									!!(
										watcher.otp &&
										watcher.otp.length < 6 &&
										fillOTP
									)
								) {
									setDisabledBtn(false)
									return
								}
								onFormSubmit(watcher)
							})
						}}
					>
						<ReCAPTCHA
							ref={recaptchaRef}
							sitekey={captchaKey}
							size="invisible"
							onChange={() => {
								setCaptcha(recaptchaRef.current.getValue())
							}}
							action={"login"}
							onError={() => {
								setCaptchaError(true)
							}}
						/>

						{captchaError && (
							<div className="SignUpErrorMessage">
								<p>Captcha error... Try again</p>
							</div>
						)}

						{captchaReady && (
							<>
								<Section
									title={t(
										"site.Some short and concluding details"
									)}
									padding={"small"}
								>
									<div className="UsernameSection">
										<Controller
											render={({field, fieldState}) => (
												<InputText
													field={field}
													placeholder={t(
														"site.Nickname this will be your name on the site"
													)}
													maxLength={25}
													required={true}
													autoComplete={"off"}
													spellCheck={false}
													showOKIcon={true}
													// error={
													// 	"this is kinda error example"
													// }
													error={
														fieldState.error
															?.message &&
														errorTranslations[
															fieldState.error
																?.message
														]
													}
												/>
											)}
											name={"username"}
											control={control}
											defaultValue={
												signUpData.username || ""
											}
										/>
										<p className={"Info"}>
											{t(
												"site.Enter a nickname with no special characters"
											)}{" "}
										</p>
									</div>
								</Section>

								<Section>
									<div className="EmailPasswordSection">
										<div className="Input">
											<Controller
												render={({
													field,
													fieldState,
												}) => (
													<InputText
														field={field}
														placeholder={t(
															"site.Email_addr"
														)}
														required={true}
														autoComplete={"off"}
														spellCheck={false}
														showOKIcon={true}
														type={"email"}
														error={
															fieldState.error
																?.message &&
															errorTranslations[
																fieldState.error
																	?.message
															]
														}
													/>
												)}
												name={"email"}
												control={control}
												defaultValue={
													signUpData.email || ""
												}
											/>
										</div>
										<div className="Input">
											<div className="Field">
												<Controller
													render={({
														field,
														fieldState,
													}) => (
														<InputPassword
															field={field}
															placeholder={t(
																"site.password"
															)}
															required={true}
															autoComplete={
																"new-password"
															}
															spellCheck={false}
															showOKIcon={true}
															// error={
															// 	"this is kinda error example"
															// }
															// error={
															// 	errors.find(
															// 		(s) =>
															// 			s.field ===
															// 			"password"
															// 	)?.message || undefined
															// }
															error={
																fieldState.error
																	?.message &&
																errorTranslations[
																	fieldState
																		.error
																		?.message
																]
															}
														/>
													)}
													name={"password"}
													control={control}
													defaultValue={
														signUpData.password ||
														""
													}
												/>
											</div>
											<div className="Help">
												<p>
													{t(
														"site.Enter a password of at least 6 digits"
													)}
												</p>
												<p>
													{t(
														"site.The password must include at least one digit and one character"
													)}
												</p>
												<p>
													{t(
														"site.The password must include at least one uppercase letter and one lowercase letter"
													)}
												</p>
											</div>
											<div className="Field">
												<Controller
													render={({
														field,
														fieldState,
													}) => (
														<InputPassword
															field={field}
															required={true}
															autoComplete={
																"new-password"
															}
															spellCheck={false}
															placeholder={t(
																"site.Type the password again"
															)}
															// error={
															// 	errors.find(
															// 		(s) =>
															// 			s.field ===
															// 			"password"
															// 	)?.message || undefined
															// }
															showOKIcon={true}
															error={
																fieldState.error
																	?.message &&
																errorTranslations[
																	fieldState
																		.error
																		?.message
																]
															}
														/>
													)}
													name={
														"password_confirmation"
													}
													control={control}
													defaultValue={
														signUpData.password ||
														""
													}
												/>
											</div>

											{fillOTP ? (
												<div className="OTPSection">
													<p className="Where">
														{t(
															"site.Enter the code you received for the number"
														)}{" "}
														<br />
														<span dir={"auto"}>
															{
																watcher.phone_number
															}
														</span>
													</p>
													<div className="Input">
														<Controller
															render={({
																field,
															}) => (
																<InputCode
																	codeLength={
																		6
																	}
																	field={
																		field
																	}
																	id={
																		"input_otp_code"
																	}
																	error={
																		(otpError &&
																			errorTranslations.wrong_otp) ||
																		undefined
																	}
																/>
															)}
															name={"otp"}
															control={control}
															defaultValue={""}
														/>
													</div>
													<Link
														styled={true}
														onClick={() => {
															setFillOTP(false)
															setValue("otp", "")
															setValue(
																"phone_number",
																""
															)
														}}
													>
														{t(
															"site.I was wrong in the number"
														)}
													</Link>
												</div>
											) : (
												<>
													<div className="PhoneSection">
														<p className="Why">
															{t(
																"site.Want to log in next time easily and without remembering a password"
															)}
															?
														</p>
														<div className="Input">
															<InputPhoneNumber
																name={
																	"phone_number"
																}
																register={
																	register
																}
																setValue={
																	setValue
																}
																error={
																	// formState
																	// 	.errors
																	// 	.phone_number
																	// 	?.message &&
																	// errorTranslations[
																	// 	formState
																	// 		.errors
																	// 		.phone_number
																	// 		.message
																	// ]
																	phoneNumberError &&
																	errorTranslations[
																		phoneNumberError
																	]
																}
																phoneNumberError={
																	phoneNumberError
																}
																setPhoneNumberError={
																	setPhoneNumberError
																}
															/>

															<p
																className={
																	"Info"
																}
															>
																{t(
																	"site.Do not worry no one will see it it will only allow you to log in easily next time with your mobile number"
																)}
																.
															</p>
														</div>
													</div>
													{/*{phone_number &&*/}
													{/*	phone_number?.length > 0 && (*/}
													{/* {phone_number &&
														phone_number?.length >
															5 && (
															<div className="Notifications">
																<p
																	className={
																		"SelectService"
																	}
																>
																	Please
																	select the
																	service you
																	would like
																	us to send
																	you a
																	message with
																	a code in
																</p>
																<Controller
																	render={({
																		field,
																	}) => (
																		<>
																			{notificationServices &&
																				notificationServices.map(
																					(
																						service
																					) => {
																						return (
																							<InputRadioHorizontal
																								key={
																									service.id
																								}
																								value={
																									service.value
																								}
																								field={
																									field
																								}
																								id={
																									"input_radio_service_select_" +
																									service.id
																								}
																								title={
																									service.title
																								}
																							/>
																						)
																					}
																				)}
																			{notificationsError && (
																				<p
																					className={
																						"SignUpErrorMessage"
																					}
																				>
																					{
																						errorTranslations.notification_service_not_selected
																					}
																				</p>
																			)}
																		</>
																	)}
																	name={
																		"notifications"
																	}
																	control={
																		control
																	}
																	defaultValue={
																		""
																	}
																/>
															</div>
														)} */}
												</>
											)}

											{/*<div className="SendMeUpdates">*/}
											{/*	<Controller*/}
											{/*		render={({field}) => (*/}
											{/*			<InputCheckBox*/}
											{/*				field={field}*/}
											{/*				value={"send_updates"}*/}
											{/*				title={t(*/}
											{/*					"site.Send me updates on events and parties"*/}
											{/*				)}*/}
											{/*				id={*/}
											{/*					"input_checkbox_send_updates"*/}
											{/*				}*/}
											{/*			/>*/}
											{/*		)}*/}
											{/*		name={"send_me_updates"}*/}
											{/*		control={control}*/}
											{/*		defaultValue={false}*/}
											{/*	/>*/}
											{/*</div>*/}

											<div className="SendMeUpdates">
												<Controller
													render={({field}) => (
														<InputCheckBox
															field={field}
															value={"agreement"}
															title={t(
																"site.I approve"
															)}
															id={
																"input_checkbox_agreement"
															}
														/>
													)}
													name={"agreement"}
													control={control}
													defaultValue={false}
												/>
												{/* // styled={true}
													href={"/pages/privacy"}
													target={"_blank"}
													rel="noreferrer"
													// variant={"agreement"} */}
												{t(
													"site.The terms of use of the site"
												)}
											</div>
										</div>
									</div>
								</Section>

								{serverError && (
									<p className="Error">{serverError}</p>
								)}

								{/* actions */}
								<div className="Actions">
									{/* submit form */}
									<Button
										type={"button"}
										mode={"submit"}
										prevent={false}
										fullWidth={true}
										isLoading={disabledBtn}
										disabled={
											!allowSubmit ||
											(!watcher.otp && fillOTP) ||
											!!(
												watcher.otp &&
												watcher.otp.length < 6 &&
												fillOTP
											)
										}
									>
										<p className={"SubmitButtonText"}>
											{watcher.phone_number &&
											watcher.phone_number.split(" ")
												.length > 1 &&
											watcher.phone_number?.length > 0 &&
											!fillOTP
												? t("site.Send me a code")
												: `${t("site.lets start")}!`}
										</p>
									</Button>
								</div>
							</>
						)}
					</form>
				</div>
			</div>
		</NoAuthLayout>
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
})

const mapDispatchToProps = {
	saveSignUpData: saveSignUpData,
	savePhoneNumber: savePhoneNumber,
	sendOTPPhone: userProfileActions.sendOTPPhone,
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthSignUpIndexPage)
