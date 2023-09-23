import DefaultLayout from "@/components/ui/Layout/DefaultLayout"
import AppTabBar from "@/components/ui_app/AppTabBar/AppTabBar"
import AppHeader from "@/components/ui_app/AppHeader/AppHeader"
import {useState} from "react"
import {useRouter} from "next/router"
import {useTranslation} from "next-i18next"
import MenuDrawer from "@/components/ui_app/Drawers/MenuDrawer"
import LanguageDrawer from "@/components/ui_app/Drawers/LanguageDrawer"
// import {useAppDispatch} from "@/redux/store"
import Footer from "@/components/ui/Footer/Footer"

interface AppDefaultLayoutProps {
	children: any
	useHeader?: boolean
	useTabBar?: boolean
	fullHeight?: boolean
	useFooter?: boolean
}

function NoAuthLayout(props: AppDefaultLayoutProps) {
	// props and constants
	const {t} = useTranslation("site")
	const {children, useHeader, useTabBar, fullHeight, useFooter} = props
	const router = useRouter()

	// state
	const [openMenu, setOpenMenu] = useState(false)
	const [switchProfileDrawer, setSwitchProfileDrawer] = useState(false)
	const [languageDrawer, setLanguageDrawer] = useState(false)
	const [unreadCount, setUnreadCount] = useState<number>(0)
	const [filterCount, setFilterCount] = useState<number>(0)
	const [profileProgress, setProfileProgress] = useState<number>(0)

	return (
		<DefaultLayout fullHeight={fullHeight}>
			{useHeader && (
				<AppHeader
					commonChatUnreadCount={unreadCount}
					peekCount={0}
					toggleFilters={() => {}}
					filterCount={filterCount}
				/>
			)}
			{useTabBar && (
				<AppTabBar openMenu={openMenu} setOpenMenu={setOpenMenu} />
			)}

			{/* menu drawer */}
			<MenuDrawer
				openMenu={openMenu}
				setOpenMenu={setOpenMenu}
				trigger={
					switchProfileDrawer
						? switchProfileDrawer
						: languageDrawer
						? languageDrawer
						: false
				}
				userProfilesData={undefined}
				openProfileSwitchDrawer={() => {}}
				getProfileImage={() => {}}
				profileProgress={profileProgress}
				toggleLanguageDrawer={setLanguageDrawer}
			/>

			{/* languages drawer */}
			<LanguageDrawer
				languageDrawer={languageDrawer}
				toggleLanguageDrawer={setLanguageDrawer}
			/>

			{children}
			{useFooter && <Footer />}
		</DefaultLayout>
	)
}

export default NoAuthLayout
