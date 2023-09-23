// import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {useRouter} from "next/router"
import {useTranslation} from "next-i18next"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import SuccessPage, {Struct} from "@/components/ui_pages/Success/SuccessPage"
import {NextSeo} from "next-seo"
import NoAuthLayout from "@/components/ui_app/AppLayouts/NoAuthLayout"

function SignUpSuccess() {
	const router = useRouter()
	const {t} = useTranslation("site")

	const pageStruct: Struct = {
		content: [
			t("site.Hot couple, you have successfully registered for the site"),
			t(
				"site.And Zim to make your profile perfect? Add a few more details and get a lot more inquiries"
			),
		],
		actions: [
			{
				children: t("site.Want to complete the profile"),
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
			{
				children: t(
					"site.Let's finish another time, let's get started"
				),
				type: "link",
				fullWidth: true,
				variant: "outline",
				id: "button_go_to_auth",
				onClick: () => {
					router.push("/auth/signin").then()
				},
				classname: "ButtonGoAuth",
			},
		],
		close: () => {
			router.push("/").then()
		},
	}

	return (
		<NoAuthLayout useHeader={false} useTabBar={false}>
			<NextSeo title={t("site.Registration success")} />
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

export default SignUpSuccess
