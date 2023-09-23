import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import React, {useEffect} from "react"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import {useForm, Controller} from "react-hook-form"
import Button from "@/components/ui/Button/Button/Button"
import InputCode from "@/components/ui/Forms/Inputs/Code/InputCode"
import Link from "@/components/ui/Button/Link/Link"
import {useRouter} from "next/router"
import DiscoRabbitIcon from "@/components/ui/Icons/DiscoRabbitIcon"
import {useAppDispatch, useAppSelector} from "@/redux/store"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import {saveAnonStep3} from "@/redux/slices/AnonEventSignUpSlice"
import {connect} from "react-redux"
import {userProfileActions} from "@/redux/actions/userProfileActions"
import { NextSeo } from "next-seo"

function OTPMobileCode(props: any) {
	const {t} = useTranslation("site")

	const {otpCheck, checkOTP} = props
	// router
	const router = useRouter()
	const {id} = router.query

	// form
	const {handleSubmit, control, watch, setValue} = useForm()

	// redux
	const dispatch = useAppDispatch()

	// redux state
	const anonSignUpData = useAppSelector((state) => state.anonEventSignUp)

	const otpCode = watch("otp_code")

	useEffect(() => {
		if (otpCheck.success && otpCheck.data.signature && otpCode) {
			const data = {
				otp_code: parseInt(otpCode),
				signature: otpCheck.data.signature,
			}
			dispatch(saveAnonStep3(data))
			router.push(`/events/${id}/signup/4`).then(() => {
				setValue("otp_code", "")
			})
		}
	}, [otpCheck])

	// on form submit
	const onSubmit = (data: any) => {
		if (data.otp_code === "" || data.otp_code.toString().length < 6) return
		checkOTP(anonSignUpData?.phone_number, data.otp_code)
	}

	const handleClosePage = () => {
		router.push(`/events/${id}/`).then((r) => r)
	}

	return (
		<AppDefaultLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<NextSeo title={t("site.Step 3 Verify the phone number")} />
			<div className={"OTPMobileCodeScreen"}>
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
						{t(
							"site.The code received in the sms must be entered into the number"
						)}{" "}
						<br />{" "}
						{anonSignUpData.phone_number &&
							anonSignUpData.phone_number}
					</p>
					<Link href={`/events/${id}/signup/2`} styled={true}>
						{t("site.I was wrong in the number")}
					</Link>
				</div>
				<div className="Form">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className={"OTPCode"}>
							<Controller
								render={({field}) => (
									<InputCode
										field={field}
										id={"input_code_otp_code"}
										codeLength={6}
									/>
								)}
								name={"otp_code"}
								control={control}
								defaultValue={""}
							/>
							{otpCheck.error && <p>Wrong OTP code</p>}
						</div>

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

const mapStateToProps = (state: any) => ({
	otpCheck: state.otpCheck,
})

const mapDispatchToProps = {
	checkOTP: userProfileActions.checkOTPPhone,
}

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OTPMobileCode)
