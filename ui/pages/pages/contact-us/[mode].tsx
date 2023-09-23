import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import ContactUsPage from "@/components/ui_pages/ContactUs/ContactUsPage"
import {NextSeo} from "next-seo"
import Head from "next/head"
import {useTranslation} from "next-i18next"
import getConfig from "next/config"
import dynamic from "next/dynamic"

const {publicRuntimeConfig} = getConfig()

const DynamicContactUsPage = dynamic(
	() => import("@/components/ui_pages/ContactUs/ContactUsPage")
)

function ContactUs() {
	const {t} = useTranslation("site")
	const baseUrl = publicRuntimeConfig?.baseUrl || ""
	const schemaDataOrganization = [
		{
			"@context": "http://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					item: {
						"@type": "WebSite",
						"@id": `${baseUrl}/${t("site.en")}`,
						image: `${baseUrl}/seo.jpg`,
						name: t("site.Pregnant women alternate couples"),
					},
				},

				{
					"@type": "ListItem",
					position: 2,
					item: {
						"@type": "ContactPage:",
						"@id": `${baseUrl}/${t(
							"site.en"
						)}/pages/contact-us/contact`,
						name: t("site.Contact us"),
					},
				},
			],
			"@graph": [
				{
					"@type": "Organization",
					"@id": `${baseUrl}#organization`,
					name: t("site.Swingers exchange couples"),
					url: `${baseUrl}`,
					email: "webmaster@swingers.co.il",
					logo: {
						"@type": "ImageObject",
						url: `${baseUrl}/seo.jpg`,
						width: "217",
						height: "49",
					},
					description: t(
						"site.The Swingers website is the leading and largest website for the"
					),

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

					publisher: {
						"@id": `${baseUrl}/#organization`,
					},
				},

				{
					"@type": "WebPage",
					"@id": `${baseUrl}/${t(
						"site.en"
					)}/pages/contact-us/contact/#webpage`,
					isPartOf: {
						"@id": `${baseUrl}/#website`,
					},
					url: `${baseUrl}/${t("site.en")}/pages/contact-us/contact/`,
					name: t("site.Contact us"),
					description: t("site.Swingers contact form"),
				},

				{
					"@type": "ContactPage",
					"@id": `${baseUrl}/${t(
						"site.en"
					)}/pages/contact-us/contact/#ContactPage`,
					mainEntityOfPage: {
						"@type": "WebPage",
						"@id": `${baseUrl}/${t(
							"site.en"
						)}/pages/contact-us/contact/#webpage`,
					},

					image: [
						{
							"@type": "ImageObject",
							url: `${baseUrl}/seo.jpg`,
							height: "217",
							width: "49",
						},
					],

					headline: t("site.Contact us"),
					copyrightYear: "2022",
					name: t("site.Swingers exchange couples"),
					inLanguage: t("site.en_US"),
					keywords: t(
						"site.Swingers exchange of couples exchange of couples parties"
					),
					description: t(
						"site.The Swingers website is the leading and largest website for the"
					),
				},
			],
		},
	]

	return (
		<AppDefaultLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<NextSeo
				title={t("site.Contact us")}
				description={t("site.Swingers contact form")}
				openGraph={{
					type: "website",
					url: `${baseUrl}/${t("site.en")}/pages/contact-us/contact`,
					title: t("site.Contact us"),
					description: t("site.Swingers contact form"),
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
			<Head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(schemaDataOrganization),
					}}
				/>
			</Head>
			<DynamicContactUsPage />
			
		</AppDefaultLayout>
	)
}

ContactUs.requireAuth = false

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default ContactUs
