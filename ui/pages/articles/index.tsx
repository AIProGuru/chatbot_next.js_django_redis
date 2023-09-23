import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import ArticlesCategory from "@/components/ui_pages/Articles/Category/ArticlesCategory"
import React from "react"
import Head from "next/head"
import {useTranslation} from "next-i18next"
import {NextSeo} from "next-seo"
import getConfig from "next/config"
import {wrapper} from "@/redux/store"
import {getSections} from "@/services/blog.service"

const {publicRuntimeConfig} = getConfig()

interface ArticlesProps {
	[x: string]: any
	article: {
		data: any
	}
}

function Articles(props: ArticlesProps) {
	const {t} = useTranslation("site")
	const {article} = props
	const baseUrl = publicRuntimeConfig?.baseUrl || ""

	console.log(article?.data)

	const getItemList = () => {
		const staticData = [
			{
				"@type": "ListItem",
				position: 1,
				name: t("site.homepage"),
				item: `${baseUrl}/${t("site.en")}/`,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: t("site.Swingers Magazine"),
				item: `${baseUrl}/${t("site.en")}/articles`,
			},
		]
		if (!article?.data) return staticData
		const seoData = []
			.concat(
				...article?.data?.map((a: any) => {
					const ar = a.children
					return ar
				})
			)
			.map((category: any) => {
				return {
					"@type": "ListItem",
					position: 3,
					name: category?.data?.name,
					item: `${baseUrl}/${t("site.en")}/articles/${category?.id}`,
				}
			})
		return [...staticData, ...seoData]
	}

	const schemaDataWebPage = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: getItemList(),

		" @graph": [
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
				"@id": `${baseUrl}/${t("site.en")}/articles/#webpage`,
				isPartOf: {
					"@id": `${baseUrl}/#website`,
				},

				url: `${baseUrl}/${t("site.en")}/articles`,
				name: t("site.Swingers Magazine"),
				description: t("site.Swingers Magazine"),
			},

			{
				"@type": "Article",
				"@id": `${baseUrl}/${t("site.en")}/articles/#Article`,
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
					},
				],

				headline: t("site.Swingers Magazine"),
				name: t("site.Swingers Magazine Couples Exchange"),
				description: t("site.The world of swingers"),
				copyrightYear: "2022",
				inLanguage: t("site.en_US"),
				keywords: t(
					"site.Swingers exchange of couples exchange of couples parties"
				),
			},
		],
	}

	return (
		<AppDefaultLayout useHeader={true} useTabBar={true} fullHeight={true}>
			<NextSeo
				title={t("site.Swingers Magazine")}
				description={t("site.The world of swingers")}
				openGraph={{
					type: "article",
					url: `${baseUrl}/${t("site.en")}/articles`,
					title: t("site.Swingers Magazine"),
					description: t("site.The world of swingers"),
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
			<ArticlesCategory />
		</AppDefaultLayout>
	)
}

Articles.requireAuth = false

export const getServerSideProps = wrapper.getServerSideProps((store) => {
	return async (context: any) => {
		const locale = context.locale || "en"

		const articlesCategory = await store.dispatch(
			getSections.initiate({page: 1, page_size: 3})
		)

		return {
			props: {
				article: {
					data:
						articlesCategory &&
						articlesCategory.status === "fulfilled" &&
						articlesCategory.data
							? articlesCategory.data
							: null,
				},
				...(await serverSideTranslations(locale, ["site"])),
			},
		}
	}
})

export default Articles
