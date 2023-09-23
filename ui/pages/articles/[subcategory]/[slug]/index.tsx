import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import ArticleRead from "@/components/ui_pages/Articles/Read/ArticleRead"
import React, {useEffect, useState} from "react"
import {wrapper} from "@/redux/store"
import {
	Article,
	getArticle,
	getSections,
	useLazyGetArticlesQuery,
} from "@/services/blog.service"
import {ArticleJsonLd, NextSeo} from "next-seo"
import {stripTags} from "@/components/ui/Functions/StripTags"
import {useRouter} from "next/router"
import {useTranslation} from "next-i18next"
import getConfig from "next/config"
import Head from "next/head"

const {publicRuntimeConfig} = getConfig()

interface ArticleProps {
	[x: string]: any
	article: {
		data: Article
		category: any
	}
}

function ArticleIndex(props: ArticleProps) {
	// props
	const {article} = props
	const {t} = useTranslation("site")
	const baseUrl = publicRuntimeConfig?.baseUrl || ""

	// state
	const [articles, setArticles] = useState<Article[]>([])

	// rtk
	const [getArticlesTrigger, articlesResponse] = useLazyGetArticlesQuery()

	const loadArticles = () => {
		getArticlesTrigger({
			page: 1,
			page_size: 3,
		})
	}

	console.log(article?.data?.section_name)

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
			{
				"@type": "ListItem",
				position: 4,
				name: getTitle(),
				item: getUrl(),
			},
			{
				"@type": "ListItem",
				position: 3,
				name: article?.data?.section_name,
				item: getSubUrl(),
			},
		]
		return staticData
		// if (!article?.category) return staticData
		// const oneArticlesCategory = article?.category[0]
		// 	? article?.category[0].children.map((category: any) => {
		// 			return {
		// 				"@type": "ListItem",
		// 				position: 3,
		// 				name: category?.category?.name,
		// 				item: `${baseUrl}/${t("site.en")}/articles/${
		// 					category?.id
		// 				}`,
		// 			}
		// 	  })
		// 	: []
		// const twoArticlesCategory = article?.category[1]
		// 	? article?.category[1].children.map((category: any) => {
		// 			return {
		// 				"@type": "ListItem",
		// 				position: 3,
		// 				name: category?.category?.name,
		// 				item: `${baseUrl}/${t("site.en")}/articles/${
		// 					category?.id
		// 				}`,
		// 			}
		// 	  })
		// 	: []
		// const threeArticlesCategory = article?.category[2]
		// 	? article?.category[2].children.map((category: any) => {
		// 			return {
		// 				"@type": "ListItem",
		// 				position: 3,
		// 				name: category?.category?.name,
		// 				item: `${baseUrl}/${t("site.en")}/articles/${
		// 					category?.id
		// 				}`,
		// 			}
		// 	  })
		// 	: []
		// return [
		// 	...staticData,
		// 	...oneArticlesCategory,
		// 	...twoArticlesCategory,
		// 	...threeArticlesCategory,
		// ]
	}

	console.log("ARTICLE", article)

	// meta
	const getTitle = () => {
		if (!article || !article?.data || !article?.data?.title) return ""
		return article?.data?.title
	}

	const getDescription = () => {
		if (!article || !article?.data || !article?.data?.text) return ""

		const clearText = stripTags(article?.data?.text)
		return clearText?.length > 200
			? `${clearText.slice(0, 200)}...`
			: clearText
	}

	const getUrl = () => {
		if (
			!article ||
			!article?.data ||
			!article?.data?.slug ||
			!article?.data?.section_id
		)
			return ""
		return `${baseUrl}/${t("site.en")}/articles/${
			article?.data?.section_id
		}/${article?.data?.slug}`
	}

	const getSubUrl = () => {
		if (!article || !article?.data || !article?.data?.section_id) return ""
		return `${baseUrl}/${t("site.en")}/articles/${
			article?.data?.section_id
		}`
	}

	const getDatePublished = () => {
		if (!article || !article?.data || !article?.data?.created) return ""
		return article?.data?.created
	}

	const getDateUpdated = () => {
		if (!article || !article?.data || !article?.data?.updated) return ""
		return article?.data?.updated
	}

	const getImages = () => {
		const staticImage = [
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
		]
		if (!article || !article?.data || !article?.data?.article_image)
			return staticImage
		const articleImage = article?.data?.article_image.map((image) => {
			return {
				"@type": "ImageObject",
				url: image.src,
				height: "217",
				width: "49",
				caption: "Article image",
			}
		})
		return [...articleImage, ...staticImage]
	}

	// effects
	useEffect(() => {
		loadArticles()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (
			articlesResponse &&
			articlesResponse.status === "fulfilled" &&
			articlesResponse.data
		) {
			const results = articlesResponse.data.results || []
			setArticles((prevState) => [...prevState, ...results])
		}
	}, [articlesResponse])

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
				"@id": `${getUrl}/#webpage`,
				isPartOf: {"@id": `${baseUrl}/${t("site.en")}/#website`},
				url: getSubUrl(),
				name: t("site.Swingers Magazine"),
				description: t("site.Articles articles tips questions and"),
			},

			{
				"@type": "Article",
				"@id": `${getUrl}/#Article`,
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": `${getUrl}/#webpage`,
				},

				headline: getTitle(),
				name: getTitle(),
				articleBody: stripTags(article?.data?.text),
				author: {"@type": "Person", name: "Sharon Dan"},

				description: getDescription(),
				datePublished: getDatePublished(),
				dateModified: getDateUpdated(),
				publisher: {
					"@id": `${baseUrl}/${t("site.en")}/#organization`,
				},
				potentialAction: {
					"@type": "ReadAction",
					target: getUrl(),
				},

				inLanguage: t("site.en_US"),
				image: getImages(),
			},
		],
	}

	return (
		<>
			<NextSeo
				title={getTitle()}
				description={getDescription()}
				openGraph={{
					type: "article",
					url: getUrl(),
					title: getTitle(),
					description: getDescription(),
					images: [
						{
							url: getImages()[0].url,
							width: 217,
							height: 49,
							alt: "Article logo",
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

			<AppDefaultLayout
				useHeader={true}
				useTabBar={true}
				fullHeight={true}
			>
				<ArticleRead article={article.data} articles={articles} />
			</AppDefaultLayout>
		</>
	)
}

ArticleIndex.requireAuth = false

// export const getServerSideProps = async (ctx: any) => {
export const getServerSideProps = wrapper.getServerSideProps((store) => {
	return async (context: any) => {
		const locale = context.locale || "en"
		const slug = encodeURIComponent(context.params.slug) || ""

		const article = await store.dispatch(getArticle.initiate({slug: slug}))

		const articlesCategory = await store.dispatch(
			getSections.initiate({page: 1, page_size: 3})
		)

		console.log("slug", slug)
		console.log("ARTICLE RES", article)
		console.log("ARTICLE CATEGORY RES", articlesCategory)

		return {
			props: {
				article: {
					data:
						article &&
						article?.status === "fulfilled" &&
						article?.data
							? article?.data
							: null,
					category:
						articlesCategory &&
						articlesCategory?.status === "fulfilled" &&
						articlesCategory?.data
							? articlesCategory?.data
							: null,
				},
				...(await serverSideTranslations(locale, ["site"])),
			},
		}
	}
})

export default ArticleIndex
