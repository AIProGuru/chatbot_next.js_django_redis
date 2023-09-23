// import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import React, {useMemo} from "react"
import {useRouter} from "next/router"
import Logotype from "@/components/ui/Header/Logotype"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {TFunction, useTranslation} from "next-i18next"
import {NextSeo} from "next-seo"
import NoAuthLayout from "@/components/ui_app/AppLayouts/NoAuthLayout"

const getPageTranslations = (t: TFunction) => {
	return {
		reset_password_info: {
			check_email: t(
				"site.A password reset link has been sent to your email"
			),
			close_page: t("site.You can close this page"),
		},
	}
}

function CheckEmailPage(props: any) {
	// props
	const {t} = useTranslation("site")
	const router = useRouter()
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])

	// close page
	function handleClosePage() {
		router.push(`/auth/signin`).then((r) => r)
	}

	return (
		<NoAuthLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<NextSeo title={t("site.Check email")} />
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
					<p>{pageTranslations.reset_password_info.check_email}</p>
					<p>
						<small>
							{pageTranslations.reset_password_info.close_page}
						</small>
					</p>
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

export default CheckEmailPage
