import "@/styles/global.scss"
import "@/styles/styles.scss"
import React, {useEffect} from "react"
import {Provider} from "react-redux"
import AuthGuard from "../components/auth/AuthGuard"
import {store, wrapper} from "@/redux/store"
import {AppLayoutProps} from "next/app"
import {useRouter} from "next/router"
import axiosInstance from "../app/axiosInstance"
import {useTranslation} from "next-i18next"
import {appWithTranslation} from "next-i18next"
import Head from "next/head"
import getConfig from "next/config"
import Script from "next/script"
import {pageview} from "@/components/ui/Functions/GoogleAnalytics"
import {DefaultSeo} from "next-seo"
import {lsGetItemString} from "@/components/ui/Functions/AppLocalStorage"
import dynamic from "next/dynamic"
const DynamicModalApp = dynamic(
	() => import("@/components/Dynamic/Modal/Modal")
)
const DynamicProfile = dynamic(
	() => import("@/components/ui_pages/Profile/Profile")
)
const DynamicChatDialog = dynamic(() => import("./chat/conversation/[uid]"))

// trychat
import {tryClient, TryContext} from "@/TryChat/TryContext"
import AppReduxWrapper from "@/components/AppReduxWrapper"
import {isDevMode} from "@/components/ui/Functions/IsDevMode"

if (process.env.NODE_ENV !== "development") {
	console.log = console.warn = console.error = () => {}
}

if (isDevMode()) {
	if (typeof window !== "undefined") {
		// @ts-ignore
		window["fbq"] = (a: any, b: any) => {
			// console.log("fbq", a, b)
		}
	}
}


function MyApp({
	Component,
	pageProps: {session, ...pageProps},
}: AppLayoutProps) {
	const {publicRuntimeConfig} = getConfig()
	const router = useRouter()
	// const {uid} = router.query || ""
	const {t} = useTranslation("site")
	const measurementKey = publicRuntimeConfig?.measurementClientKey || ""
	const baseUrl = publicRuntimeConfig?.baseUrl || ""
	const requireAuth = Component.requireAuth || false
	const language = lsGetItemString("language")

	useEffect(() => {
		const {common} = axiosInstance.defaults.headers || {}
		// @ts-ignore
		common["Accept-Language"] = language ? language : "he"
	}, [router])

	useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector("#jss-server-side")
		if (jssStyles) {
			jssStyles.parentElement &&
				jssStyles.parentElement.removeChild(jssStyles)
		}
	}, [])

	useEffect(() => storePathValues, [router.asPath])

	function storePathValues() {
		const storage = globalThis?.sessionStorage
		if (!storage) return
		// Set the previous path as the value of the current path.
		const prevPath = storage.getItem("currentPath")
		storage.setItem("prevPath", prevPath || "")
		// Set the current path value by looking at the browser's location object.
		storage.setItem("currentPath", globalThis.location.pathname)
	}

	const handleLocaleChange = () => {
		const {pathname, query, asPath} = router
		if (router.isReady) {
			if (language && router?.locales?.includes(language)) {
				// router.replace(router.pathname, router.pathname, {locale: language})
				router
					.replace({pathname, query}, asPath, {
						locale: language,
					})
					.then()
			} else {
				// router.replace(router.pathname, router.pathname, {locale: "he"})
				router.replace({pathname, query}, asPath, {locale: "he"}).then()
			}
			document
				.querySelector("html")
				?.setAttribute("dir", router.locale === "he" ? "rtl" : "ltr")
		}
	}

	useEffect(() => {
		handleLocaleChange()
	}, [])

	useEffect(() => {
		const handleRouteChange = (url: any) => {
			pageview(url, measurementKey)
		}

		router.events.on("routeChangeComplete", handleRouteChange)
		return () => {
			router.events.off("routeChangeComplete", handleRouteChange)
		}
	}, [router.events])

	return (
		<div className="Mobile">
			<TryContext.Provider value={tryClient}>
				<Provider store={store}>
					<AppReduxWrapper>
						<Head>
							<meta
								name="viewport"
								content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
							/>
							<meta name="referrer" content="origin" />
							{router.locales &&
								router.locales
									.filter((loc) => loc !== router.locale)
									.map((loc, index) => (
										<link
											key={index}
											rel="alternate"
											href={`${baseUrl}/${loc}${router.asPath}`}
											hrefLang={loc}
										/>
									))}
						</Head>
						<Script
							src={`https://www.googletagmanager.com/gtag/js?id=${measurementKey}`}
							strategy="afterInteractive"
							async={true}
							defer={true}
						/>
						<Script
							id="google-analytics"
							strategy="afterInteractive"
							async={true}
							defer={true}
						>
							{`
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', '${measurementKey}');
					`}
						</Script>
						<Script
							id="google"
							strategy="afterInteractive"
							async={true}
							defer={true}
						>
							{`
							(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
							new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
							j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
							'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
							})(window,document,'script','dataLayer','GTM-K3R4CPK');
					`}
						</Script>

						<DefaultSeo
							defaultTitle="Swingers"
							openGraph={{
								type: "website",
								url: `${baseUrl}/${t("site.en")}`,
								title: t(
									"site.Couples exchanges in Israel Couples Exchange Parties Swingers"
								),
								description: t(
									"site.Couples Exchange The Swingers website is the leading and largest"
								),
								site_name: "Swingers",
								locale: t("site.en_US"),
								images: [
									{
										url: `${baseUrl}/seo.jpg`,
										width: 217,
										height: 49,
										alt: "swingers logo",
									},
								],
							}}
						/>

						<DynamicModalApp
							isOpen={!!router.query.profile_list_uid}
							component={
								<DynamicProfile
									modalProfileID={
										router.query.profile_list_uid
									}
								/>
							}
						/>

						{router.query.chat_id &&
							!Array.isArray(router.query.chat_id) && (
								<DynamicModalApp
									isOpen={!!router.query.chat_id}
									component={
										<DynamicChatDialog
											modalChatID={router.query.chat_id}
											// closeModal={toggleChatModal}
										/>
									}
								/>
							)}

						{/*<DynamicModalApp*/}
						{/*	isOpen={!!router.query.trychat_conversation_id}*/}
						{/*	component={*/}
						{/*		<ConversationPage*/}
						{/*			modalChatID={*/}
						{/*				router.query.trychat_conversation_id*/}
						{/*			}*/}
						{/*		/>*/}
						{/*	}*/}
						{/*/>*/}

						{requireAuth ? (
							<AuthGuard>
								<Component {...pageProps} />
							</AuthGuard>
						) : (
							<Component {...pageProps} />
						)}
					</AppReduxWrapper>
				</Provider>
			</TryContext.Provider>
		</div>
	)
}

export default appWithTranslation(wrapper.withRedux(MyApp))
//
