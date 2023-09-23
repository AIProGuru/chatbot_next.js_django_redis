import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useRouter} from "next/router"
import dynamic from "next/dynamic"
const DynamicChatListPage = dynamic(
	() => import("@/components/TryChat/Pages/ChatList/ChatListPage")
)

const TryChatFilteredPage = () => {
	const router = useRouter()

	const switchTab = (tab: number) => {
		switch (tab) {
			case 0:
				router.push("/chat").then()
				break

			case 1:
				router.push("/chat/filtered").then()
				break

			default:
				router.reload()
				break
		}
	}

	return <DynamicChatListPage tabValue={1} setTabValue={switchTab} />
}

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

TryChatFilteredPage.requireAuth = true

export default TryChatFilteredPage
