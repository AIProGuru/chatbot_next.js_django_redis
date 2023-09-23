import TabBar from "@/components/ui/TabBar/TabBar"
import TabBarButton from "@/components/ui/Button/TabBarButton/TabBarButton"
import StarIcon from "@/components/ui/Icons/StarIcon"
import RabbitIcon from "@/components/ui/Icons/RabbitIcon"
import MenuIcon from "@/components/ui/Icons/MenuIcon"
import {useAuth} from "@/components/auth/AuthProvider"
import {useRouter} from "next/router"
import {useTranslation} from "next-i18next"
import DialogIcon from "@/components/ui/Icons/DialogIcon"
import {useCallback, useEffect, useState} from "react"
import {BubbleProps} from "@/components/ui/Bubble/Bubble"

interface AppTabBarProps {
	openMenu: boolean
	setOpenMenu: any
	commonChatUnreadCount?: number
}

type Nav = {
	icon: JSX.Element
	label: string
	authRequired: boolean
	id: string
	href: string | boolean
	active?: boolean
	bubble?: BubbleProps
}

function AppTabBar(props: AppTabBarProps) {
	const {openMenu, setOpenMenu, commonChatUnreadCount} = props
	const router = useRouter()
	const pathname = router.asPath
	const {t} = useTranslation("site")

	// is user authorized
	const auth = useAuth() || false
	const [navList, setNavList] = useState<Nav[]>([])

	const getUnreadCount = useCallback(() => {
		return commonChatUnreadCount
	}, [commonChatUnreadCount])

	// array of nav items
	const generateNav = () => {
		const dialogNav = {
			icon: <DialogIcon />,
			label: t("site.Chats"), //Favorits button
			authRequired: true,
			id: "tab_bar_button_chat",
			href: "/chat",
			active: pathname.split("/").includes("chat"), //["/chat/list"].includes(pathname),
		}

		if (commonChatUnreadCount && commonChatUnreadCount > 0) {
			Object.assign(dialogNav, {
				bubble: {
					counter: getUnreadCount(),
					position: "left",
					variant: "tab-bar",
				},
			})
		}

		const menuNav = {
			icon: <MenuIcon />,
			label: t("site.menu_button"),
			authRequired: false,
			id: "tab_bar_button_menu",
			// href: auth ? true : "/auth/signin",
			href: true,
			active: openMenu === true,
		}

		const navList2: Nav[] = [
			// {
			// 	icon: <WineIcon />,
			// 	label: t("site.Parties"), //Parties button
			// 	authRequired: false,
			// 	id: "tab_bar_button_wine",
			// 	href: "/events",
			// 	active: pathname === "/events",
			// },
			{
				icon: <RabbitIcon />,
				label: t("site.Main"), //Online button
				authRequired: false,
				id: "tab_bar_button_rabbit",
				href: "/",
				active: pathname === "/",
			},
			{
				icon: <StarIcon />,
				label: t("site.Favorites"), //Favorits button
				authRequired: true,
				id: "tab_bar_button_start",
				href: "/favorites",
				active: pathname.split("/").includes("favorites"), //["/favorites", "/favorites"].includes(pathname),
			},
			// {
			// 	icon: <DialogIcon />,
			// 	label: "Chat", //Favorits button
			// 	authRequired: true,
			// 	id: "tab_bar_button_chat",
			// 	href: "/chat/list",
			// 	active: pathname.split("/").includes("chat"), //["/chat/list"].includes(pathname),
			// },
			// {
			// 	icon: <MenuIcon />,
			// 	label: t("site.menu_button"),
			// 	authRequired: false,
			// 	id: "tab_bar_button_menu",
			// 	// href: auth ? true : "/auth/signin",
			// 	href: true,
			// 	active: openMenu === true,
			// },
		]

		navList2.push(dialogNav)
		navList2.push(menuNav)

		setNavList(navList2)
	}

	useEffect(() => {
		generateNav()
	}, [commonChatUnreadCount])

	// component
	return (
		<TabBar>
			{navList &&
				navList.map((nav: Nav, index: number) => {
					if (nav.authRequired && !auth) return null

					return (
						<TabBarButton
							icon={nav.icon}
							label={nav.label}
							key={index}
							id={nav.id}
							onClick={() => {
								typeof nav.href === "string"
									? router.push(nav.href)
									: setOpenMenu(nav.href)
							}}
							active={nav.active ? nav.active : false}
							bubble={nav.bubble}
						/>
					)
				})}
		</TabBar>
	)
}

export default AppTabBar
