import DefaultLayout from "@/components/ui/Layout/DefaultLayout"
import AppTabBar from "@/components/ui_app/AppTabBar/AppTabBar"
import AppHeader, {
	ChatHeaderProps,
} from "@/components/ui_app/AppHeader/AppHeader"
import {
	useLazyGetPeekCountQuery,
	useLazyGetProfilePercentageQuery,
} from "@/services/users.service"
import {useEffect, useState} from "react"
import {useRouter} from "next/router"
import {useTranslation} from "next-i18next"
import MenuDrawer from "@/components/ui_app/Drawers/MenuDrawer"
import SwitchProfileDrawer from "@/components/ui_app/Drawers/SwitchProfileDrawer"
import {
	useLazyGetTryChatUnreadCountQuery,
} from "@/services/chat.service"
import LanguageDrawer from "@/components/ui_app/Drawers/LanguageDrawer"
import {lockFilters} from "@/redux/slices/FiltersSlice"
import {connect} from "react-redux"
import {
	lsFiltersAvailableStorage,
	lsFiltersStorage,
	lsSetItem,
} from "@/components/ui/Functions/AppLocalStorage"
import {useAppDispatch} from "@/redux/store"
import Footer from "@/components/ui/Footer/Footer"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
import dynamic from "next/dynamic"
import {lockAvailableFilters} from "@/redux/slices/FiltersAvailableTodaySlice"
import {useGetProfileAvatarsMutation} from "@/services/images.service"

const DynamicFiltersDrawer = dynamic(
	() => import("@/components/ui_app/Drawers/FiltersDrawer")
)
const DynamicFiltersAvailableDrawer = dynamic(
	() => import("@/components/ui_app/Drawers/FiltersAvailableDrawer")
)

interface AppDefaultLayoutProps {
	children: any
	useHeader?: boolean
	useChatHeader?: ChatHeaderProps
	useTabBar?: boolean
	fullHeight?: boolean
	useFooter?: boolean
	// currentProfileState?: any
	// saveCurrentProfileInfo?: any
	filtersState?: any
	filtersAvailableState?: any
	lockFilters?: Function
	useFilters?: boolean
	lockAvailableFilters?: Function
}

