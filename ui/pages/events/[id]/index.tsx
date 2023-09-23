import React, {useEffect, useState} from "react"
import SplashScreen from "@/components/ui/Splash/SplashScreen"
import Button from "@/components/ui/Button/Button/Button"
import DisplayEventHeader from "@/components/ui/Events/DisplayEvent/DisplayEventHeader/DisplayEventHeader"
import Divider from "@/components/ui/Divider/Divider"
import Wrapper from "@/components/ui/Layout/Wrapper"
import Image from "@/components/ui/Image/Image"
import {useRouter} from "next/router"
import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {useForm} from "react-hook-form"
import {
	anonGetEvent,
	anonGetEventsPrice,
	useAnonGetEventQuery,
	useAnonGetEventsPriceQuery,
} from "@/services/anonymous.service"
import {format} from "date-fns"
import {enGB, he, ru} from "date-fns/locale"
import {useAppDispatch, wrapper} from "@/redux/store"
import {useAuth} from "@/components/auth/AuthProvider"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import {EventJsonLd, NextSeo} from "next-seo"
import getConfig from "next/config"
import TryTabs from "@/components/ui/Tabs/TryTabs/TryTabs"

const {publicRuntimeConfig} = getConfig()

export type EventDataStep0Type = {
	price_select?: number
	subscription_select?: boolean
}

