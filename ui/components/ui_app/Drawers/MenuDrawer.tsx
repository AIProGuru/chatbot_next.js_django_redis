import Image from 'next/image'
import styles from "./MenuDrawer.module.scss"
import Drawer from "@/components/ui/Drawer/Drawer/Drawer"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import ArrowIcon from "@/components/ui/Icons/ArrowIcon"
import ProgressBar from "@/components/ui/Forms/Inputs/InProgressBar/ProgressBar"
import Divider from "@/components/ui/Divider/Divider"
import Link from "@/components/ui/Button/Link/Link"
import {TFunction, useTranslation} from "next-i18next"
import InternetIcon from "@/components/ui/Icons/InternetIcon/InternetIcon"
import {useRouter} from "next/router"
import React, {useMemo} from "react"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {cc} from "@/components/ui/Functions/Classnames"
import {onBeforeLogout} from "@/components/ui/Functions/Logout"
import {toggleBodyScroll} from "@/components/ui/Functions/BodyScrollLock"
import {useAuth} from "@/components/auth/AuthProvider"
import Button from "@/components/ui/Button/Button/Button"

interface MenuDrawerProps {
	openMenu: boolean
	setOpenMenu: Function
	trigger: boolean
	userProfilesData: any
	openProfileSwitchDrawer: Function
	getProfileImage: Function
	toggleLanguageDrawer: Function
	profileProgress: number | undefined
}

type Menu = {
	label: string
	id: string
	href?: string
	onClick?: Function
	show: boolean
}

const getPageTranslations = (t: TFunction) => {
	return {}
}

export const getLangTranslations = (t: TFunction): any => {
	return {
		languages: {
			en: "English",
			ru: "Русский",
			he: "עברית",
		},
	}
}

