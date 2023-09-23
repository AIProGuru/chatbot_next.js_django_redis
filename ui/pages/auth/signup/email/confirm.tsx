// import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {useRouter} from "next/router"
import {useTranslation} from "next-i18next"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import SuccessPage, {Struct} from "@/components/ui_pages/Success/SuccessPage"
import {NextSeo} from "next-seo"
import NoAuthLayout from "@/components/ui_app/AppLayouts/NoAuthLayout"

function SignUpConfirmEmail() {
	const router = useRouter()
	const {t} = useTranslation("site")

	const pageStruct: Struct = {
		content: [t("site.Confirm your email and go to sign in")], // locale here
		actions: [
			{
				children: "Sign in", // locale here
				type: "button",
				mode: "submit",
				prevent: false,
				fullWidth: true,
				id: "button_go_fill_profile",
				onClick: () => {
					router.push("/auth/signin").then()
				},
				classname: "SubmitButtonText",
			},
		],
		close: () => {
			router.push("/auth/signin").then()
		},
	}

	return (
		<NoAuthLayout useHeader={false} useTabBar={false}>
			<NextSeo title={t("site.Confirm email")} />
			<SuccessPage struct={pageStruct} />
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

export default SignUpConfirmEmail