function PartyScreenDemo(props: any) {
	console.log("data", props)
	const {t} = useTranslation("site")
	const baseUrl = publicRuntimeConfig?.baseUrl || ""
	// splash
	const [isLoading, setIsLoading] = useState(true)
	const [showSplash, setShowSplash] = useState(true)

	// router
	const router = useRouter()
	const {id} = router.query
	const locale =
		router.locale === "he" ? he : router.locale === "ru" ? ru : enGB

	const auth = useAuth()

	// form
	const {handleSubmit, watch, control, reset} = useForm()

	// redux
	const dispatch = useAppDispatch()

	// rtk get event data
	const {data: anonEventData, isLoading: isAnonEventDataLoading} =
		useAnonGetEventQuery({
			eventId: id,
		})

	// rtk get event price data
	const {data: anonEventsPriceData} = useAnonGetEventsPriceQuery({
		eventId: id,
	})

	const priceTypes = [
		{
			id: 0,
			title: "Only drinks",
		},
		{
			id: 1,
			title: "Ticket + drinks",
		},
		{
			id: 2,
			title: "Only ticket",
		},
	]

	// tabs state & function
	const [value, setValue] = useState(1)

	// when form submit
	function onSubmit() {
		router.push(`/events/${id}/signup/1`).then((r) => r)
	}

	// splash screen
	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false)
		}, 1000)
	}, [setIsLoading])

	// when page closed
	function handleClosePage() {
		router.push("/events").then()
	}

	const minPrice =
		anonEventsPriceData?.slice().sort(function (a: any, b: any) {
			return parseFloat(a.price) - parseFloat(b.price)
		})[0] || {}

	const minTypePrice =
		minPrice && priceTypes.find((s) => s.id === minPrice?.ticket_type)

	return (
		<>
			<NextSeo
				title={props.event.data.title}
				description={props.event.data.description}
			/>
			<EventJsonLd
				name={props.event.data.title}
				startDate={props.event.data.date}
				endDate={props.event.data.end_date}
				eventStatus={"https://schema.org/EventScheduled"}
				organizer={"Swingers"}
				eventAttendanceMode={
					"https://schema.org/OfflineEventAttendanceMode"
				}
				location={{
					name: "4PLAY",
					address: {
						addressLocality: "hazerm 9",
						addressRegion: "tel aviv",
						postalCode: "",
						addressCountry: "IL",
					},
				}}
				url={`${baseUrl}/en/events/${props.event.data.id}`}
				images={props.event.data.event_images.map((event: any) => {
					return event.src
				})}
				description={props.event.data.description}
				offers={props.event.prices.map((ticket: any) => {
					return {
						price: ticket?.price,
						priceCurrency: "ILS",
						itemCondition: "https://schema.org/UsedCondition",
						availability: "https://schema.org/InStock",
						url: `${baseUrl}/en/events/${props.event.data.id}`,
						seller: {
							name: "Swingers",
						},
					}
				})}
			/>
			{showSplash ? (
				<SplashScreen
					isLoading={isLoading}
					setShowSplash={setShowSplash}
				/>
			) : (
				<AppDefaultLayout
					fullHeight={true}
					useHeader={false}
					useTabBar={true}
				>
					<div className="PartyScreen">
						<div>
							<DisplayEventHeader
								image={
									anonEventData?.event_images.find(
										(s: any) => s.image_type === "MAIN"
									)?.url +
										anonEventData?.event_images.find(
											(s: any) => s.image_type === "MAIN"
										)?.file_name ||
									"https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
								}
								closeCallback={handleClosePage}
							/>
						</div>
						<div className={"EventDescription"}>
							<p className={"Date"}>
								{!anonEventData && (
									<>
										{t("site.Thursday")}, 25/11
										<br />
										21:00
										<br />
										{t("site.4PLAY Club")}
									</>
								)}

								{anonEventData && anonEventData.date && (
									<>
										{format(
											new Date(anonEventData.date),
											"dd/MM, eeee",
											{
												locale: locale,
											}
										)}
										<br />
										{format(
											new Date(anonEventData.date),
											"HH:mm",
											{
												locale: locale,
											}
										)}
										<br />
										{t("site.4PLAY Club")}
									</>
								)}
							</p>
							<Divider />
							<div className="Info">
								{!anonEventData && (
									<>
										<p>
											{t(
												"site.An evening of games in lots of intimate complexes"
											)}
											<br />
											{t(
												"site.That's the secret of"
											)}{" "}
											4PLAY{" "}
											{t(
												"site.A great club that has it all, from intimacy of conversation and acquaintance between two couples to a full dance floor and lots of space in the middle for playrooms and fantasies that suit any couple wherever he is"
											)}
										</p>
										<p>
											{t(
												"site.You want to play the game of the greats. A playground with only winners A fascinating, sensual, fascinating and discreet playground Your place in 4PLAY - the leading club in Israel for the liberal scene."
											)}
										</p>
										<p>
											{t(
												"site.Swingers is not just an exchange of couples it is actually a living and breathing community"
											)}
										</p>
									</>
								)}

								{anonEventData && anonEventData.description && (
									<p>{anonEventData.description}</p>
								)}
							</div>
						</div>
						<Wrapper>
							<div className={"EventPrices"}>
								<p>
									<strong>{t("site.Tickets")}:</strong>
								</p>
								{anonEventsPriceData ? (
									<div>
										{anonEventsPriceData.map(
											(item: any, index: number) => {
												const type = priceTypes.find(
													(s) =>
														s.id ===
														item.ticket_type
												)
												return (
													<p key={index}>
														<span>
															{type!.title}
														</span>{" "}
														- {`${item.price}`} ₪
													</p>
												)
											}
										)}
									</div>
								) : (
									<>
										<p>
											<span>
												{t("site.A ticket for two")}
											</span>{" "}
											- 150 ₪
										</p>
										<p>
											<span>VIP {t("site.card")}</span> -
											250 ₪{" "}
											{t(
												"site.The couple includes unlimited alcohol"
											)}
											<br />
											{t(
												"site.+ Admission to a Friday party at no cost"
											)}
										</p>
									</>
								)}
							</div>
						</Wrapper>
						<div className={"EventTabs"}>
							<TryTabs
								currentValue={value}
								setValue={setValue}
								tabs={[
									{
										value: 1,
										title: t("site.4PLAY Club"),
									},
									{
										value: 2,
										title: t("site.Behavior rules"),
									},
								]}
							/>

							{/* tab 1 */}
							{value === 1 && (
								<div className={"TabPanelContainer"}>
									<Image
										src={
											"https://images.pexels.com/photos/2585614/pexels-photo-2585614.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
										}
									/>
									<div className={"TabBody"}>
										<p>
											<strong>
												{t("site.What is 4P")}{" "}
												{t("site.A new concept")}
											</strong>
										</p>
										<p>
											{t(
												"site.After many years in which we have produced parties in different places for many years and even with great success a new era in the community begins - an international era. One of the big differences in"
											)}
											4PLAY{" "}
											{t(
												"site.Is that the place will serve the community for the entire month."
											)}
										</p>
										<p>
											{t(
												"site.And this year after the Corona the 4PLAY will also be hosted at our flagship club in Tel Aviv from time to time. It has been a club of Pent Z ya on an international scale"
											)}
										</p>
										<p>
											{t(
												"site.The members of the club are very similar in the needs of the community but different in atmosphere and vibe. Worth a try both"
											)}
										</p>
										<p>
											4PLAY -{" "}
											{t(
												"site.The ultimate club for couples. No longer a place we rehearsed for parties but a place built specifically for swingers events. From the well-equipped Dance floor that will receive you, with the right lighting, the large smoking area, the huge sofas, the maze PLAYROOM - THE MAZE - THE GLORY HOLE and in general - our whole goal is to save you the trips to Berlin, Amsterdam and Paris"
											)}
										</p>
										<p>
											{t(
												"site.Today it can be said that there is a club for couples at a European level - no less"
											)}
										</p>
										<p>
											<strong>
												{t(
													"site.And where is it Your 4PLAY"
												)}
											</strong>
										</p>
										<p>
											{t(
												"site.4PLAY SHARON is located in the southern Sharon region 5-7 minutes from the center of Tel Aviv. 4PLAY TLV is located in the southern region of Florida - in an ultimate and discreet location"
											)}
										</p>
										<p>
											{t(
												"site.The ones that are amazing in these clubs that are in the center of the country and at the same time are in discreet locations that this community loves"
											)}
										</p>
										<p>
											{t(
												"site.Nia abounds in abundance, anonymity and absolute privacy. Both in Tel Aviv and in the Sharon. The shortcut - freedom"
											)}
										</p>
									</div>
								</div>
							)}

							{/* tab 2 */}
							{value === 2 && (
								<div className={"TabPanelContainer"}>
									<div className="TabBody">
										<p>
											<strong>
												{t("site.Why do we use it")}
											</strong>
										</p>
										<p>
											{t(
												"site.And it is an established fact that the readers mind will be distracted by readable texts"
											)}
										</p>
										<p>{t("site.Where can I get it")}</p>
										<p>
											{t(
												"site.Q Lots of versions available for Lorem Ipsum paragraphs"
											)}
										</p>
									</div>
								</div>
							)}
						</div>
						<div className={"EventRegister"}>
							<div className={"PriceInfo"}>
								<p>
									{t("site.Tickets")}
									<br />
									{t("site.Starting")}{" "}
									{`${minPrice.price} ₪` || "0"}{" "}
									{minTypePrice?.title || ""}
								</p>
							</div>
							<div className={"Actions"}>
								<Button
									type={"button"}
									onClick={onSubmit}
									id={"button_register_to_event"}
								>
									<span className={"ButtonText"}>
										{t("site.To register")}
									</span>
								</Button>
							</div>
						</div>
					</div>
				</AppDefaultLayout>
			)}
		</>
	)
}

export const getServerSideProps = wrapper.getServerSideProps((store) => {
	return async (context: any) => {
		const locale = context.locale || "en"
		const eventId = context.params.id || "0"

		const eventData = await store.dispatch(
			anonGetEvent.initiate({
				eventId: eventId,
			})
		)
		const eventPrices = await store.dispatch(
			anonGetEventsPrice.initiate({
				eventId: eventId,
			})
		)

		return {
			props: {
				locale: locale,
				event: {
					id: eventId,
					data:
						eventData.status === "fulfilled"
							? eventData.data
							: null,
					prices:
						eventPrices.status === "fulfilled"
							? eventPrices.data
							: null,
				},
				...(await serverSideTranslations(locale, ["site"])),
			},
		}
	}
})

export default PartyScreenDemo
