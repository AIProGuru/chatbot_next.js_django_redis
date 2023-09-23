import styles from "./Footer.module.scss"
// import Logotype from "@/components/ui/Header/Logotype"
import {useTranslation} from "next-i18next"
import {useRouter} from "next/router"
import getConfig from "next/config"
import {lsGetItemString} from "../Functions/AppLocalStorage"

const {publicRuntimeConfig} = getConfig()

function Footer() {
	const {t} = useTranslation("site")
	const router = useRouter()

	const baseUrl = publicRuntimeConfig?.baseUrl || ""
	const language = lsGetItemString("language")

	const menu = [
		{
			name: t("site.The SWINGERS blog"),
			link: "/blogs",
		},
		{
			name: t("site.The SWINGERS forum"),
			link: "/forum",
		},
		{
			name: t("site.SWINGERS Magazine"),
			link: "/articles",
		},
		{
			name: t("site.signin"), // login
			link: "/auth/signin",
		},
		{
			name: t("site.signup"), // signup
			link: "/auth/signup",
		},
		{
			name: t("site.Contact us"),
			link: "/pages/contact-us/contact",
		},
		{
			name: t("site.Terms of Use"),
			link: "/pages/privacy",
		},
	]

	const loc = language ? language : "he"

	return (
		<div className={styles.Footer}>
			<div className={styles.Menu}>
				{menu.slice(0, 3).map((item, index) => (
					<div key={index}>
						<a href={baseUrl + `/${loc}` + item.link}>
							{item.name}
						</a>
					</div>
				))}
			</div>
			<div className={styles.Menu}>
				{menu.slice(3, 6).map((item, index) => (
					<div key={index}>
						<a href={baseUrl + `/${loc}` + item.link}>
							{item.name}
						</a>
					</div>
				))}
			</div>
			<div className={styles.Menu}>
				<div>
					<a href={baseUrl + `/${loc}` + menu[6].link}>
						{menu[6].name}
					</a>
				</div>
			</div>
		</div>
	)
}

export default Footer
