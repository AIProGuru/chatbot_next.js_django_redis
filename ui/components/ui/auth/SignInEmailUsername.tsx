import React, {useEffect, useRef, useState} from "react"
import {useRouter} from "next/router"
import InputText from "@/components/ui/Forms/Inputs/Text/InputText"
import Link from "@/components/ui/Button/Link/Link"
import Button from "@/components/ui/Button/Button/Button"
import {Controller, useForm} from "react-hook-form"
import {validationSignInEmailUsername} from "@/app/validationSchemas"
import {yupResolver} from "@hookform/resolvers/yup"
import {connect, useDispatch} from "react-redux"
import {userProfileActions} from "@/redux/actions/userProfileActions"
import {loginUser} from "@/app/utils"
import InputPassword from "../Forms/Inputs/Password/InputPassword"
import {useTranslation} from "next-i18next"
import {useSignInMutation} from "@/redux/services"
import {
	SendLocationProps,
	useLazyGetUserProfilesInfoQuery,
	useSendLocationMutation,
} from "@/services/users.service"
import axiosInstance from "@/app/axiosInstance"
import useGeoLocation from "@/components/ui/Functions/Hooks/GetLocation"
import ReCAPTCHA from "@llamalinknet/react-google-recaptcha";

function SignInEmailUsername(props: any) {
	const {t} = useTranslation("site")
	const router = useRouter()
	const [showPass, setShowPass] = useState(false)

	const {
		// signIn,
		// signInData,
		captchaKey,
	} = props

	// const {saving, success, error, data} = signInData
	const [signInMutation] = useSignInMutation()

	// console.log("err", error)

	const formOptions = {resolver: yupResolver(validationSignInEmailUsername)}
	const {watch, register, handleSubmit, formState, control} =
		useForm(formOptions)
	// const {errors} = formState
	const dispatch = useDispatch()
	const recaptchaRef = useRef<any>(null)
	const [captcha, setCaptcha] = useState<string | undefined>(undefined)
	const [captchaReady, setCaptchaReady] = useState(false)
	const [formData, setFormData] = useState<any>()
	const [error, setError] = useState<string | undefined>(undefined)
	const [loadingSignIn, setLoadingSignIn] = useState(false)
	const [loginData, setLoginData] = useState({})

	const [getUserProfilesInfoQuery, userProfilesInfo] =
		useLazyGetUserProfilesInfoQuery()

	const onSubmit = (data: any) => {
		if (!captchaReady) return
		
		recaptchaRef.current.execute()
		setFormData(data)
		// signIn(data)
		// setSubmit(true)
	}

	//set recaptcha settings and after that make the captcha ready
	useEffect(() => {
		window.recaptchaOptions = {
			useRecaptchaNet: true,
			enterprise: true,
		};

		setCaptchaReady(true)
	})
	

	useEffect(() => {
		setError(undefined)
		if (!captcha) return

		if (formData) {
			setLoadingSignIn(true)
			console.log(captcha)
			signInMutation({
				username: formData.usernameEmail,
				password: formData.password,
				recaptchaValue: captcha,
			})
				.unwrap()
				.then((r) => {
					axiosInstance.defaults.headers.common["Authorization"] =
						r.access_token
					if (selfLocation?.lat && selfLocation?.lon) {
						sendLocationToServer(selfLocation)
					}
					getUserProfilesInfoQuery({})
					setLoginData(r)
				})
				.catch((e) => {
					console.log("signin error", e)
					setLoadingSignIn(false)
					if (e && e.data && e.data.code) {
						setError(e.data.code)
					}
				})
			// .finally(() => {
			// 	setLoadingSignIn(false)
			// })
		}
	}, [formData, captcha])

	const onError = (errors: any, e: any) => console.log(errors, e)

	const [selfLocation, setSelfLocation] = useState({lat: 0, lon: 0})

	const [sendLocation] = useSendLocationMutation()

	const location = useGeoLocation()

	const sendLocationToServer = (coordinates: SendLocationProps) => {
		if (!coordinates) return
		sendLocation(coordinates)
			.then((res) => {
				console.log("Location saved: ", res)
			})
			.catch((err) => {
				console.log("Location error: ", err)
			})
	}
 
	useEffect(() => {
		if (
			location.loaded &&
			location.coordinates &&
			location.coordinates.lat &&
			location.coordinates.lon
		) {
			setSelfLocation(location.coordinates)
			return
		}
	}, [location])

	useEffect(() => {
		if (
			userProfilesInfo &&
			userProfilesInfo.isSuccess &&
			userProfilesInfo.data
		)
			loginUser(
				loginData,
				dispatch,
				router,
				userProfilesInfo.data,
				setLoadingSignIn
			)
	}, [userProfilesInfo])

	return (
		<div className={"TabPanelContainer"}>
			<form onSubmit={handleSubmit(onSubmit, onError)}>
				{/* <Reaptcha
					// ref={e => (recaptchaRef = e)}
					ref={recaptchaRef}
					sitekey={captchaKey}
					size="invisible"
					enterprise={true}
					onVerify={(response) => {
						// console.log("captcha", response)
						setCaptcha(response)
					}}
					action={"login"}
					onRender={() => {
						setCaptchaReady(true)
					}}
				/> */}
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
					<Controller
						render={({field}) => {
							return (
								<InputText
									field={field}
									placeholder={t("site.Email Nickname")}
									id={"user-text-field"}
									autoComplete={"username"}
								/>
							)
						}}
						name={"usernameEmail"}
						control={control}
						defaultValue={""}
					/>
				</div>
				<div className="Input">
					<Controller
						render={({field}) => {
							return (
								<InputPassword
									field={field}
									placeholder={t("site.password")}
									id={"password-text-field"}
									showPass={showPass}
									setShowPass={setShowPass}
									autoComplete={"current-password"}
								/>
							)
						}}
						name={"password"}
						control={control}
						defaultValue={""}
					/>
				</div>
				<div className="ErrorContainerResetPW">
					{error &&
						(error === "sent_reset_password" ? (
							<>
								{["1", "2", "3"].map((code: string, index) => {
									return (
										<p className="Error" key={index}>
											{t(
												`site.signin_form_sent_reset_password_line${code}`
											)}
										</p>
									)
								})}
								<p className="Error">
									<a
										href="mailto:support@swingers.co.il"
										target={"_blank"}
										rel="noreferrer"
									>
										support@swingers.co.il
									</a>
								</p>
								<p className="Error">
									{t(
										`site.signin_form_sent_reset_password_line4`
									)}
								</p>
								<p className="Error">
									<a
										href="https://bit.ly/3vVJ9U4"
										target={"_blank"}
										rel="noreferrer"
									>
										https://bit.ly/3vVJ9U4
									</a>
								</p>
								<p className="Error">
									{t(
										`site.signin_form_sent_reset_password_line5`
									)}
								</p>
							</>
						) : (
							<p className="Error">
								{t(`site.signin_form_${error}`)}
							</p>
						))}
					{/*{error && error.code && (*/}
					{/*	<p className="Error">*/}
					{/*		{t(`site.signin_form_${error.code}`)}*/}
					{/*	</p>*/}
					{/*)}*/}
				</div>
				<div className="HelpActions">
					{/* <div className={"Item"}>
						<InputCheckBox
							title={t("site.remember me")}
							value={"123"}
							variant={"signin"}
						/>
					</div> */}
					<div className={"Item"}>
						<Link
							href={"/auth/forgot"}
							id={"link_forget_password"}
							styled={true}
							variant={"signin"}
						>
							{t("site.Forgot your password")}
						</Link>
					</div>
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
							{t("site.Enter the site")}
						</p>
					</Button>
				</div>
			</form>

			<div className="NewUser">
				<div className="WelcomeText">
					<p>{t("site.New on the site")}?</p>
				</div>
				<div className="ButtonSignUp">
					<Button
						type={"link"}
						href={"/auth/signup"}
						fullWidth={true}
						variant={"outline"}
						color={"white"}
					>
						<p className="LinkButtonText">
							{t("site.Sign up now for free")}
						</p>
					</Button>
				</div>
			</div>
		</div>
	)
}

const mapStateToProps = (state: any) => ({
	signInData: state.signInData,
	// userProfileTypes: state.userProfileTypes,
})

const mapDispatchToProps = {
	signIn: userProfileActions.signIn,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInEmailUsername)