function AppDefaultLayout(props: AppDefaultLayoutProps) {
	// props and constants
	const {t} = useTranslation("site")
	const {
		children,
		useHeader,
		useChatHeader,
		useTabBar,
		fullHeight,
		lockFilters,
		filtersState,
		filtersAvailableState,
		useFooter,
		useFilters,
		lockAvailableFilters,
	} = props
	const router = useRouter()
	const pathname = router.pathname
	const dispatch = useAppDispatch()

	// state
	const [openMenu, setOpenMenu] = useState(false)
	const [switchProfileDrawer, setSwitchProfileDrawer] = useState(false)
	const [languageDrawer, setLanguageDrawer] = useState(false)
	const [filtersDrawer, setFiltersDrawer] = useState(false)
	const [filtersAvailableTodayDrawer, setFiltersAvailableTodayDrawer] =
		useState(false)
	const [myID, setMyID] = useState<string | undefined>(undefined)
	const [myProfileIDs, setMyProfileIDs] = useState<string[]>([])
	const [unreadCount, setUnreadCount] = useState<number>(0)
	const [filterCount, setFilterCount] = useState<number>(0)
	const [filterAvailableCount, setFilterAvailableCount] = useState<number>(0)
	const [profileProgress, setProfileProgress] = useState<number | undefined>(
		undefined
	)
	const [avatars, setAvatars] = useState<any[]>([])
	const [getProfileAvatars] = useGetProfileAvatarsMutation()

	const userProfilesData = useGetUserProfilesInfo()
	

	// rtk
	const [triggerPeekCount, getPeekCount] = useLazyGetPeekCountQuery<any>()
	const [getTryChatUnreadCount, tcUnreadCountResponse] =
		useLazyGetTryChatUnreadCountQuery()
	const [triggerProfilePercentage, profilePercentageResponse] =
		useLazyGetProfilePercentageQuery()

	// current profile id
	useEffect(() => {
		if (userProfilesData) {
			// set my id as current profile id
			if (userProfilesData.current_profile_id) {
				setMyID(userProfilesData.current_profile_id.toString())
			}

			// set my profiles ids as ids of all my profiles
			if (userProfilesData && userProfilesData.profiles) {
				const ids = userProfilesData.profiles.map((el: any) => {
					return el.id
				})

				if (ids && ids.length > 0) {
					setMyProfileIDs(ids)
				}
			}
		}
	}, [userProfilesData])

	// peek at me
	// todo: pagination 100
	useEffect(() => {
		if (useHeader) {
			triggerPeekCount({})
		}
	}, [pathname, useHeader])

	// chat unread count
	useEffect(() => {
		if (myID && useTabBar) {
			getTryChatUnreadCount({})
		}
	}, [myID, useTabBar])

	useEffect(() => {
		if (myID && myProfileIDs && useTabBar) {
			getProfileAvatars({
				profileIds: myProfileIDs,
			})
				.unwrap()
				.then((r) => {
					if (r && r.length > 0) {
						setAvatars(r)
					}
				})
				.catch((e) => {
					console.log("getProfileAvatars", e)
				})
		}
	}, [myID, myProfileIDs, useTabBar])

	useEffect(() => {
		if (
			tcUnreadCountResponse &&
			tcUnreadCountResponse.status === "fulfilled" &&
			tcUnreadCountResponse.data
		) {
			setUnreadCount(tcUnreadCountResponse.data.unread_room_count)
		}
	}, [tcUnreadCountResponse])

	// profile percentage
	useEffect(() => {
		if (myID && useTabBar) {
			triggerProfilePercentage({
				profileId: myID,
			})
		}
	}, [myID, useTabBar])

	// profile percentage
	useEffect(() => {
		if (
			profilePercentageResponse &&
			profilePercentageResponse.status === "fulfilled" &&
			profilePercentageResponse.data
		) {
			profilePercentageResponse.data.percent > 100
				? setProfileProgress(100)
				: setProfileProgress(profilePercentageResponse.data.percent)
		}
	}, [profilePercentageResponse])

	// // save filters
	useEffect(() => {
		if (filtersState && filtersState.lock === false) {
			lsSetItem(lsFiltersStorage, JSON.stringify(filtersState))
		}
	}, [filtersState])

	// // save filters
	useEffect(() => {
		if (filtersAvailableState && filtersAvailableState.lock === false) {
			lsSetItem(
				lsFiltersAvailableStorage,
				JSON.stringify(filtersAvailableState)
			)
		}
	}, [filtersAvailableState])

	// open profile drawer
	function openProfileSwitchDrawer() {
		setSwitchProfileDrawer(true)
	}

	// close profile drawer
	function closeProfileSwitchDrawer() {
		setSwitchProfileDrawer(false)
	}

	// toggle filters drawer
	function toggleFilterDrawer(state: boolean) {
		if (state) {
			setFiltersDrawer(true)
			lockFilters && lockFilters({state: true})
		} else {
			setFiltersDrawer(false)
			lockFilters && lockFilters({state: false})
		}
	}

	// toggle filters drawer
	function toggleFilterAvailableTodayDrawer(state: boolean) {
		if (state) {
			setFiltersAvailableTodayDrawer(true)
			lockAvailableFilters && lockAvailableFilters({state: true})
		} else {
			setFiltersAvailableTodayDrawer(false)
			lockAvailableFilters && lockAvailableFilters({state: false})
		}
	}

	// get profile image for list in profile switcher
	function getProfileImage(profiles: any, profileId: string): string {
		const profile = profiles.find((s: any) => s.id === profileId)
		const profileType = profile.profile_type

		if (avatars && avatars.length > 0) {
			const search = avatars.find((s) => s.profile_id === profileId)
			if (search) {
				return search.s3_url
			} else {
				return profileType
					? `/profiles/avatar_${profileType.toLowerCase()}_64.png`
					: "/profiles/avatar_couple_64.png"
			}
		} else {
			return profileType
				? `/profiles/avatar_${profileType.toLowerCase()}_64.png`
				: "/profiles/avatar_couple_64.png"
		}
	}

	// peek at me
	const peekCount = getPeekCount?.data?.data || []

	return (
		<DefaultLayout fullHeight={fullHeight}>
			{useChatHeader && <AppHeader chat={useChatHeader} />}
			{useHeader && (
				<AppHeader
					commonChatUnreadCount={unreadCount}
					peekCount={peekCount}
					toggleFilters={toggleFilterDrawer}
					filterCount={filterCount}
					toggleAvailableFilters={toggleFilterAvailableTodayDrawer}
					filterAvailableCount={filterAvailableCount}
				/>
			)}
			{useTabBar && (
				<AppTabBar
					openMenu={openMenu}
					setOpenMenu={setOpenMenu}
					commonChatUnreadCount={unreadCount}
				/>
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
				userProfilesData={userProfilesData}
				openProfileSwitchDrawer={openProfileSwitchDrawer}
				getProfileImage={getProfileImage}
				profileProgress={profileProgress}
				toggleLanguageDrawer={setLanguageDrawer}
			/>

			{/* switch profile drawer */}
			<SwitchProfileDrawer
				switchProfileDrawer={switchProfileDrawer}
				closeProfileSwitchDrawer={closeProfileSwitchDrawer}
				userProfilesData={userProfilesData}
				getProfileImage={getProfileImage}
			/>

			{/* languages drawer */}
			<LanguageDrawer
				languageDrawer={languageDrawer}
				toggleLanguageDrawer={setLanguageDrawer}
			/>

			{/* filters drawer */}
			{useFilters && filtersDrawer && (
				<DynamicFiltersDrawer
					show={filtersDrawer}
					toggleFunction={toggleFilterDrawer}
					filterCount={filterCount}
					setFilterCount={setFilterCount}
				/>
			)}
			{/* filters drawer */}
			{useFilters && filtersAvailableTodayDrawer && (
				<DynamicFiltersAvailableDrawer
					show={filtersAvailableTodayDrawer}
					toggleFunction={toggleFilterAvailableTodayDrawer}
					filterCount={filterAvailableCount}
					setFilterCount={setFilterAvailableCount}
				/>
			)}

			{children}
			{useFooter && <Footer />}
		</DefaultLayout>
	)
}

// export default AppDefaultLayout

const mapStateToProps = (state: any) => ({
	filtersState: state.FiltersSlice,
	filtersAvailableState: state.FiltersAvailableTodaySlice,
})

const mapDispatchToProps = {
	lockFilters: lockFilters,
	lockAvailableFilters: lockAvailableFilters,
}

export default connect(mapStateToProps, mapDispatchToProps)(AppDefaultLayout)
