import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {useRouter} from "next/router"
import {useTranslation} from "next-i18next"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import SuccessPage, {Struct} from "@/components/ui_pages/Success/SuccessPage"

function UpdateSubscriptionSuccess() {
	const router = useRouter()
	const {t} = useTranslation("site")

	const pageStruct: Struct = {
		content: [
			t("site.You successfully updated your subscription"), //"You successfully updated your subscription"
			t("site.Keep using the site and have a nice day"), //"Keep using the site and have a nice day!"
		],
		actions: [
			{
				children: t("site.Enjoy Surfing"), //"Back to edit profile"
				type: "link",
				prevent: true,
				fullWidth: true,
				id: "button_open_edit_profile",
				onClick: () => {
					router.push("/profiles/my/edit").then()
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

export default UpdateSubscriptionSuccess
