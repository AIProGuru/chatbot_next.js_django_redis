// import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import React, {useEffect, useMemo} from "react"
import {useRouter} from "next/router"
import Logotype from "@/components/ui/Header/Logotype"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {TFunction, useTranslation} from "next-i18next"
import {Controller, useForm} from "react-hook-form"
import InputText from "@/components/ui/Forms/Inputs/Text/InputText"
import Button from "@/components/ui/Button/Button/Button"
import {useLazyForgotPasswordQuery} from "@/redux/services"
import {NextSeo} from "next-seo"
import {yupResolver} from "@hookform/resolvers/yup"
import {ForgotPasswordSchema} from "@/app/validation/Auth/ForgotPassword.schema"
import getConfig from "next/config"
import Head from "next/head"
import NoAuthLayout from "@/components/ui_app/AppLayouts/NoAuthLayout"

const {publicRuntimeConfig} = getConfig()

type FormData = {
	email: string
}

type ErrorTranslations = {
	[x: string]: any
}

const getErrorTranslations = (t: TFunction): ErrorTranslations => {
	return {
		yup_auth_forgot_password_email_required: t(
			"site.yup_auth_forgot_password_email_required"
		),
		yup_auth_forgot_password_email_must_be_email: t(
			"site.yup_auth_forgot_password_email_must_be_email"
		),
	}
}

const getPageTranslations = (t: TFunction) => {
	return {
		form: {
			welcome: t(
				"site.Enter your email address and click the button Then follow the link we sent you by email"
			),
			email_input_placeholder: t("site.Email_addr"),
			reset_password_button_text: t("site.Reset password"),
		},
	}
}

function ForgotPasswordPage(props: any) {
	// props
	const {t} = useTranslation("site")
	const baseUrl = publicRuntimeConfig?.baseUrl || ""
	const router = useRouter()
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])
	const errorTranslations = useMemo(() => {
		return getErrorTranslations(t)
	}, [t])
	const {handleSubmit, control} = useForm<FormData>({
		resolver: yupResolver(ForgotPasswordSchema),
		mode: "onChange",
	})

	// rtk
	const [triggerResetPassword, resetPasswordResponse] =
		useLazyForgotPasswordQuery()

	// close page
	function handleClosePage() {
		router.push(`/auth/signin`).then((r) => r)
	}

	// on form submit
	function onFormSubmit(data: any) {
		triggerResetPassword({
			email: data.email,
		})
	}

	// reset password response
	useEffect(() => {
		if (
			resetPasswordResponse &&
			(resetPasswordResponse.status === "fulfilled" ||
				resetPasswordResponse.status === "rejected")
		) {
			// if (resetPasswordResponse.data.success === true) {
			router.push("/auth/forgot/check-email").then()
			// }
		}
	}, [resetPasswordResponse, router])

	const schemaDataWebPage = {
		"@context": "https://schema.org",
		"@graph": [
			{
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
						name: "Forgot Password",
						item: `${baseUrl}/${t("site.en")}/auth/forgot`,
					},
				],
			},

			{
				"@type": "Organization",
				"@id": `${baseUrl}/${t("site.en")}/#organization`,
				name: "Swingers couples swapping",
				url: `${baseUrl}`,
				email: "webmaster@swingers.co.il",
				logo: {
					"@type": "ImageObject",
					url: `${baseUrl}/seo.jpg`,
					width: "217",
					height: "49",
				},
				description:
					"The Swingers website is the leading and largest website for the couples swapping scene in Israel. Visit the site to join our quality couples exchanging community.",
				contactPoint: {
					"@type": "ContactPoint",
					contactType: "customer support",
					telephone: "+972 50-534-5050",
					email: "webmaster@swingers.co.il",
				},
			},

			{
				"@type": "WebSite",
				"@id": `${baseUrl}/${t("site.en")}/#website`,
				url: `${baseUrl}/${t("site.en")}`,
				name: "Swingers couples swapping",
				inLanguage: t("site.en_US"),
				publisher: {
					"@id": `${baseUrl}/${t("site.en")}/#organization`,
				},
			},

			{
				"@type": "WebPage",
				"@id": `${baseUrl}/${t("site.en")}/#webpage`,
				isPartOf: {
					"@id": `${baseUrl}/${t("site.en")}/#website`,
				},
				url: `${baseUrl}/${t("site.en")}/`,
				headline: t("site.homepage"),
				description:
					"Swingers site is a meeting place for people looking for thrills and new experiences of exchanging couples and open relationships",
			},
			{
				"@type": "WebPage",
				"@id": `${baseUrl}/${t("site.en")}/auth/forgot`,
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": `${baseUrl}/${t("site.en")}/#webpage`,
					headline: t("site.homepage"),
				},
				image: [
					{
						"@type": "ImageObject",
						url: `${baseUrl}/seo.jpg`,
						height: "217",
						width: "49",
					},
				],
				headline: "Forgot Password",
				description: "Reset password for Swingers site",
				copyrightYear: "2022",
				inLanguage: t("site.en_US"),
				keywords:
					"Swingers , Swinger ,liftstyle,exchanging couples,open relationships",
			},
		],
	}

	return (
		<NoAuthLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<NextSeo
				title={t("site.forgot your_password")}
				description={
					"The Swingers website is the leading and largest website for the couples swapping scene in Israel. Visit the site to join our quality couples exchanging community."
				}
				openGraph={{
					type: "article",
					url: `${baseUrl}/${t("site.en")}/auth/forgot`,
					title: t(
						"site.The Forum of the Swingers Community and the Exchange of Couples of Israel"
					),
					description:
						"The Swingers website is the leading and largest website for the couples swapping scene in Israel. Visit the site to join our quality couples exchanging community.",
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
					<p>{pageTranslations.form.welcome}</p>
				</div>
				<div className="Tabs">
					<form onSubmit={handleSubmit(onFormSubmit)}>
						<div className="Input">
							<Controller
								render={({field, fieldState}) => {
									return (
										<InputText
											field={field}
											placeholder={
												pageTranslations.form
													.email_input_placeholder
											}
											id={"email"}
											error={
												fieldState.error?.message &&
												errorTranslations[
													fieldState.error.message
												]
											}
										/>
									)
								}}
								name={"email"}
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className="Button">
							<Button
								type={"button"}
								prevent={false}
								mode={"submit"}
								fullWidth={true}
							>
								<p className="SubmitButtonText">
									{
										pageTranslations.form
											.reset_password_button_text
									}
								</p>
							</Button>
						</div>
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

export default ForgotPasswordPage
