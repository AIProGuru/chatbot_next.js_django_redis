import styles from "./ArticlesSubCategory.module.scss"
import {TFunction, useTranslation} from "next-i18next"
import {useRouter} from "next/router"
import React, {useEffect, useMemo, useState} from "react"
import Event from "@/components/ui/Events/Event"
import {
	Article,
	// Section,
	useLazyGetArticlesQuery,
	// useLazyGetSectionsQuery,
} from "@/services/blog.service"
import Button from "@/components/ui/Button/Button/Button"
import {stripTags} from "@/components/ui/Functions/StripTags"
import getConfig from "next/config"
import LoadMoreButton from "@/components/ui/Button/LoadMoreButton/LoadMoreButton"

const {publicRuntimeConfig} = getConfig()

const getPageTranslations = (t: TFunction) => {
	return {
		articles: {
			welcome: {
				title: t("site.Swingers in academia"),
				description: t(
					"site.Come see all the content written in the academy"
				),
			},
			actions: {
				load_more: t("site.the next"),
			},
		},
	}
}

function ArticlesSubCategory() {
	// props
	const {t} = useTranslation("site")
	const router = useRouter()
	const {subcategory} = router.query
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])
	const baseUrl = publicRuntimeConfig?.baseUrl || ""

	// state
	const [page, setPage] = useState<number>(1)
	const [pageSize, setPageSize] = useState<number>(10)
	const [maxPages, setMaxPages] = useState<number>(0)
	const [articles, setArticles] = useState<Article[]>([])

	// rtk
	const [getArticlesTrigger, articlesResponse] = useLazyGetArticlesQuery()

	useEffect(() => {
		if (subcategory) {
			console.log("subcategory", subcategory)
		}
	}, [subcategory])

	const loadArticles = () => {
		if (page && pageSize) {
			getArticlesTrigger({
				page: page,
				page_size: pageSize,
				section_id:
					(subcategory && Number(subcategory.toString())) || 0,
			})
		}
	}

	// effects
	useEffect(() => {
		loadArticles()
	}, [page])

	useEffect(() => {
		if (
			articlesResponse &&
			articlesResponse.status === "fulfilled" &&
			articlesResponse.data
		) {
			const results = articlesResponse.data.results || []
			setArticles((prevState) => [...prevState, ...results])
			setMaxPages(Math.ceil(articlesResponse.data.count / pageSize))
		}
	}, [articlesResponse, pageSize])

	const count = articlesResponse?.data?.count || 0

	if (!subcategory) return null

	return (
		<div className={styles.ArticlesSubCategory}>
			<div className={styles.Container}>
				<div className={styles.Welcome}>
					<h1>{pageTranslations.articles.welcome.title}</h1>
					<p>{pageTranslations.articles.welcome.description}</p>
				</div>
				<div className={styles.Tabs}>
					{articles &&
						articles.map((article) => {
							const articleImage =
								(article.article_image &&
									Array.isArray(article.article_image) &&
									article.article_image.length > 0 &&
									article.article_image[0].src) ||
								"#"

							return (
								<Event
									key={article.id}
									image={articleImage}
									title={article.title}
									description={
										article.text &&
										article.text.length > 100
											? `${stripTags(article.text).slice(
													0,
													100
											  )}...`
											: stripTags(article.text)
									}
									href={`/articles/${subcategory}/${article.slug}`}
									variant={"big-text"}
								/>
							)
						})}

					{/* load more button */}
					<LoadMoreButton
						page={page}
						count={count}
						isLoading={articlesResponse?.isFetching}
						label={t("site.the next")}
						id={"button_load_more"}
						onClick={() => {
							setPage((prevState) => prevState + 1)
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export default ArticlesSubCategory
