// import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import TwoRabbitsIcon from "@/components/ui/Icons/TwoRabbitsIcon"
import Button from "@/components/ui/Button/Button/Button"
// import SplashScreen from "@/components/ui/Splash/SplashScreen"
import React, {useEffect, useState} from "react"
// import AccordionGroup from "@/components/ui/Accordion/AccordionGroup"
// import AccordionItem from "@/components/ui/Accordion/AccordionItem"
// import DiscoRabbitIcon from "@/components/ui/Icons/DiscoRabbitIcon"
// import UpcomingEvent from "@/components/ui/Events/UpcomingEvent"
import Banner from "@/components/ui/Banner/Banner"
import RabbitsHoleIcon from "@/components/ui/Icons/RabbitsHoleIcon"
// import Event from "@/components/ui/Events/Event"
// import ProfileAd from "@/components/ui/Profiles/ProfileAd/ProfileAd"
import {
	useAnonGetProfilesMainInfoQuery,
	useGetPublicProfileAvatarsMutation,
} from "@/services/anonymous.service"
import {useRouter} from "next/router"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import {getNickName} from "@/components/ui/Functions/GetNickname"
import {Article, useLazyGetArticlesQuery} from "@/services/blog.service"
import {stripTags} from "@/components/ui/Functions/StripTags"
import {getDirection} from "@/components/ui/Functions/GetDirection"
import NoAuthLayout from "@/components/ui_app/AppLayouts/NoAuthLayout"
// import {useIsSSR} from "@/components/ui/Functions/useIsSSR"
import dynamic from "next/dynamic"
const DynamicProfileAd = dynamic(
	() => import("@/components/ui/Profiles/ProfileAd/ProfileAd")
)
const DynamicEvent = dynamic(() => import("@/components/ui/Events/Event"))

