import Privacy from "@/components/ui_pages/Privacy/Privacy"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"

function PrivacyPage() {
	return (
		<AppDefaultLayout useTabBar={true} fullHeight={true}>
			<Privacy />
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

export default PrivacyPage
