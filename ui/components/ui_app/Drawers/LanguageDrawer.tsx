import SwitchProfileItem from "@/components/ui/Drawer/SwitchProfile/SwitchProfileItem"
import Drawer from "@/components/ui/Drawer/Drawer/Drawer"
import React, {useMemo} from "react"
import {TFunction, useTranslation} from "next-i18next"
import {useRouter} from "next/router"
import {getLangTranslations} from "@/components/ui_app/Drawers/MenuDrawer"
import {lsSetItem} from "@/components/ui/Functions/AppLocalStorage"

interface LanguageDrawerProps {
	languageDrawer: boolean
	toggleLanguageDrawer: Function
}

const getPageTranslations = (t: TFunction) => {
	return {
		drawer: {
			title: t("site.Change language"),
		},
	}
}

type Language = {
	code: string
	title: string
}

function LanguageDrawer(props: LanguageDrawerProps) {
	const {languageDrawer, toggleLanguageDrawer} = props
	const {t} = useTranslation("site")
	const router = useRouter()
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])
	const langTranslations = useMemo(() => {
		return getLangTranslations(t)
	}, [t])

	function getLanguages(): Language[] {
		const locales = router.locales || []
		return locales.map((el: string) => {
			return {
				code: el,
				title: langTranslations.languages[el],
			}
		})
	}

	function applyLanguage(code: string) {
		lsSetItem("language", code)
		router.reload()
	}

	return (
		<>
			<Drawer
				show={languageDrawer}
				setShow={() => {
					toggleLanguageDrawer(false)
				}}
				position={"bottom"}
				trigger={false}
				title={pageTranslations.drawer.title}
			>
				<div className="SwitchProfileContainer">
					{getLanguages().map((lang: Language) => {
						return (
							<SwitchProfileItem
								key={lang.code}
								title={lang.title}
								onClick={() => {
									applyLanguage(lang.code)
								}}
							/>
						)
					})}
				</div>
			</Drawer>
		</>
	)
}

export default LanguageDrawer
