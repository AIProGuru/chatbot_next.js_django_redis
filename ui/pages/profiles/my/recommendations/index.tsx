import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import MyProfileAll from "@/components/ui_pages/Recommendations/MyProfileAll/MyProfileAll"
import { NextSeo } from "next-seo"
import { useTranslation } from "next-i18next"

function MyProfileAllRecommendationPage() {
	const {t} = useTranslation("site")
	return (
		<AppDefaultLayout useHeader={false} useTabBar={true} fullHeight={true}>
			<NextSeo title={t("site.My recommendations")} />
			<MyProfileAll />
		</AppDefaultLayout>
	)
}

MyProfileAllRecommendationPage.requireAuth = true

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default MyProfileAllRecommendationPage
