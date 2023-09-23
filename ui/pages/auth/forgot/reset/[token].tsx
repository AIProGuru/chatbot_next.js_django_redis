// import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import React, {useMemo} from "react"
import {useRouter} from "next/router"
import Logotype from "@/components/ui/Header/Logotype"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {TFunction, useTranslation} from "next-i18next"
import {Controller, useForm} from "react-hook-form"
import Button from "@/components/ui/Button/Button/Button"
import {useResetPasswordMutation} from "@/redux/services"
import InputPassword from "@/components/ui/Forms/Inputs/Password/InputPassword"
import {NextSeo} from "next-seo"
import {yupResolver} from "@hookform/resolvers/yup"
import {ResetPasswordSchema} from "@/app/validation/Auth/ResetPassword.schema"
import NoAuthLayout from "@/components/ui_app/AppLayouts/NoAuthLayout"

type FormData = {
	password: string
	password_confirmation: string
}

type ErrorTranslations = {
	[x: string]: any
}

const getErrorTranslations = (t: TFunction): ErrorTranslations => {
	return {
		yup_password_required: t("site.yup_reset_password_required"),
		yup_password_lowercase: t("site.yup_reset_password_lowercase"),
		yup_password_uppercase: t("site.yup_reset_password_uppercase"),
		yup_password_digit: t("site.yup_reset_password_digit"),
		yup_password_length: t("site.yup_reset_password_length"),
		yup_password_confirmation_required: t(
			"site.yup_reset_password_confirmation_required"
		),
		yup_password_confirmation_not_match: t(
			"site.yup_reset_password_confirmation_not_match"
		),
	}
}

const getPageTranslations = (t: TFunction) => {
	return {
		form: {
			password: t("site.password"),
			password_confirmation: t("site.Type the password again"),
			info: t("site.Complete the password reset by entering a new one"),
			save: t("site.Save"),
			error: {
				// empty: "Password must not be empty",
				// match: "Passwords do not match",
				token_expired: "Token expired",
			},
		},
	}
}

function ResetPasswordPage(props: any) {
	// props
	const {t} = useTranslation("site")
	const router = useRouter()
	const {token} = router.query
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])
	const errorTranslations = useMemo(() => {
		return getErrorTranslations(t)
	}, [t])
	const {handleSubmit, control} = useForm<FormData>({
		resolver: yupResolver(ResetPasswordSchema),
		mode: "onChange",
	})

	// rtk
	const [resetPassword] = useResetPasswordMutation()

	// close page
	function handleClosePage() {
		router.push(`/auth/signin`).then((r) => r)
	}

	// on form submit
	function onFormSubmit(data: FormData) {
		// if (!data.password || !data.password_confirmation) {
		// 	alert(pageTranslations.form.error.empty)
		// 	return
		// }
		//
		// if (data.password !== data.password_confirmation) {
		// 	alert(pageTranslations.form.error.match)
		// 	return
		// }

		if (!token) return

		resetPassword({
			token: token.toString(),
			new_password: data.password,
		})
			.unwrap()
			.then((r) => {
				if (r && r.success === true) {
					router.push("/auth/signin").then()
				}
			})
			.catch((e) => {
				console.log(e, e.data)

				if (e.data) {
					switch (e.data.code) {
						case "token_expired":
							alert(pageTranslations.form.error.token_expired)
							break

						default:
							alert(e.message)
							break
					}
				} else {
					alert(e.message)
				}
			})
	}

	if (!token) return null

	return (
		<NoAuthLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<NextSeo title={t("site.reset_password")} />
			<div className="AuthSignInIndexPage">
				<div className={"Close"}>
					<TransparentButton
						icon={<CloseIcon style={"light"} />}
						onClick={handleClosePage}
					/>
				</div>
				<div className={"Logotype"}>
					<Logotype size={"signin"} />
				</div>
				<div className="ResetPasswordInfo">
					<p>{pageTranslations.form.info}</p>
				</div>
				<div className="Tabs">
					<div className="TabPanelContainer">
						<form onSubmit={handleSubmit(onFormSubmit)}>
							<div className="Input">
								<Controller
									render={({field, fieldState}) => {
										return (
											<InputPassword
												field={field}
												placeholder={
													pageTranslations.form
														.password
												}
												id={"password"}
												required={true}
												error={
													fieldState.error?.message &&
													errorTranslations[
														fieldState.error.message
													]
												}
											/>
										)
									}}
									name={"password"}
									control={control}
									defaultValue={""}
								/>
							</div>
							<div className="Input">
								<Controller
									render={({field, fieldState}) => {
										return (
											<InputPassword
												field={field}
												placeholder={
													pageTranslations.form
														.password_confirmation
												}
												id={"password_confirmation"}
												required={true}
												error={
													fieldState.error?.message &&
													errorTranslations[
														fieldState.error.message
													]
												}
											/>
										)
									}}
									name={"password_confirmation"}
									control={control}
									defaultValue={""}
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
							<div className="Button">
								<Button
									type={"button"}
									prevent={false}
									mode={"submit"}
									fullWidth={true}
								>
									<p className="SubmitButtonText">
										{pageTranslations.form.save}
									</p>
								</Button>
							</div>
						</form>
					</div>
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

export default ResetPasswordPage