function MenuDrawer(props: MenuDrawerProps) {
	const {
		openMenu,
		setOpenMenu,
		trigger,
		userProfilesData,
		openProfileSwitchDrawer,
		getProfileImage,
		profileProgress,
		toggleLanguageDrawer,
	} = props
	const {t} = useTranslation("site")
	const router = useRouter()
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])
	const langTranslations = useMemo(() => {
		return getLangTranslations(t)
	}, [t])
	const dir = getDirection(router)
	const auth = useAuth() || false

	const path = router.pathname

	const menuList: Menu[] = [
		// {
		// 	label: t("site.Parties"),
		// 	id: "menu_button_parties",
		// 	href: "/events",
		// 	show: !!auth,
		// },
		{
			label: t("site.Available today"),
			id: "menu_button_available_today",
			href: "/available-today",
			show: !!auth,
		},
		{
			label: t("site.Edit current profile"),
			id: "menu_button_edit_profile",
			href: "/profiles/my/edit",
			show: !!auth,
		},
		{
			label: t("site.Alert management"),
			id: "menu_button_notify_manager",
			href: "/profiles/my/notification-manager",
			show: !!auth,
		},
		{
			label: t("site.The SWINGERS blog"),
			id: "menu_button_swingers_blog",
			href: "/blogs",
			show: true,
		},
		{
			label: t("site.The SWINGERS forum"),
			id: "menu_button_swingers_forum",
			href: "/forum",
			show: true,
		},
		{
			label: t("site.SWINGERS Magazine"),
			id: "menu_button_swingers_magazine",
			href: "/articles",
			show: true,
		},
		{
			label: t("site.Talk to us"),
			id: "menu_button_contact-us",
			href: "/pages/contact-us/contact",
			show: true,
		},
		{
			label: t("site.Subscriptions"),
			id: "menu_button_subscription",
			href: "/profiles/my/subscriptions",
			show: !!auth,
		},
		{
			label: t("site.Terms of Use"),
			id: "menu_button_privacy",
			href: "/pages/privacy",
			show: true,
		},
		{
			label: t("site.Log out"),
			id: "menu_button_logout",
			// href: "/auth/logout",
			onClick: () => {
				onBeforeLogout(router)
			},
			show: !!auth,
		},
	]

	// get current profile nickname for right side nav
	function getCurrentProfileNickname(allProfiles: any, id: number): string {
		const searchCurrentProfile = allProfiles.find((s: any) => s.id === id)
		if (searchCurrentProfile) {
			switch (searchCurrentProfile.profile_type) {
				case "MAN":
					const manNick = searchCurrentProfile.man?.nickname || "-"
					return manNick && manNick.length > 8
						? `${manNick.slice(0, 8)}...`
						: manNick

				case "WOMAN":
					const womanNick =
						searchCurrentProfile.woman?.nickname || "-"
					return womanNick && womanNick.length > 8
						? `${womanNick.slice(0, 8)}...`
						: womanNick

				case "COUPLE":
					const coupleNick =
						searchCurrentProfile.couple_nickname || "-"
					return coupleNick && coupleNick.length > 8
						? `${coupleNick.slice(0, 8)}...`
						: coupleNick

				default:
					return "-"
			}
		}

		return "-"
	}

	// get current site language
	function getCurrentSiteLanguage() {
		const lang: string = router.locale || "en"
		return langTranslations.languages[lang]
	}

	return (
		<Drawer
			show={openMenu}
			setShow={setOpenMenu}
			position={dir === "ltr" ? "left" : "right"}
			trigger={trigger}
		>
			<div dir={dir} className={cc([styles.MenuContainer, dir && styles[dir]])}>
				{auth && (
					<>
						<div className={styles.MenuHeader} style={{direction: dir === "ltr" ? "ltr" :  "rtl"}}>
							<div
								onClick={() => {
									openProfileSwitchDrawer()
								}}
								className={styles.ProfileInfo}
							>
								<div className={styles.Avatar}>
									{userProfilesData &&
										userProfilesData.profiles &&
										userProfilesData.current_profile_id && (
											<Image
											src={getProfileImage(
												userProfilesData.profiles,
												userProfilesData.current_profile_id
												)}
											alt=""
											width={500}
											height={500}
											/>
										)}
								</div>
								{userProfilesData &&
								userProfilesData.profiles &&
								userProfilesData.current_profile_id ? (
									<p>
										{getCurrentProfileNickname(
											userProfilesData.profiles,
											userProfilesData.current_profile_id
										)}
									</p>
								) : (
									<p>-</p>
								)}
								<TransparentButton icon={<ArrowIcon />} />
							</div>

							<div
								onClick={() => {
									toggleLanguageDrawer(true)
								}}
								className={styles.LanguageContainer}
							>
								<div className={styles.Icon}>
									<InternetIcon />
								</div>
								<div className={styles.CurrentLang}>
									<p>{getCurrentSiteLanguage()}</p>
								</div>
								<TransparentButton icon={<ArrowIcon />} />
							</div>
						</div>
						{profileProgress && (
							<div className={styles.ProgressContainer}>
								<ProgressBar
									valueLength={profileProgress}
									textInTop={t(
										"site.Complete the profile now and get more inquiries"
									)}
								/>
							</div>
						)}
					</>
				)}

				{!auth && (
					<div className={styles.MenuHeader}>
						<div className={styles.Action}>
							<Button
								type={"button"}
								prevent={true}
								background={"gray"}
								id={"button_open_location_drawer"}
								fullWidth={true}
								onClick={() => {
									router.push("/auth/signin").then(() => {
										toggleBodyScroll(false)
									})
								}}
							>
								<p className={styles.ButtonSignIn}>
									{t("site.Sign in Sign up")}
								</p>
							</Button>
						</div>

						<div
							onClick={() => {
								toggleLanguageDrawer(true)
							}}
							className={styles.LanguageContainer}
						>
							<div className={styles.Icon}>
								<InternetIcon />
							</div>
							<div className={styles.CurrentLang}>
								<p>{getCurrentSiteLanguage()}</p>
							</div>
							<TransparentButton icon={<ArrowIcon />} />
						</div>
					</div>
				)}

				<Divider />
				<div className={styles.MenuList}>
					{menuList.map((item: Menu) => (
						<React.Fragment key={item.id}>
							{item.show && (
								<div key={item.id} className={styles.Menu}>
									<Link
										onClick={() => {
											if (item.onClick) {
												toggleBodyScroll(false)
												item.onClick && item.onClick()
											}
											if (item.href) {
												if (item.href === path) {
													setOpenMenu(false)
													toggleBodyScroll(false)
												} else {
													router
														.push(item.href)
														.then(() => {
															toggleBodyScroll(
																false
															)
														})
												}
											}
										}}
									>
										<p>{item.label}</p>
									</Link>
									<Divider />
								</div>
							)}
						</React.Fragment>
					))}
				</div>
			</div>
		</Drawer>
	)
}

export default MenuDrawer
