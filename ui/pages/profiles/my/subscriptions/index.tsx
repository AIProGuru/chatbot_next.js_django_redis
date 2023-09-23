import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import SubscriptionsPage from "@/components/ui_pages/Subscriptions/SubscriptionsPage"
import { NextSeo } from "next-seo"
import { useTranslation } from "next-i18next"

function MyProfileSubscriptions() {
	const {t} = useTranslation("site")
	return (
		<AppDefaultLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<NextSeo title={t("site.Subscribers")} />
			<SubscriptionsPage />
		</AppDefaultLayout>
	)
}

MyProfileSubscriptions.requireAuth = true

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default MyProfileSubscriptions
