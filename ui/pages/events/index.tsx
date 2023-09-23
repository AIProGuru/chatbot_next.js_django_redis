import SplashScreen from "@/components/ui/Splash/SplashScreen"
import {useEffect, useState} from "react"
import UpcomingEvent from "@/components/ui/Events/UpcomingEvent"
import Divider from "@/components/ui/Divider/Divider"
import Event from "@/components/ui/Events/Event"
import {he, ru, enGB} from "date-fns/locale"
import {useRouter} from "next/router"
import Link from "next/link"
import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {format} from "date-fns"
import {useAnonGetEventsQuery} from "@/services/anonymous.service"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import {NextSeo} from "next-seo"

function PartiesScreenDemo() {
	const {t} = useTranslation("site")
	// loading prop demo
	const [isLoading, setIsLoading] = useState(true)
	const [showSplash, setShowSplash] = useState(true)
	const router = useRouter()
	const locale =
		router.locale === "he" ? he : router.locale === "ru" ? ru : enGB

	// loading end demo
	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false)
		}, 1000)
	}, [setIsLoading])

	// const {data: getEvents, isLoading: isGetEventsLoading} = useGetEventsQuery({
	// 	page: 1,
	// 	pageSize: 10,
	// })
	// console.log("Events", getEvents)
	const {data: anonGetEvents, isLoading: isAnonGetEventsLoading} =
		useAnonGetEventsQuery({
			page: 1,
			pageSize: 10,
		})

	const demoUpcomingEvents = [
		{
			date: "יום חמישי , 25/11 • 21:00",
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
			title: "Halaween swing party",
			date: "פתיחת דלתות 21:00",
			description:
				"מסיבת האלווין מטורפת, תחפושות סקסיות\n" +
				"קוד לבוש חובה + מלא אלכוהול",
			image: "https://images.pexels.com/photos/787961/pexels-photo-787961.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
		},
		{
			title: "Halaween swing party",
			date: "פתיחת דלתות 21:00",
			description:
				"מסיבת האלווין מטורפת, תחפושות סקסיות\n" +
				"קוד לבוש חובה + מלא אלכוהול",
			image: "https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
		},
		{
			title: "Halaween swing party",
			date: "פתיחת דלתות 21:00",
			description:
				"מסיבת האלווין מטורפת, תחפושות סקסיות\n" +
				"קוד לבוש חובה + מלא אלכוהול",
			image: "https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
		},
		{
			title: "Halaween swing party",
			date: "פתיחת דלתות 21:00",
			description:
				"מסיבת האלווין מטורפת, תחפושות סקסיות\n" +
				"קוד לבוש חובה + מלא אלכוהול",
			image: "https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
		},
		{
			title: "Halaween swing party",
			date: "פתיחת דלתות 21:00",
			description:
				"מסיבת האלווין מטורפת, תחפושות סקסיות\n" +
				"קוד לבוש חובה + מלא אלכוהול",
			image: "https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
		},
	]

	if (showSplash) {
		return (
			<SplashScreen isLoading={isLoading} setShowSplash={setShowSplash} />
		)
	}

	return (
		<AppDefaultLayout useHeader={true} useTabBar={true}>
			<NextSeo
				title={t("site.4P Couples Exchange Parties Swingers")}
				description={t(
					"site.Couples exchange party couples exchange Israeli couples 4P"
				)}
			/>
			<div className={"PartiesScreen"}>
				<div className={"WelcomeText"}>
					<p>
						{t(
							"site.Couples exchanges for those who want to change… and for those who do not want to change can dance, get horny and just enjoy the atmosphere dripping with sex,"
						)}
					</p>
				</div>
				<div className={"UpcomingEvents"}>
					<p className={"BlockHeader"}>{t("site.Weekend")} 25-26</p>

					{anonGetEvents &&
						anonGetEvents.results &&
						anonGetEvents.results.map(
							(event: any, index: number) => {
								if (index > 1) {
									return null
								}

								let url = ""
								let filename = ""

								try {
									url = event.event_images.find(
										(s: any) => s.image_type === "MAIN"
									).url
									filename = event.event_images.find(
										(s: any) => s.image_type === "MAIN"
									).file_name
								} catch (e) {
									console.log(e)
								}

								return (
									<UpcomingEvent
										key={index}
										image={url + filename}
										// date={event.date}
										date={format(
											new Date(event.date),
											"eeee, dd/MM • HH:mm",
											{locale: locale}
										)}
										description={event.description}
										href={`/events/${event.id}`}
									/>
								)
							}
						)}

					{!anonGetEvents &&
						demoUpcomingEvents &&
						demoUpcomingEvents.map((event: any, index: number) => {
							return (
								<UpcomingEvent
									key={index}
									image={event.image}
									date={event.date}
									description={event.description}
									href={"/events/91/"}
								/>
							)
						})}
				</div>
				<div className={"EventList"}>
					<p className={"SectionTitle"}>{t("site.More parties")}</p>
					<Divider />

					{anonGetEvents &&
						anonGetEvents.results &&
						anonGetEvents.results.map(
							(event: any, index: number) => {
								const exclude = [0, 1]
								if (exclude.includes(index)) return null

								let url = ""
								let filename = ""

								try {
									url = event.event_images.find(
										(s: any) => s.image_type === "SUB"
									).url
									filename = event.event_images.find(
										(s: any) => s.image_type === "SUB"
									).file_name
								} catch (e) {
									console.log(e)
								}

								return (
									<Event
										key={index}
										image={url + filename}
										title={event.title}
										description={event.description}
										date={
											t("site.Opening doors") +
											format(
												new Date(event.date),
												"HH:mm",
												{
													locale: locale,
												}
											)
										}
										href={`/events/${event.id}`}
									/>
								)
							}
						)}

					{!anonGetEvents &&
						demoEventList &&
						demoEventList.map((event: any, index: number) => {
							return (
								<Event
									key={index}
									image={event.image}
									title={event.title}
									description={event.description}
									date={event.date}
									href={"/events/92/"}
								/>
							)
						})}
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Link href="https://swingers.co.il/en/articles/155/תקנון-אתר-המסיבות">
						תקנון האתר
					</Link>
				</div>
			</div>
		</AppDefaultLayout>
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

export default PartiesScreenDemo
