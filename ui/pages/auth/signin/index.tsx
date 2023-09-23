import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import React, {useState} from "react"
import {useRouter} from "next/router"
import Logotype from "@/components/ui/Header/Logotype"
import SignInEmailUsername from "@/components/ui/auth/SignInEmailUsername"
import SignInPhone from "@/components/ui/auth/SignInPhone"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import getConfig from "next/config"
import {NextSeo} from "next-seo"
import Head from "next/head"
import NoAuthLayout from "@/components/ui_app/AppLayouts/NoAuthLayout"
import TryTabs from "@/components/ui/Tabs/TryTabs/TryTabs"
import {TryTabButtonVariants} from "@/components/ui/Tabs/TryTabs/TryTabButton/TryTabButton"

const {publicRuntimeConfig} = getConfig()

function AuthSignInIndexPage(props: any) {
	const {t} = useTranslation("site")
	const router = useRouter()
	const captchaKey = publicRuntimeConfig?.captchaClientKey || ""
	const baseUrl = publicRuntimeConfig?.baseUrl || ""
	// const apiUrl = publicRuntimeConfig?.apiUrl || ""
	// const {authState, saveCaptcha} = props

	// tabs
	const [value, setValue] = useState(1)

	function handleClosePage() {
		router.push(`/`).then((r) => r)
	}

	const schemaDataWebPage = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: t("site.homepage"),
				item: `${baseUrl}/${t("site.en")}/`,
			},

			{
				"@type": "ListItem",
				position: 2,
				name: t("site.Connect to the world of swingers"),
				item: `${baseUrl}/${t("site.en")}/auth/signin`,
			},
		],

		"@graph": [
			{
				"@type": "Organization",
				"@id": `${baseUrl}#organization`,
				name: t("site.Swingers exchange couples"),
				url: `${baseUrl}`,
				email: "webmaster@swingers.co.il",
				description: t(
					"site.The Swingers website is the leading and largest website for the"
				),
				logo: {
					"@type": "ImageObject",
					url: `${baseUrl}/seo.jpg`,
					width: "217",
					height: "49",
				},
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
				name: t("site.Swingers exchange couples"),
				inLanguage: t("site.en_US"),
				publisher: {"@id": `${baseUrl}/#organization`},
			},

			{
				"@type": "WebPage",
				"@id": `${baseUrl}/${t("site.en")}/auth/signin/#webpage`,
				isPartOf: {
					"@id": `${baseUrl}/#website`,
				},
				url: `${baseUrl}/${t("site.en")}/auth/signin`,
				name: t("site.Entering the world of swingers"),
				description: t(
					"site.Connect to the world of swingers the world of"
				),
				headline: t("site.Entering the world of swingers"),
				inLanguage: t("site.en_US"),
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
			},
		],
	}
 
	return (
		<NoAuthLayout useTabBar={false} fullHeight={true}>
			<NextSeo
				title={t("site.Swingers exchange couples")}
				description={t(
					"site.The Swingers website is the leading and largest website for the"
				)}
				openGraph={{
					type: "website",
					url: `${baseUrl}/${t("site.en")}/auth/signin`,
					title: t("site.Swingers exchange couples"),
					description: t(
						"site.The Swingers website is the leading and largest website for the"
					),
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
			<div className="AuthSignInIndexPage">
				<div className={"Close"}>
					<TransparentButton
						icon={<CloseIcon style={"light"} />}
						onClick={handleClosePage}
					/>
				</div>
				<div className={"Logotype"}>
					<Logotype size={"signin"} />
				</div>
				<div className="Tabs">
					<TryTabs
						currentValue={value}
						setValue={setValue}
						variant={TryTabButtonVariants.signIn}
						tabs={[
							{
								value: 1,
								title: t("site.Login with email nickname"),
							},
							{
								value: 2,
								title: t("site.Entrance with mobile number"),
							},
						]}
					/>

					{/* tab 1 */}
					{value === 1 && (
						<SignInEmailUsername captchaKey={captchaKey} />
					)}

					{/* tab 2 */}
					{value === 2 && <SignInPhone captchaKey={captchaKey} />}
				</div>
			</div>
		</NoAuthLayout>
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

export default AuthSignInIndexPage
// const mapStateToProps = (state: any) => ({
// 	authState: state.auth,
// })
//
// const mapDispatchToProps = {
// 	saveCaptcha: saveCaptcha,
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(AuthSignInIndexPage)
