import Header from "@/components/ui/Header/Header"
import FilterIcon from "@/components/ui/Icons/FilterIcon"
import EyeIcon from "@/components/ui/Icons/EyeIcon"
import DialogIcon from "@/components/ui/Icons/DialogIcon"
import {useAuth} from "@/components/auth/AuthProvider"
import {useRouter} from "next/router"
import FilterWithoutLupaIcon from "@/components/ui/Icons/FilterWithoutLupaIcon"
import CreateGroupIcon from "@/components/ui/Icons/CreateGroupIcon"
import {useTranslation} from "next-i18next"
import {useCallback, useEffect, useState} from "react"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import Nav, {INav} from "@/components/ui_app/AppHeader/Nav"

type AppHeaderProps = {
	chat?: ChatHeaderProps
	peekCount?: number
	commonChatUnreadCount?: number
	toggleFilters?: Function
	filterCount?: number
	toggleAvailableFilters?: Function
	filterAvailableCount?: number
}

export type ChatHeaderProps = {
	filter?: {
		counter: number
		drawer: Function
	}
	group?: {
		counter: number
	}
}

function AppHeader(props: AppHeaderProps) {
	const {t} = useTranslation("site")
	const router = useRouter()
	const path = router.pathname

	const {
		chat,
		peekCount,
		commonChatUnreadCount,
		toggleFilters,
		filterCount,
		toggleAvailableFilters,
		filterAvailableCount,
	} = props
	// is user auth
	const auth = useAuth() || false

	const [navListLeft, setNavListLeft] = useState<INav[]>([])
	const [navListRight, setNavListRight] = useState<INav[]>([])
	const [navChatListLeft, setNavChatListLeft] = useState<INav[]>([])
	const [navChatListRight, setNavChatListRight] = useState<INav[]>([])

	const generateNav = useCallback(() => {

		// nav item for left button group
		const navListLeft2: INav[] = []

		if (path === "/") {
			navListLeft2.push({
				icon: <FilterIcon />,
				authRequired: true,
				id: "icon_button_filter",
				bubble: {
					counter: filterCount ? filterCount : 0,
					position: "right",
					variant: "clear",
				},
				callback: () => {
					toggleFilters && toggleFilters(true)
				},
			})
		}
		if (path === "/available-today") {
			navListLeft2.push({
				icon: <FilterIcon />,
				authRequired: true,
				id: "icon_button_filter",
				bubble: {
					counter: filterAvailableCount ? filterAvailableCount : 0,
					position: "right",
					variant: "clear",
				},
				callback: () => {
					toggleAvailableFilters && toggleAvailableFilters(true)
				},
			})
		}
		if (path === "/articles/[subcategory]") {
			navListLeft2.push({
				icon: <GoBackIcon />,
				authRequired: false,
				id: "icon_button_filter",
				callback: () => {
					router.push("/articles").then()
				},
			})
		}

		const dialogNav = {
			icon: <DialogIcon />,
			authRequired: true,
			href: "/chat/list",
			id: "icon_button_dialog",
		}

		// if (commonChatUnreadCount && commonChatUnreadCount > 0) {
		// 	Object.assign(dialogNav, {
		// 		bubble: {
		// 			counter: getUnreadCount(),
		// 			position: "left",
		// 		},
		// 	})
		// }

		// nav items for right button group
		const navListRight2: INav[] = [
			{
				icon: <EyeIcon />,
				authRequired: true,
				href: "/peek-at-me",
				bubble: {
					counter: peekCount || 0,
					position: "left",
					variant: "no-brackets",
				},
				id: "icon_button_eye",
			},
			// dialogNav,
		]

		const navChatListLeft2: INav[] = []

		if (chat && chat.filter) {
			navChatListLeft2.push({
				icon: <FilterWithoutLupaIcon />,
				authRequired: false,
				id: "icon_button_filter",
				bubble: {
					counter: (chat && chat.filter && chat.filter.counter) || 0,
					position: "right",
					variant: "clear",
				},
				callback:
					(chat && chat.filter && chat.filter.drawer) || (() => {}),
			})
		}

		// chat header create group nav item
		const chatGroupNav = {
			icon: <CreateGroupIcon />,
			authRequired: false,
			href: "/chat/create-group",
			id: "icon_button_create_group",
		}

		// if (chat && chat.group && chat.group.counter > 0) {
		// 	Object.assign(chatGroupNav, {
		// 		bubble: {
		// 			counter: chat.group.counter,
		// 			position: "left",
		// 		},
		// 	})
		// }

		// chat header nav list
		const navChatListRight2: INav[] = [chatGroupNav]

		setNavListLeft(navListLeft2)
		setNavListRight(navListRight2)
		setNavChatListLeft(navChatListLeft2)
		setNavChatListRight(navChatListRight2)
	}, [
		chat,
		commonChatUnreadCount,
		filterCount,
		path,
		peekCount,
		filterAvailableCount,
	])

	useEffect(() => {
		generateNav()
	}, [filterCount, peekCount, commonChatUnreadCount, filterAvailableCount])

	return (
		<>
			{chat ? (
				<Header
					buttonGroupLeft={
						<Nav navList={navChatListLeft} auth={auth} />
					}
					buttonGroupRight={
						<Nav navList={navChatListRight} auth={auth} />
					}
					textInCenter={t("site.Chat")}
				/>
			) : (
				<Header
					buttonGroupLeft={<Nav navList={navListLeft} auth={auth} />}
					buttonGroupRight={
						<Nav navList={navListRight} auth={auth} />
					}
				/>
			)}
		</>
	)
}

export default AppHeader
