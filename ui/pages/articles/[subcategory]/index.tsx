import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import ArticlesSubCategory from "@/components/ui_pages/Articles/SubCategory/ArticlesSubCategory"
import React from "react"
import {getSections} from "@/services/blog.service"
import {wrapper} from "@/redux/store"
import {NextSeo} from "next-seo"
import {useTranslation} from "next-i18next"
import getConfig from "next/config"
import {useRouter} from "next/router"
import Head from "next/head"

const {publicRuntimeConfig} = getConfig()

interface ArticlesProps {
	[x: string]: any
	article: {
		data: any
	}
}

function ArticlesSubCategoryPage(props: ArticlesProps) {
	const {t} = useTranslation("site")
	const router = useRouter()
	const {article} = props
	const {subcategory} = router.query
	const baseUrl = publicRuntimeConfig?.baseUrl || ""

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
				item: `${baseUrl}/${t("site.en")}/articles/`,
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
		return [
			...staticData,
			...seoData
		]
	}

	const getSubUrl = () => {
		if (!subcategory) return ""
		return `${baseUrl}/${t("site.en")}/articles/${subcategory}`
	}

	const schemaDataWebPage = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		name: "BreadcrumbList",
		itemListElement: getItemList(),

		"@graph": [
			{
				"@type": "Organization",
				"@id": `${baseUrl}/${t("site.en")}/#organization`,
				name: t("site.Swingers exchange couples"),
				url: `${baseUrl}`,
				email: "webmaster@swingers.co.il",
				description: t(
					"site.Enter the world of swingers the world of fantasies"
				),
				logo: {
					"@type": "ImageObject",
					name: t("site.Swingers logo"),
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
				"@id": `${baseUrl}/${t("site.en")}/#website`,
				url: `${baseUrl}/${t("site.en")}`,
				name: t("site.Swingers exchange couples"),
				inLanguage: t("site.en_US"),
				publisher: {
					"@id": `${baseUrl}/${t("site.en")}/#organization`,
				},
			},

			{
				"@type": "WebPage",
				"@id": `${getSubUrl()}/#webpage`,
				isPartOf: {"@id": `${baseUrl}/${t("site.en")}/#website`},
				url: getSubUrl(),
				name: t("site.Swingers Magazine"),
				description: t("site.Articles articles tips questions and"),
			},

			{
				"@type": "WebPage",
				"@id": `${getSubUrl()}/#webpage1`,
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": `${getSubUrl()}/#webpage`,
				},

				name: t("site.Swingers in academia"),

				author: {"@type": "Person", name: "Sharon Dan"},
				description: t(
					"site.Come see all the content written in the academy"
				),
				publisher: {
					"@id": `${baseUrl}/${t("site.en")}/#organization`,
				},
				potentialAction: {
					"@type": "ReadAction",
					target: getSubUrl(),
				},

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
		<AppDefaultLayout useHeader={true} useTabBar={true} fullHeight={true}>
			<NextSeo
				title={t("site.Swingers in academia")}
				description={t(
					"site.Come see all the content written in the academy"
				)}
				openGraph={{
					type: "article",
					url: getSubUrl(),
					title: t("site.Swingers in academia"),
					description: t(
						"site.Come see all the content written in the academy"
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
			<ArticlesSubCategory />
		</AppDefaultLayout>
	)
}

ArticlesSubCategoryPage.requireAuth = false

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

export default ArticlesSubCategoryPage
