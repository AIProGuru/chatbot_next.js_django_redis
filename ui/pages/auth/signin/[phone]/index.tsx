import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import React, {useState, useEffect} from "react"
import {useForm, Controller} from "react-hook-form"
import Button from "@/components/ui/Button/Button/Button"
import InputCode from "@/components/ui/Forms/Inputs/Code/InputCode"
import {useRouter} from "next/router"
import {loginUser} from "@/app/utils"
import {validationSignInOtp} from "@/app/validationSchemas"
import {yupResolver} from "@hookform/resolvers/yup"
import {useDispatch, connect} from "react-redux"
import Logotype from "@/components/ui/Header/Logotype"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import Link from "@/components/ui/Button/Link/Link"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import {saveCaptcha} from "@/redux/slices/AuthSlice"
import {NextSeo} from "next-seo"
import NoAuthLayout from "@/components/ui_app/AppLayouts/NoAuthLayout"
import {useSignInPhoneMutation} from "@/redux/services"
import {
	SendLocationProps,
	useLazyGetUserProfilesInfoQuery,
	useSendLocationMutation,
} from "@/services/users.service"
import axiosInstance from "@/app/axiosInstance"
import useGeoLocation from "@/components/ui/Functions/Hooks/GetLocation"

function OTPAuthMobileCode(props: any) {
	const {authState, saveCaptcha} = props
	const {t} = useTranslation("site")
	const router = useRouter()
	const {phone} = router.query
	const dispatch = useDispatch()

	const formOptions = {resolver: yupResolver(validationSignInOtp)}
	const {register, handleSubmit, formState, control} = useForm(formOptions)
	const {errors} = formState

	const [error, setError] = useState<string | undefined>(undefined)
	const [loadingSignIn, setLoadingSignIn] = useState(false)

	const [signInPhoneMutation] = useSignInPhoneMutation()
	const [loginData, setLoginData] = useState({})

	const [getUserProfilesInfoQuery, userProfilesInfo] =
		useLazyGetUserProfilesInfoQuery()

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

	const onSubmit = (data: any) => {
		setError(undefined)

		console.log("authState", authState)

		if (authState && authState.captcha) {
			setLoadingSignIn(true)

			setTimeout(() => {
				signInPhoneMutation({
					phone: phone,
					otp: data.otp,
					recaptchaValue: authState.captcha,
				})
					.unwrap()
					.then((r) => {
						// console.log(r)
						// loginUser(r, dispatch, router, setLoadingSignIn)
						// saveCaptcha({captcha: ""})
						axiosInstance.defaults.headers.common["Authorization"] =
							r.access_token
						if (selfLocation?.lat && selfLocation?.lon) {
							sendLocationToServer(selfLocation)
						}
						getUserProfilesInfoQuery({})
						setLoginData(r)
						saveCaptcha({captcha: ""})
					})
					.catch((e) => {
						console.log("signin error", e)
						setLoadingSignIn(false)
						if (e && e.data && e.data.code) {
							setError(e.data.code)
						}
					})
			}, 200)
		}
	}

	const onError = (errors: any, e: any) => console.log(errors, e)

	// useEffect(() => {
	// 	if (success) {
	// 		// saveCaptcha({captcha: ""})
	// 		loginUser(data, dispatch, router)
	// 	}
	// }, [dispatch, success, data, router])

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

	const handleClosePage = () => {
		router.push(`/auth/signin/`).then((r) => r)
	}

	if (!phone) return null

	return (
		<NoAuthLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<NextSeo title={t("site.Verify the phone number")} />
			<div className={"AuthSignInIndexPage"}>
				<div className={"Close"}>
					<TransparentButton
						icon={<GoBackIcon />}
						onClick={handleClosePage}
					/>
				</div>
				<div className={"Logotype"}>
					<Logotype size={"signin"} />
				</div>
				<div className={"Guide"} style={{marginTop: "30px"}}>
					<p>
						{t("site.Enter the code you received for the number")}{" "}
						{phone ? phone : "-"}
					</p>
				</div>
				<div className="Form">
					<form onSubmit={handleSubmit(onSubmit, onError)}>
						<div className={"OTPCode"}>
							<Controller
								render={({field}) => (
									<InputCode
										field={field}
										id={"input_code_otp_code"}
										codeLength={6}
									/>
								)}
								name={"otp"}
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className="ErrorContainer">
							{error && (
								<p className="Error">
									{t(`site.signin_form_${error}`)}
								</p>
							)}
						</div>

						<div className={"Button"}>
							<Button
								type={"button"}
								fullWidth={true}
								mode={"submit"}
								id={"button.submit"}
								prevent={false}
								isLoading={loadingSignIn}
							>
								<p className={"SubmitButtonText"}>
									{t("site.enter with otp")}
								</p>
							</Button>
						</div>
						<div className="LinkContainer">
							<Link href={"/auth/signin"} styled>
								{t("site.I was wrong in the number")}
							</Link>
						</div>
					</form>
				</div>
			</div>
		</NoAuthLayout>
	)
}

const mapStateToProps = (state: any) => ({
	otpStatus: state.otpStatus,
	authState: state.auth,
})

const mapDispatchToProps = {
	saveCaptcha: saveCaptcha,
}

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OTPAuthMobileCode)