function BeforeLoginPage() {
	const {t} = useTranslation("site")
	const router = useRouter()
	const dir = getDirection(router)

	// loading prop demo
	// const [isLoading, setIsLoading] = useState(true)
	// const [showSplash, setShowSplash] = useState(true)
	const [profilesAvatar, setProfilesAvatar] = useState<object[]>([])
	const [articles, setArticles] = useState<Article[]>([])
	const [showDescription, setShowDescription] = useState<boolean>(false)

	// rtk
	const [getArticlesTrigger, articlesResponse] = useLazyGetArticlesQuery()

	const loadArticles = () => {
		getArticlesTrigger({
			page: 1,
			page_size: 3,
		})
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

	const demoUpcomingEvents = [
		{
			date: "יום חמישי, 25/11 • 21:00",
			description:
				"מסיבת חילופי זוגות עם משחקים זוגיים במגרש המפואר 4play לזוגות שהולכים בגדול…",
			image: "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?cs=srgb&dl=pexels-teddy-yang-2263436.jpg&fm=jpg",
		},
		{
			date: "יום חמישי, 25/11 • 21:00",
			description:
				"מסיבת חילופי זוגות עם משחקים זוגיים במגרש המפואר 4play לזוגות שהולכים בגדול…",
			image: "https://images.pexels.com/photos/806715/pexels-photo-806715.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
		},
	]

	const demoEventList = [
		{
			title: "הצעדים הראשונים בסווינגרס",
			description:
				"כל דבר אפשר ללמוד לבד בחיים אבל אין טוב וקל מאשר ללמוד מניסיונם של זוגות אחרים.\n" +
				"הכרויות סקסיות לזוגות ניתן…",
			image: "https://images.pexels.com/photos/787961/pexels-photo-787961.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
		},
		{
			title: "מי הם הסווינגרים?",
			description:
				"אלו הם אנשים, כמוך וכמוני. שכניך, עמיתיך, חבריך. הם מכל המינים והסוגים. הם רק רואים את חייהם המיניים באופן שונה מהרוב….",
			image: "https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
		},
		{
			title: "להציע לפרטנר חילופי זוגות",
			description:
				"אם הנך מעורב/ת במערכת יחסים – מה טוב!\n" +
				"יש להציג את הרעיון בכנות יושר והגינות. אין לדחוף או לכפות על בן הזוג הצטרפות …\n",
			image: "https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
		},
	]

	// const {data: anonGetProfiles, isLoading: isAnonGetProfilesLoading} =
	// 	useAnonGetProfilesQuery({
	// 		page: 1,
	// 		pageSize: 10,
	// 	})
	const {data: anonGetProfiles, isLoading: isAnonGetProfilesLoading} =
		useAnonGetProfilesMainInfoQuery({
			page: 1,
			pageSize: 5,
		})

	const [registerGetPublicProfilesAvatar] =
		useGetPublicProfileAvatarsMutation()

	useEffect(() => {
		if (!isAnonGetProfilesLoading && anonGetProfiles?.results) {
			const ids = anonGetProfiles?.results.map((item: any) =>
				item?.id?.toString()
			)
			registerGetPublicProfilesAvatar({
				profileIds: ids,
			})
				.unwrap()
				.then((r) => {
					setProfilesAvatar((prevProfile) => [...prevProfile, ...r])
				})
				.catch((e) => {
					console.log(e)
				})
		}
	}, [isAnonGetProfilesLoading, anonGetProfiles?.results])

	// loading end demo
	// useEffect(() => {
	// 	setTimeout(() => {
	// 		setIsLoading(false)
	// 	}, 1000)
	// }, [setIsLoading])
	//
	// if (!ssr && showSplash) {
	// 	return (
	// 		<SplashScreen isLoading={isLoading} setShowSplash={setShowSplash} />
	// 	)
	// }

	const desciption = [
		t(
			"site.Welcome to the new Swingers site, the most veteran couples swapping site In Israel"
		),
		t(
			"site.Swingers site is a meeting place for people looking for thrills"
		),
		t("site.Swingers site is an open house for all types of couples"),
		t(
			"site.Our community comprises quality males females and couples from all over the country who"
		),
		t(
			"site.Swingers team built the site based on the rich experience of veteran swingers who invite"
		),
		t(
			"site.An exchange couple is not suitable for every couple Trust and mutual respect"
		),
		t("site.Many people think that this is a betrayal but it is not"),
		t("site.If there is intense jealousy do not rush your partner and it"),
		t(
			"site.It is advisable to remain open to ideas and explain the concept of experience to"
		),
		t("site.Imagine how your partner comes back to you after several"),
	]

	const desciptionList = showDescription
		? desciption.slice(0, 9)
		: desciption.slice(0, 4)

	return (
		<NoAuthLayout
			useHeader={true}
			useTabBar={true}
			fullHeight={true}
			useFooter
		>
			<div className="Main" dir={dir}>
				<div className="Welcome">
					{/*<div className="TextError">*/}
					{/*	<p>{t("site.Website is in maintenance")}</p>*/}
					{/*</div>*/}
					<div className="Icon">
						<TwoRabbitsIcon />
					</div>
					<div className="Text">
						<h1>Come swing with us</h1>
					</div>
				</div>
				<div className={"UserAccountWrapper"}>
					<div className="User">
						<div className="About">
							<p>
								{t("site.Welcome to the new Swingers")},
								<br />
								{t(
									"site.The leading couples exchange site in Israel"
								)}
							</p>
						</div>
						<div className="Actions">
							<div>
								<Button
									type={"link"}
									fullWidth={true}
									id={"button_new_account"}
									onClick={() => router.push("/auth/signup/")}
								>
									<p className={"ButtonNewAccount"}>
										{t("site.Join now for free")}
									</p>
								</Button>
							</div>
							<div>
								<Button
									type={"link"}
									fullWidth={true}
									variant={"outline"}
									id={"button_have_account"}
									onClick={() => router.push("/auth/signin")}
								>
									<p className={"ButtonHaveAccount"}>
										{t(
											"site.Already registered Log in here"
										)}
									</p>
								</Button>
							</div>
						</div>
					</div>
				</div>
				<div className="DescriptionContainer">
					{desciptionList.map((text, index) => (
						<div key={index}>
							{index === 5 && (
								<h2>{t("site.Couple swapping")}</h2>
							)}
							<p>
								{text}{" "}
								{((index === 3 && !showDescription) ||
									(index === 8 && showDescription)) && (
									<span
										onClick={() =>
											setShowDescription(!showDescription)
										}
									>
										{!showDescription
											? t("site.Show more")
											: t("site.Show less")}
									</span>
								)}
							</p>
						</div>
					))}
				</div>
				{/* <div className={"UserPreferences"}>
					<div className="Text">
						<p>{t("site.Tell us what comes to you")}?</p>
					</div>
					<div className="Form">
						<AccordionGroup>
							<AccordionItem title={t("site.We are a couple")}>
								<div className="AccordionContent">
									Content here
								</div>
							</AccordionItem>
							<AccordionItem
								title={t("site.Looking for couples")}
							>
								<div className="AccordionContent">
									Content here
								</div>
							</AccordionItem>
							<AccordionItem title={t("site.Select an area")}>
								<div className="AccordionContent">
									Content here
								</div>
							</AccordionItem>
						</AccordionGroup>
					</div>
					<div className="Actions">
						<div>
							<Button
								type={"link"}
								fullWidth={true}
								id={"button_find_matches"}
							>
								<p className={"ButtonFindMatches"}>
									{t("site.Youll find me matches")}
								</p>
							</Button>
						</div>
						<div>
							<Button
								type={"link"}
								fullWidth={true}
								variant={"outline"}
								id={"button_about_parties"}
							>
								<p className={"ButtonAboutParties"}>
									{t("site.Tell me about SWINGERS parties")}
								</p>
							</Button>
						</div>
					</div>
				</div> */}
				{!!anonGetProfiles?.results && (
					<div className="OtherSwingers">
						<div className="Text">
							<h1>
								{t("site.Lets talk to over")}
								<br />
								{t("site.Couples men and women swingers")}
							</h1>
						</div>
						<div className="List">
							{anonGetProfiles.results.length &&
								anonGetProfiles!.results.map(
									(profileAd: any, index: number) => {
										const {
											id,
											profile_type,
											verified,
											location,
											about,
											is_online,
											profile_images,
											man,
											woman,
										} = profileAd

										return (
											<DynamicProfileAd
												key={index}
												images={profilesAvatar}
												status={is_online ? 1 : 2}
												disabled
												location={{
													title:
														location?.title || "-",
												}}
												distance={null}
												blur
												profile={{
													id: id,
													manAge: man?.age,
													womanAge: woman?.age,
													profileType: profile_type,
													description:
														about &&
														about.length > 40
															? `${about.slice(
																	0,
																	40
															  )}...`
															: about || "-",
													verified: true,
													nickname:
														getNickName(profileAd),
												}}
											/>
										)
									}
								)}
						</div>
					</div>
				)}
				<div className="Banner">
					<Banner
						icon={<RabbitsHoleIcon />}
						titles={[
							t("site.Do not worry at SWINGERS"),
							t("site.Your discretion and privacy"),
							t("site.More important to us than anything"),
						]}
						items={[
							t("site.Discretion and privacy"),
							t(
								"site.The information on the site is secure and encrypted"
							),
							t("site.Rules of conduct that protect members"),
						]}
						button={
							<Button
								type={"button"}
								variant={"outline"}
								color={"white"}
								fullWidth={true}
								id={"button_banner"}
								onClick={() =>
									router.push(
										"/articles/51/פרטיות-דיסקרטיות-ואבטחת-מידע"
									)
								}
							>
								<p className="BannerButtonText">
									{t("site.Tell me more")}
								</p>
							</Button>
						}
					/>
				</div>
				{/* <div className="UpcomingEvents">
					<div className="Header">
						<div className={"Icon"}>
							<DiscoRabbitIcon />
						</div>
						<div className={"Text"}>
							<p>
								{t("site.The crazy parties")}
								<br />
								של SWINGERS
							</p>
						</div>
					</div>

					<div className="List">
						{demoUpcomingEvents &&
							demoUpcomingEvents.map(
								(event: any, index: number) => {
									return (
										<UpcomingEvent
											key={index}
											image={event.image}
											date={event.date}
											description={event.description}
											href={"/events/91/"}
											variant={"inside-button"}
										/>
									)
								}
							)}
					</div>
				</div> */}
				<div className="BecomeSwinger">
					<div className="Header">
						<div className="Text">
							<h1>{t("site.becoming a swinger")}</h1>
						</div>
					</div>

					{/* this is not events, it is articles, but they displayed using event component */}
					<div className="List">
						{articles &&
							articles.map((article: Article) => {
								const articleImage =
									(article.article_image &&
										Array.isArray(article.article_image) &&
										article.article_image.length > 0 &&
										article.article_image[0].src) ||
									"#"

								return (
									<DynamicEvent
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
										href={`/articles/${article.section_id}/${article.slug}`}
										variant={"big-text"}
									/>
								)
							})}
					</div>

					<div className="Action">
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
							<p className="ActionButtonText">
								{t("site.For all the articles in the magazine")}
							</p>
						</Button>
					</div>
				</div>
			</div>
		</NoAuthLayout>
	)
}

BeforeLoginPage.requireAuth = false

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default BeforeLoginPage
