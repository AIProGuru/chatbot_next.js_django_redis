import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import { NextSeo } from "next-seo"

function EventSignUpDone() {
	const {t} = useTranslation("site")
	return (
		<AppDefaultLayout useTabBar={true} fullHeight={true}>
			<NextSeo title={t("site.success")} />
			<h1>EventSignUpDone page</h1>
			<h2>Congrats!</h2>
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

export default EventSignUpDone
