import styles from "./ArticleRead.module.scss"
import React, {useMemo} from "react"
import Event from "@/components/ui/Events/Event"
import Button from "@/components/ui/Button/Button/Button"
import {TFunction, useTranslation} from "next-i18next"
import {useRouter} from "next/router"
import Divider from "@/components/ui/Divider/Divider"
import {Article} from "@/services/blog.service"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import {cc} from "@/components/ui/Functions/Classnames"
import {stripTags} from "@/components/ui/Functions/StripTags"
// import BlogNewHeader from "@/components/ui/Blog/New/Header/BlogNewHeader"
// import {ArrowBack} from "@mui/icons-material"
// import ArrowIcon from "@/components/ui/Icons/ArrowIcon"
// import CloseIcon from "@/components/ui/Icons/CloseIcon"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"

const getPageTranslations = (t: TFunction) => {
	return {
		article: {
			recommendations: t("site.More articles that may interest you"),
			all_articles: t("site.For all the articles in the magazine"),
		},
	}
}

interface ArticleReadProps {
	article: Article
	articles: Article[]
}

function ArticleRead(props: ArticleReadProps) {
	// props
	const {article, articles} = props
	const {t} = useTranslation("site")
	const router = useRouter()
	const {subcategory} = router.query
	const dir = getDirection(router)
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])

	console.log(article)

	return (
		<div className={cc([styles.ArticleRead, dir && styles[dir]])}>
			<div className={styles.Container}>
				<div className={styles.GoBack}>
					<TransparentButton
						icon={<GoBackIcon />}
						onClick={() => {
							router.back()
						}}
					/>
				</div>

				<div className={styles.Welcome}>
					<h1>{article?.title}</h1>
				</div>

				<div
					className={styles.Content}
					dir={"auto"}
					dangerouslySetInnerHTML={{
						__html: article?.text,
					}}
				/>

				{/* <div className={styles.Content}>
					{article.article_image.map((img) => {
						return <img src={img.src} alt="" key={img.id} />
					})}
				</div> */}

				<div className={styles.Recommendations}>
					<div className={styles.Header}>
						<div className={styles.Text}>
							<p>{pageTranslations.article.recommendations}</p>
						</div>
					</div>
					<Divider />

					{/* this is not events, it is articles, but they displayed using event component */}
					<div className={styles.List}>
						{articles &&
							articles.map((article: Article) => {
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
												? `${stripTags(
														article.text
												  ).slice(0, 100)}...`
												: stripTags(article.text)
										}
										href={`/articles/${subcategory}/${article.slug}`}
										variant={"big-text"}
									/>
								)
							})}
					</div>

					<div className={styles.Action}>
						<Button
							type={"button"}
							variant={"outline"}
							color={"white"}
							fullWidth={true}
							id={"button_open_articles"}
							onClick={() => {
								router.push("/articles").then()
							}}
						>
							<p className={styles.ActionButtonText}>
								{pageTranslations.article.all_articles}
							</p>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ArticleRead
