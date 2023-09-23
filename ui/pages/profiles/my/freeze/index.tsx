import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import FreezePage from "@/components/ui_pages/Freeze/FreezePage"
import { NextSeo } from "next-seo"
import { useTranslation } from "next-i18next"

function ReportNewPage() {
	const {t} = useTranslation("site")
	return (
		<AppDefaultLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<NextSeo title={t("site.Freeze profile")} />
			<FreezePage />
		</AppDefaultLayout>
	)
}

ReportNewPage.requireAuth = true

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default ReportNewPage
