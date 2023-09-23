import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import EditProfilePage from "@/components/ui_pages/EditProfile/EditProfilePage"
import { NextSeo } from "next-seo"
import { useTranslation } from "next-i18next"
 
function MyProfileEditPage() {
	const {t} = useTranslation("site")
	return (
		<AppDefaultLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<NextSeo title={t("site.Edit profile")} />
			<EditProfilePage />
		</AppDefaultLayout>
	) 
}

MyProfileEditPage.requireAuth = true

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default MyProfileEditPage
