import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import PageNewRecommendation from "@/components/ui_pages/Recommendations/New/PageNewRecommendation"
import { useTranslation } from "next-i18next"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import { NextSeo } from "next-seo"

function RecommendationNewPage() {
	const {t} = useTranslation("site")
	return (
		<AppDefaultLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<NextSeo title={t("site.Add a new recommendation")} />
			<PageNewRecommendation />
		</AppDefaultLayout>
	)
}

RecommendationNewPage.requireAuth = true

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default RecommendationNewPage
