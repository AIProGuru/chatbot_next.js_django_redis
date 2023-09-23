import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import React, {useEffect, useState} from "react"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import {useForm, Controller} from "react-hook-form"
import InputText from "@/components/ui/Forms/Inputs/Text/InputText"
import Button from "@/components/ui/Button/Button/Button"
import {useRouter} from "next/router"
import DiscoRabbitIcon from "@/components/ui/Icons/DiscoRabbitIcon"
import {userProfileActions} from "@/redux/actions/userProfileActions"
import {useAppDispatch, useAppSelector} from "@/redux/store"
import {saveAnonStep2, saveAnonStep3} from "@/redux/slices/AnonEventSignUpSlice"
import {connect} from "react-redux"
import {useAuth} from "@/components/auth/AuthProvider"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import {yupResolver} from "@hookform/resolvers/yup"
import {validationEventPhoneStep2} from "@/app/validationSchemas"
import {NotificationService} from "../../../auth/signup"
import InputRadioHorizontal from "@/components/ui/Forms/Inputs/RadioHorizontal/InputRadioHorizontal"
import {NextSeo} from "next-seo"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"

function OTPMobile(props: any) {
	const {t} = useTranslation("site")
	const {otpStatus, sendOTP} = props

	// router
	const router = useRouter()
	const {id} = router.query

	// form
	const formOptions = {
		resolver: yupResolver(validationEventPhoneStep2),
	}
	const {handleSubmit, watch, control, formState, setValue} =
		useForm(formOptions)
	const {errors} = formState

	const phone_number = watch("phone_number")

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

	// redux
	const dispatch = useAppDispatch()

	const auth = useAuth()

	// redux state
	const anonSignUpData = useAppSelector((state) => state.anonEventSignUp)

	// rtk get user data
	const userProfilesData = useGetUserProfilesInfo()

	useEffect(() => {
		if (auth && userProfilesData) {
			setValue("phone_number", userProfilesData?.phone)
		}
	}, [auth, userProfilesData])

	// redux otp state
	// const sendOTP = userProfileActions.sendOTPPhone
	// const otpStatus = useAppSelector((state) => state.otpStatus)

	// otp state fix
	const [allowSubmit, setAllowSubmit] = useState(false)

	// on form submit
	const onSubmit = (data: any) => {
		if (data.phone_number === "" || Object.keys(errors).length !== 0) return
		if (!data.notifications) return

		const dataOTP = {
			otp_code: undefined,
			signature: undefined,
		}

		dispatch(saveAnonStep3(dataOTP))
		dispatch(saveAnonStep2(data))

		sendOTP(data.phone_number, data.notifications)

		setAllowSubmit(true)
	}

	// if ots status is ok
	useEffect(() => {
		if (otpStatus && otpStatus.data && allowSubmit) {
			router.push(`/events/${id}/signup/3`).then((r) => r)
		}
	}, [allowSubmit, otpStatus, id, router])

	// when page closed
	const handleClosePage = () => {
		router.push(`/events/${id}/`).then((r) => r)
	}

	return (
		<AppDefaultLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<NextSeo
				title={t("site.Step 2 Put in a cell phone and continue")}
			/>
			<div className={"OTPMobileScreen"}>
				<div className={"Close"}>
					<TransparentButton
						icon={<CloseIcon style={"light"} />}
						onClick={handleClosePage}
					/>
				</div>
				<div className={"Icon"}>
					<DiscoRabbitIcon />
				</div>
				<div className={"Guide"}>
					<p>
						{t("site.Pleasure you chose to sign up for the party")}
						<br />
						{t("site.Big games")}
						<br />
						{t("site.Put in a mobile and continue")}
					</p>
				</div>
				<div className="Form">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className={"PhoneNumber"}>
							<Controller
								render={({field}) => (
									<InputText
										field={field}
										placeholder={t("site.Phone Number")}
										required={true}
										// type={"number"}
										id={"phone_number"}
										error={errors.phone_number?.message}
									/>
								)}
								name={"phone_number"}
								control={control}
								defaultValue={""}
							/>
						</div>

						{phone_number && phone_number?.length > 0 && (
							<div className="Notifications">
								<p className={"SelectService"}>
									Please select the service you would like us
									to send you a message with a code in
								</p>
								<Controller
									render={({field}) => (
										<>
											{notificationServices &&
												notificationServices.map(
													(service) => {
														return (
															<InputRadioHorizontal
																key={service.id}
																value={
																	service.value
																}
																field={field}
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
										</>
									)}
									name={"notifications"}
									control={control}
									defaultValue={""}
								/>
							</div>
						)}

						{/* <div className={"CheckBox"}>
							<Controller
								render={({field}) => (
									<InputCheckBox
										field={field}
										value={"checkbox1"}
										title={t(
											"site.I want to sign up for the site and get a 10% discount on buying a party ticket"
										)}
										id={"checkbox_1"}
									/>
								)}
								name={"checkbox_register_me_on_site"}
								control={control}
								defaultValue={false}
							/>
						</div> */}

						<div className={"Actions"}>
							<Button
								type={"button"}
								fullWidth={true}
								mode={"submit"}
								id={"button.submit"}
								prevent={false}
							>
								<p className={"SubmitButtonText"}>
									{t("site.Send me a code")}
								</p>
							</Button>
						</div>
					</form>
				</div>
			</div>
		</AppDefaultLayout>
	)
}

// export default OTPMobile
const mapStateToProps = (state: any) => ({
	otpStatus: state.otpStatus,
})

const mapDispatchToProps = {
	sendOTP: userProfileActions.sendOTPPhone,
}

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OTPMobile)
