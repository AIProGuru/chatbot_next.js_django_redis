import {useAuth} from "@/components/auth/AuthProvider"
// import AfterLoginPage from "./ui/Main/AfterLogin"
// import BeforeLoginPage from "./profiles/BeforeLogin"
import getConfig from "next/config"
import {useRouter} from "next/router"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import {NextSeo} from "next-seo"
import Head from "next/head"
import React, {useEffect, useState} from "react"
// import SplashScreen from "@/components/ui/Splash/SplashScreen"
/// import {useIsSSR} from "@/components/ui/Functions/useIsSSR"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"

import Button from "@/components/ui/Button/Button/Button"

import dynamic from "next/dynamic"
const DynamicBeforeLogin = dynamic(() => import("./profiles/BeforeLogin"))
const DynamicAfterLogin = dynamic(() => import("./ui/Main/AfterLogin"))

const {publicRuntimeConfig} = getConfig()

function IndexPage() {
	const router = useRouter()
	const {t} = useTranslation("site")
	const auth = useAuth()
	const baseUrl = publicRuntimeConfig?.baseUrl || ""

	const userProfilesData = useGetUserProfilesInfo()

	useEffect(() => {
		if (userProfilesData.freeze) {
			router.push(`/auth/freeze`).then(() => {
				router.reload()
			})
		}
	}, [userProfilesData.freeze])

	let showRegister;
	
	if (
		!!userProfilesData.register
		&& userProfilesData.register > 0
		&& userProfilesData.register < 7
	) {
		//path = `/auth/signup/${userProfileInfo.current_profile_id ?? '0' }/step/${userProfileInfo.register}`;
		showRegister = true;
	}
	else{
		showRegister = false;
	}


	const schemaDataWebPage = {
		"@context": "https://schema.org",
		potentialAction: [
			{"@type": "ReadAction", target: `${baseUrl}/${t("site.en")}/`},
		],
		"@graph": [
			{
				"@type": "BreadcrumbList",
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: t("homepage"),
						item: `${baseUrl}/${t("site.en")}/`,
					},
					{
						"@type": "ListItem",
						position: 2,
						name: t("Contact us"),
						item: `${baseUrl}/${t("site.en")}/pages/contact-us`,
					},
					{
						"@type": "ListItem",
						position: 2,
						name: t("site.The SWINGERS blog"),
						item: `${baseUrl}/${t("site.en")}/blogs`,
					},
					{
						"@type": "ListItem",
						position: 2,
						name: t("site.SWINGERS Magazine"),
						item: `${baseUrl}/${t("site.en")}/articles`,
					},
					{
						"@type": "ListItem",
						position: 2,
						name: t("site.The SWINGERS forum"),
						item: `${baseUrl}/${t("site.en")}/forum`,
					},
					{
						"@type": "ListItem",
						position: 3,
						name: "התחברו לעולם הסווינגרס",
						item: `${baseUrl}/${t("site.en")}/auth/signin`,
					},
					{
						"@type": "ListItem",
						position: 3,
						name: "הרשמו לעולם הסווינגרס",
						item: `${baseUrl}/${t("site.en")}/auth/signup`,
					},
				],
			},
			{
				"@type": "Organization",
				"@id": `${baseUrl}#organization`,
				name: "סיוונגרס חילופי זוגות",
				url: `${baseUrl}`,
				email: "webmaster@swingers.co.il",
				logo: {
					"@type": "ImageObject",
					url: `${baseUrl}/seo.jpg`,
					width: "217",
					height: "49",
					caption: "Swingers logo",
				},
				description:
					"אתר סווינגרס הינו האתר המוביל והגדול ביותר לסצנת חילופי הזוגות בישראל. היכנסו לאתר להצטרף לקהילת חילופי הזוגות האיכותית שלנו",
				contactPoint: {
					"@type": "ContactPoint",
					contactType: "customer support",
					telephone: "+972 50-534-5050",
					email: "webmaster@swingers.co.il",
				},
			},
			{
				"@type": "WebSite",
				"@id": `${baseUrl}/#website`,
				url: `${baseUrl}`,
				name: "סיוונגרס חילופי זוגות",
				publisher: {"@id": `${baseUrl}/#organization`},
			},
			{
				"@type": "WebPage",
				"@id": `${baseUrl}/${t("site.en")}/#webpage`,
				isPartOf: {"@id": `${baseUrl}/#website`},
				url: `${baseUrl}/${t("site.en")}/`,
				name: "סיוונגרס חילופי זוגות",
				description: "דף הבית",
			},
			{
				"@type": "WebPage",
				"@id": `${baseUrl}/${t("site.en")}/#WebPage`,
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": `${baseUrl}/${t("site.en")}/#webpage`,
				},
				image: [
					{
						"@type": "ImageObject",
						url: `${baseUrl}/seo.jpg`,
						height: "304",
						width: "270",
						caption: "Swingers bunny logo",
					},
				],
				headline: "דף הבית",
				copyrightYear: "2022",
				name: "סיוונגרס חילופי זוגות",
				inLanguage: t("site.en_US"),
				keywords: "סיוונגרס, חילופי זוגות, החלפת זוגות ,מסיבות",
				description:
					"אתר סווינגרס הינו האתר המוביל והגדול ביותר לסצנת חילופי הזוגות בישראל. היכנסו לאתר להצטרף לקהילת חילופי הזוגות האיכותית שלנו",
			},
			{
				"@type": "WebPage",
				"@id": `${baseUrl}/${t("site.en")}/pages/contact-us/#webpage`,
				isPartOf: {"@id": `${baseUrl}/#website`},
				url: `${baseUrl}/${t("site.en")}/pages/contact-us/`,
				name: "צור קשר",
				description: "טופס יצירת קשר",
			},
			{
				"@type": "ContactPage",
				"@id": `${baseUrl}/${t(
					"site.en"
				)}/pages/contact-us/#ContactPage`,
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": `${baseUrl}/${t(
						"site.en"
					)}/pages/contact-us/#webpage`,
				},
				image: [
					{
						"@type": "ImageObject",
						url: `${baseUrl}/seo.jpg`,
						height: "217",
						width: "49",
						caption: "Swingers logo",
					},
					{
						"@type": "ImageObject",
						url: `${baseUrl}/favicon.ico`,
						height: "217",
						width: "49",
						caption: "Swingers favicon",
					},
				],

				headline: "צור קשר",
				copyrightYear: "2022",
				name: "סיוונגרס חילופי זוגות",
				inLanguage: t("site.en_US"),
				keywords: "סיוונגרס, חילופי זוגות, החלפת זוגות ,מסיבות",
				description:
					"אתר סווינגרס הינו האתר המוביל והגדול ביותר לסצנת חילופי הזוגות בישראל. היכנסו לאתר להצטרף לקהילת חילופי הזוגות האיכותית שלנו",
			},
			{
				"@type": "WebPage",
				"@id": `${baseUrl}/${t("site.en")}/forum/#webpage`,
				isPartOf: {"@id": `${baseUrl}/#website`},
				url: `${baseUrl}/${t("site.en")}/forum`,
				name: "הפורומים של סווינגרס",
				description:
					"בפורום של סווינגרס, אתם יכולים להעלות שאלות, תהיות ונושאים שתרצו לשתף או סתם לשמוע מה אחרים חושבים על זה",
			},
			{
				"@type": "BlogPosting",
				"@id": `${baseUrl}/${t("site.en")}/forum/#forum`,
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": `${baseUrl}/${t("site.en")}/forum/#webpage`,
				},
				image: [
					{
						"@type": "ImageObject",
						url: `${baseUrl}/seo.jpg`,
						height: "217",
						width: "49",
						caption: "Swingers logo",
					},
				],
				headline: "הפורומים של סווינגרס",
				copyrightYear: "2022",
				name: "סיוונגרס חילופי זוגות",
				inLanguage: t("site.en_US"),
				keywords: "סיוונגרס, חילופי זוגות, החלפת זוגות ,מסיבות",
				description:
					"בפורום של סווינגרס, אתם יכולים להעלות שאלות, תהיות ונושאים שתרצו לשתף או סתם לשמוע מה אחרים חושבים על זה",
			},
			{
				"@type": "WebPage",
				"@id": `${baseUrl}/${t("site.en")}/blogs/#webpage`,
				isPartOf: {"@id": `${baseUrl}/#website`},
				url: `${baseUrl}/${t("site.en")}/blogs`,
				name: "סווינגרס בלוג",
				description:
					"הבלוגים החמים של אתר סווינגרס כל מה שצריך לדעת על עולם חילופי הזוגות",
			},
			{
				"@type": "BlogPosting",
				"@id": `${baseUrl}/${t("site.en")}/blogs/#BlogPosting`,
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": `${baseUrl}/${t("site.en")}/blogs/#webpage`,
				},
				image: [
					{
						"@type": "ImageObject",
						url: `${baseUrl}/seo.jpg`,
						height: "217",
						width: "49",
						caption: "Swingers logo",
					},
				],
				headline: "סווינגרס בלוג",
				copyrightYear: "2022",
				name: "סיוונגרס חילופי זוגות",
				inLanguage: t("site.en_US"),
				keywords: "סיוונגרס, חילופי זוגות, החלפת זוגות ,מסיבות",
				description:
					"הבלוגים החמים של אתר סווינגרס כל מה שצריך לדעת על עולם חילופי הזוגות",
			},
			{
				"@type": "WebPage",
				"@id": `${baseUrl}/${t("site.en")}/auth/signup/#webpage`,
				isPartOf: {"@id": `${baseUrl}/#website`},
				url: `${baseUrl}/${t("site.en")}/auth/signup/`,
				name: "הרשם לעולם הסווינגרס",
				description:
					"הרשמו לאתר סווינגרס, עולם הפנטזיות והבית של קהילה החלפת זוגות סווינגרס הינו האתר המוביל והגדול ביותר לסצנת חילופי הזוגות בישראל ",
			},
			{
				"@type": "RegisterAction",
				"@id": `${baseUrl}/${t("site.en")}/auth/signup/#RegisterAction`,
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": `${baseUrl}/${t("site.en")}/auth/signup/#webpage`,
				},
				image: [
					{
						"@type": "ImageObject",
						url: `${baseUrl}/seo.jpg`,
						height: "217",
						width: "49",
						caption: "Swingers logo",
					},
				],
				name: "טופס רישום לאתר סווינגרס",
				description:
					"הרשמו לאתר סווינגרס, עולם הפנטזיות והבית של קהילה החלפת זוגות סווינגרס הינו האתר המוביל והגדול ביותר לסצנת חילופי הזוגות בישראל",
			},
			{
				"@type": "WebPage",
				"@id": `${baseUrl}/${t("site.en")}/articles/#webpage`,
				isPartOf: {"@id": `${baseUrl}/#website`},
				url: `${baseUrl}/${t("site.en")}/articles`,
				name: "מגזין סווינגרס",
				description:
					"כתבות, מאמרים, טיפים, שאלות ותשובות וכללי התנהגות בעולם הסווינגרס וחילופי הזוגות",
			},
			{
				"@type": "NewsArticle",
				"@id": `${baseUrl}/${t("site.en")}/articles/#NewsArticle`,
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": `${baseUrl}/${t("site.en")}/articles/#webpage`,
				},
				image: [
					{
						"@type": "ImageObject",
						url: `${baseUrl}/seo.jpg`,
						height: "217",
						width: "49",
						caption: "Swingers logo",
					},
				],
				headline: "מגזין סווינגרס",
				name: "מגזין סיוונגרס חילופי זוגות",
				description:
					"כתבות, מאמרים, טיפים, שאלות ותשובות וכללי התנהגות בעולם הסווינגרס וחילופי הזוגות",
				copyrightYear: "2022",
				inLanguage: t("site.en_US"),
				keywords: "סיוונגרס, חילופי זוגות, החלפת זוגות ,מסיבות",
			},
		],
	}

	const SEO = (
		<>
			<NextSeo
				title={t(
					"site.Couples exchanges in Israel Couples Exchange Parties Swingers"
				)}
				description={t(
					"site.Couples Exchange The Swingers website is the leading and largest"
				)}
				openGraph={{
					type: "website",
					url: `${baseUrl}/`,
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
							alt: t("site.Swingers logo"),
						},
					],
				}}
			/>
			<Head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(schemaDataWebPage),
					}}
				/>
			</Head>
		</>
	)

	// const ssr = useIsSSR()
	// const [isLoading, setIsLoading] = useState(true)
	// const [showSplash, setShowSplash] = useState(true)
	const [pageReady, setPageReady] = useState(false)

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setPageReady(true)
		}, 100)

		return () => {
			clearTimeout(timeoutId);
		};

	}, [auth])

	return (
		<>
			{SEO}
			{pageReady && (
				<>{auth ? <DynamicAfterLogin /> : <DynamicBeforeLogin />}</>
			)}
			<>{auth ? 
			<div
			className="ForceRegisterPopup"
			style={{display: showRegister ? "block" : "none"}}
			>
				<div
					className="RequestImagesPopup"
					style={{display:'block'}}
				>
					<div className="RequestImages" >
						
						<p>
							{t("site.Force_Register_Message")}{" "}
						</p>
						<div className="Actions">
							 <Button
								type={"button"}
								mode={"submit"}
								prevent={false}
								fullWidth={true}
								onClick={() =>
									router && router.push(`/auth/signup/${userProfilesData.current_profile_id ?? '0' }/step/${userProfilesData.register}`).then(() => {
										//resetLoading && resetLoading(false)
										router.reload()
									})
								}
							>
								<p className="AcceptButtonText">
									{t("site.Force_Register_Button")}
								</p>
							</Button>
						</div>
					</div>
				</div>					
			</div> : <></>}</>
				
		</>
		
	)
}

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default IndexPage
