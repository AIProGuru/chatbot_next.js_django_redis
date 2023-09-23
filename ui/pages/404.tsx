import Page404 from "@/components/ui_pages/Page404/Page404"
import { useTranslation } from "next-i18next"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {NextSeo} from "next-seo"

function Custom404() {
	const {t} = useTranslation("site")
	return (
		<>
			<NextSeo title={t("site.Not found")} />
			<Page404 />
		</>
	)
}

Custom404.requireAuth = false

export async function getStaticProps(ctx: any) {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default Custom404
