import Button from "@/components/ui/Button/Button/Button"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import Logotype from "@/components/ui/Header/Logotype"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import SuccessRabbitIcon from "@/components/ui/Icons/SuccessRabbitIcon"
import {useRouter} from "next/router"
import {useTranslation} from "next-i18next"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import React from "react"
import {useUnfreezeMutation} from "@/services/support.service"
import {NextSeo} from "next-seo"
import CleanLayout from "@/components/ui_app/AppLayouts/CleanLayout"

const SignInUnfreeze = (props: any) => {
	const router = useRouter()
	const {t} = useTranslation("site")

	const [unfreeze] = useUnfreezeMutation()

	const unfreezeButton = () => {
		unfreeze({})
			.unwrap()
			.then((r) => {
				router.push(`/`).then(() => {
					router.reload()
				})
			})
			.catch((e) => {
				console.log(e)
			})
	}

	// on go back
	function onGoBackClick() {
		router.push(`/auth/logout`).then(() => {
			router.reload()
		})
	}

	return (
		<CleanLayout useTabBar={false} fullHeight={true}>
			<NextSeo title={t("site.select a profile")} />
			<div className="SignUpPageContainer">
				<div className="StepSelectProfile">
					<div className="GoBack">
						<TransparentButton
							icon={<CloseIcon style={"light"} />}
							onClick={onGoBackClick}
						/>
					</div>
					<div className="WelcomeLogotype">
						<Logotype size={"signup"} />
					</div>
					<div className="SuccessRabbitContainer">
						<SuccessRabbitIcon size={"small"} />
						<p>
							{/* TODO: add translations */}
							{/* {t(
								"site.Hot couple, you have successfully connected to the site"
							)} */}
							הפרופיל מוקפא
							<br />
							{/* {t(
								"site.We detected that you have 2 profiles under mobile email"
							)} */}
							{/* <br /> */}
						</p>
						<p>
							כדי לבטל את הקפאת הפרופיל לחצו כאן
							{/* {t(
								"site.Which profile would you like to connect with"
							)} */}
						</p>
					</div>
					<div className={"Actions"}>
						{/* submit form */}
						<div className="Button">
							<Button
								type={"button"}
								mode={"submit"}
								prevent={false}
								fullWidth={true}
								id={"button_go_fill_profile"}
								onClick={unfreezeButton}
							>
								<p className={"SubmitButtonText"}>
									{/* {t("site.Take me to the site")} */}
									ביטול הקפאה
								</p>
							</Button>
						</div>
						<div className="Info">
							<p>
								ביטול ההקפאה יחזיר אתכם לאתר
								{/* {t(
										"site.You can switch between the profiles later as well"
									)} */}
							</p>
						</div>
					</div>
				</div>
			</div>
		</CleanLayout>
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

SignInUnfreeze.requireAuth = true

export default SignInUnfreeze
