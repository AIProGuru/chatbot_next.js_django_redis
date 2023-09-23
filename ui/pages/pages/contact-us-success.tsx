import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {useRouter} from "next/router"
import {useTranslation} from "next-i18next"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import SuccessPage, {Struct} from "@/components/ui_pages/Success/SuccessPage"

function ContactUsSuccess() {
	const router = useRouter()
	const {t} = useTranslation("site")

	const pageStruct: Struct = {
		content: [
			t("site.Thank you for contacting us"),
			"0505345050",
		],
		actions: [
			{
				children: "Back to site",
				type: "link",
				prevent: true,
				fullWidth: true,
				id: "button_open_site",
				onClick: () => {
					router.push("/").then()
				},
				classname: "SubmitButtonText",
			},
		],
		close: () => {
			router.push("/").then()
		},
	}

	return (
		<AppDefaultLayout useHeader={false} useTabBar={false}>
			<SuccessPage struct={pageStruct} />
		</AppDefaultLayout>
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

export default ContactUsSuccess
