import styles from "./ArticlesCategory.module.scss"
import {TFunction, useTranslation} from "next-i18next"
import {useRouter} from "next/router"
import React, {useEffect, useMemo, useState} from "react"
import Event from "@/components/ui/Events/Event"
import {Section, useLazyGetSectionsQuery} from "@/services/blog.service"
import TryTabs from "@/components/ui/Tabs/TryTabs/TryTabs"

const getPageTranslations = (t: TFunction) => {
	return {
		articles: {
			welcome: {
				swingers_magazine: t("site.SWINGERS Magazine"),
				how_to: t(
					"site.Where do you start How do I know swingers Are there any rules of conduct"
				),
			},
			tabs: {
				about_us: t("site.Wrote about us"),
				first_steps: t("site.first steps"),
				more: t("site.More on Swingers"),
			},
			actions: {
				load_more: t("site.the next"),
			},
		},
	}
}

function ArticlesCategory() {
	// props
	const {t} = useTranslation("site")
	const router = useRouter()
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])

	// state
	const [tab, setTab] = useState<number | undefined>(undefined)
	// const [tab, setTab] = useState<number | undefined>(1)
	const [page, setPage] = useState<number>(1)
	const [pageSize, setPageSize] = useState<number>(10)
	// const [articles, setArticles] = useState<Article[]>([])
	const [sections, setSections] = useState<Section[]>([])
	// const [subSections, setSubSections] = useState<Section[]>([])
	const [maxPages, setMaxPages] = useState<number>(0)

	// rtk
	// const [getArticlesTrigger, articlesResponse] = useLazyGetArticlesQuery()
	const [getSectionsTrigger, sectionsResponse] = useLazyGetSectionsQuery()
	// todo: replace get articles/sections with get categories & sub categories

	// functions
	const handleChangeTab = (tab: number) => {
		setTab(tab)
		setPage(1)
		// setArticles([])
		setMaxPages(0)
	}

	const loadSections = () => {
		getSectionsTrigger({
			page: 1,
			page_size: 3,
		})
	}

	console.log("sections", sections)

	// effects
	useEffect(() => {
		// loadArticles()
		loadSections()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (
			sectionsResponse &&
			sectionsResponse.status === "fulfilled" &&
			sectionsResponse.data
		) {
			const results = sectionsResponse.data || []
			setSections((prevState) => [...prevState, ...results])
			results && results.length > 0 && setTab(results[0].id)
		}
	}, [sectionsResponse])

	if (!tab || !sections) return null

	return (
		<div className={styles.ArticlesCategory}>
			<div className={styles.Container}>
				<div className={styles.Welcome}>
					<h1>
						{pageTranslations.articles.welcome.swingers_magazine}
					</h1>
					<p>{pageTranslations.articles.welcome.how_to}</p>
				</div>
				<div className={styles.Tabs}>
					<TryTabs
						currentValue={tab}
						setValue={handleChangeTab}
						tabs={
							sections
								? sections.map((section) => {
										return {
											value: section.id,
											title: section.data.name,
										}
								  })
								: []
						}
					/>

					{sections &&
						sections.map((section) => {
							if (tab === section.id) {
								return (
									<>
										{section.children &&
											section.children.map((children) => {
												const sectionImage =
													(children.data.image &&
														children.data.image
															.src) ||
													"#"

												return (
													<Event
														key={children.id}
														image={sectionImage}
														title={
															children.data.name
														}
														description={""}
														href={`/articles/${children.id}`}
														variant={"big-text"}
													/>
												)
											})}
									</>
								)
							}
						})}
				</div>
			</div>
		</div>
	)
}

export default ArticlesCategory
