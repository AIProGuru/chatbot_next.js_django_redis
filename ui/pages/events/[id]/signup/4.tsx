import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import Button from "@/components/ui/Button/Button/Button"
import {useForm, Controller} from "react-hook-form"
import React, {useEffect, useState} from "react"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import {useRouter} from "next/router"
import {useAppDispatch, useAppSelector} from "@/redux/store"
import {saveAnonStep4, saveAnonStep5} from "@/redux/slices/AnonEventSignUpSlice"
import {
	useAnonGetEventQuery,
	useAnonGetEventsPriceQuery,
	useAnonGetPairedEventPriceQuery,
	useAnonRegisterUserToEventMutation,
	UserData,
} from "@/services/anonymous.service"
import {useAuth} from "@/components/auth/AuthProvider"
import {useGetUserProfilesQuery} from "@/services/users.service"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import InputRadioWithPrice from "@/components/ui/Forms/Inputs/Radio/InputRadioWithPrice"
import InputSwitch from "@/components/ui/Forms/Inputs/Switch/InputSwitch"
import {format} from "date-fns"
import {enGB, he, ru} from "date-fns/locale"
import Link from "@/components/ui/Button/Link/Link"
import Divider from "@/components/ui/Divider/Divider"
import {clearObject} from "@/app/utils"
import {NextSeo} from "next-seo"

type Profile = {
	profile_type: "MAN" | "WOMAN" | "COUPLE"
	man?: {
		nickname?: string
		age?: number
	}
	woman?: {
		nickname?: string
		age?: number
	}
}

function SelectPrice() {
	const {t} = useTranslation("site")
	const [profile, setProfile] = useState<Profile | null>(null)
	const [profilesType, setProfilesType] = useState<string[]>([])
	// router
	const router = useRouter()
	const {id} = router.query
	const {handleSubmit, watch, control, setValue} = useForm()
	const [mainPrice, setMainPrice] = useState<number>(0)
	const [pairedPrice, setPairedPrice] = useState<number>(0)

	const locale =
		router.locale === "he" ? he : router.locale === "ru" ? ru : enGB

	// redux
	const dispatch = useAppDispatch()

	const auth = useAuth()

	// redux state
	const anonSignUpData = useAppSelector((state) => state.anonEventSignUp)

	// rtk get user data
	// todo: pagination 100
	const {data: userProfilesData} = useGetUserProfilesQuery({
		query: "",
		page: 1,
		pageSize: 10,
	})

	// rtk mutation to register user
	const [
		registerUserToEvent,
		{
			data: registerUserToEventResponse,
			isSuccess: registerUserToEventSuccess,
			error: registerUserToEventError,
		},
	] = useAnonRegisterUserToEventMutation()

	// rtk get event data
	const {data: anonEventData, isLoading: isAnonEventDataLoading} =
		useAnonGetEventQuery({
			eventId: id,
		})

	// rtk get event price data
	const {data: anonEventsPriceData} = useAnonGetEventsPriceQuery({
		eventId: id,
	})

	// rtk get pair event price data
	const {data: anonGetPairedEventPrice} = useAnonGetPairedEventPriceQuery({
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

	const priceSelect = watch("price_select")
	const subscriptionSelect = watch("subscription_select")
	const pairedPriceSelect = watch("paired_price_select")

	const autoChangeValuePrice = (id: string, type: "main" | "paired") => {
		if (type == "paired") {
			const activeMainPrice = anonEventsPriceData.find(
				(item: any) => item.id == id
			)
			const searchPairedPrice =
				anonGetPairedEventPrice.paired_event?.prices.find(
					(item: any) =>
						item.ticket_type === activeMainPrice?.ticket_type
				)
			if (searchPairedPrice) {
				setValue("paired_price_select", searchPairedPrice.id)
			}
		}
		if (type == "main") {
			const activePairPrice =
				anonGetPairedEventPrice.paired_event?.prices.find(
					(item: any) => item.id == id
				)
			const searchMainPrice = anonEventsPriceData.find(
				(item: any) => item.ticket_type === activePairPrice?.ticket_type
			)
			if (searchMainPrice) {
				setValue("price_select", searchMainPrice.id)
			}
		}
	}

	useEffect(() => {
		if (!subscriptionSelect) return
		autoChangeValuePrice(priceSelect, "paired")
	}, [priceSelect])

	useEffect(() => {
		if (!subscriptionSelect) return
		autoChangeValuePrice(pairedPriceSelect, "main")
	}, [pairedPriceSelect])

	useEffect(() => {
		if (!subscriptionSelect) {
			setValue("paired_price_select", "0")
			setPairedPrice(0)
		} else {
			setValue(
				"paired_price_select",
				anonGetPairedEventPrice.paired_event?.prices[0]?.id || "0"
			)
		}
	}, [subscriptionSelect])

	useEffect(() => {
		if (anonEventsPriceData) {
			const price = anonEventsPriceData?.find(
				(item: any) => item.id == priceSelect
			)?.price
			if (price) {
				setMainPrice(parseFloat(price))
			}
		}
	}, [priceSelect])

	useEffect(() => {
		if (anonGetPairedEventPrice?.paired_event) {
			const price = anonGetPairedEventPrice.paired_event.prices.find(
				(item: any) => item.id == pairedPriceSelect
			)?.price
			if (price) {
				setPairedPrice(parseFloat(price))
			}
		}
	}, [pairedPriceSelect])

	const withoutDiscountSum = mainPrice + pairedPrice
	const discount =
		parseFloat(anonGetPairedEventPrice?.discount).toFixed(0) || "0"
	const getTotalPrice = () => {
		const discountValue = parseFloat(discount) / 100 || 0
		if (subscriptionSelect) {
			switch (anonGetPairedEventPrice?.discount_type) {
				case "FOR_BOTH":
					return (
						withoutDiscountSum - withoutDiscountSum * discountValue
					)
				case "ON_MAIN":
					return mainPrice - mainPrice * discountValue + pairedPrice
				case "ON_PAIRED":
					return pairedPrice - pairedPrice * discountValue + mainPrice
				default:
					return mainPrice
			}
		} else {
			return mainPrice
		}
	}

	console.log(anonSignUpData.notifications)

	const getNotifySmsType = () => {
		if (!anonSignUpData.notifications) return
		switch (anonSignUpData.notifications) {
			case "SMS":
				return "SMS"
			case "WhatsAPP":
				return "WHATSAPP"
		}
	}

	const saveUserData = () => {
		const data: UserData = clearObject({
			user_id: anonSignUpData.userId,
			price: anonSignUpData.price_select,
			is_paired_event: anonSignUpData.is_paired_event,
			subscription: anonSignUpData.subscription_select,
			profile_type: anonSignUpData.profile_type,
			man_age: anonSignUpData.age?.man,
			woman_age: anonSignUpData.age?.woman,
			man_nickname: anonSignUpData.nickname?.man,
			woman_nickname: anonSignUpData.nickname?.woman,
			phone_number: anonSignUpData.phone_number,
			otp_code: anonSignUpData.otp_code,
			signature: anonSignUpData.signature,
			kind_of_payment: anonSignUpData.payment_method,
			messenger_type: getNotifySmsType(),
		})

		const titles = subscriptionSelect
			? [
					anonEventData?.title,
					anonGetPairedEventPrice.paired_event?.title,
			  ]
			: [anonEventData?.title]

		registerUserToEvent({
			eventId: (id && id.toString()) || "",
			data: data,
		})
			.unwrap()
			.then((r: any) => {
				dispatch(
					saveAnonStep5({
						visitor_id: r.id,
						title_events: titles.join(", "),
					})
				)
				if (anonSignUpData.payment_method === "CARD") {
					router.push(`/events/${id}/signup/payment`).then()
					return
				}
				router.push(`/events/${id}/signup/done`).then()
			})
			.catch((e) => {
				console.log(e)
				if (e.data.non_field_errors) {
					alert(e.data.non_field_errors[0])
				} else {
					alert(e.data.message)
				}
			})
	}

	// on form submit
	const onSubmit = (paymentMethod: "CARD" | "CASH") => {
		if (priceSelect == 0) return
		const data = {
			price_select: priceSelect,
			payment_method: paymentMethod,
			is_paired_event: pairedPriceSelect !== "0" ? true : false,
			totalPrice: parseFloat(getTotalPrice().toFixed(2)),
			price_without_discount: parseFloat(withoutDiscountSum.toFixed(2)),
			discount: subscriptionSelect ? discount : "0",
			only_discount: subscriptionSelect
				? (withoutDiscountSum - getTotalPrice()).toFixed(2)
				: "0.00",
			subscription_select: subscriptionSelect,
		}
		dispatch(saveAnonStep4(data))
	}

	useEffect(() => {
		if (anonSignUpData.price_select && !anonSignUpData!.visitor_id) {
			saveUserData()
		}
	}, [anonSignUpData])

	// when go back from page
	const handleStepBack = () => {
		router.push(`/events/${id}/`).then((r) => r)
	}

	return (
		<AppDefaultLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<NextSeo title={t("site.Step 4 Select a card")} />
			<div className={"PartyScreen"}>
				<div className={"PriceContainer"}>
					<div className={"GoBack"}>
						<TransparentButton
							icon={<CloseIcon style={"light"} />}
							id={"transparent_button_go_back"}
							onClick={handleStepBack}
						/>
					</div>
					<p className={"Info"}>
						{anonEventData && anonEventData.date && (
							<>
								<strong>{anonEventData?.title}</strong>
								<br />
								{format(
									new Date(anonEventData.date),
									"dd/MM, eeee",
									{
										locale: locale,
									}
								)}
								<br />
								{format(new Date(anonEventData.date), "HH:mm", {
									locale: locale,
								})}
							</>
						)}
					</p>
					<div className={"Selector"}>
						{anonEventsPriceData && (
							<Controller
								render={({field}) => (
									<>
										{anonEventsPriceData.map(
											(price: any, index: number) => {
												const type = priceTypes.find(
													(s) =>
														s.id ===
														price.ticket_type
												)

												return (
													<InputRadioWithPrice
														value={price.id}
														price={`${price.price} ₪`}
														title={
															type
																? type.title
																: ""
														}
														field={field}
														id={
															"input_radio_with_price_" +
															index
														}
														key={price.id}
													/>
												)
											}
										)}
									</>
								)}
								name={"price_select"}
								control={control}
								defaultValue={
									`${anonEventsPriceData[0]?.id}` || "0"
								}
							/>
						)}
					</div>
					{anonGetPairedEventPrice &&
						anonGetPairedEventPrice.discount && (
							<>
								<Divider />
								<div className={"SwitchContainer"}>
									<Controller
										render={({field}) => (
											<InputSwitch
												field={field}
												value={"switch1"}
												title={
													t(
														"site.I want to come to Fridays party too"
													) +
													parseFloat(
														anonGetPairedEventPrice.discount
													).toFixed(0) +
													t(
														"site.Discount for a combined ticket Thursday + Friday"
													)
												}
												id={"input_switch_1"}
												discountVariant
											/>
										)}
										name={"subscription_select"}
										control={control}
										defaultValue={false}
									/>
								</div>
							</>
						)}
					{subscriptionSelect && anonGetPairedEventPrice && (
						<>
							<p className={"Info"}>
								{anonGetPairedEventPrice.paired_event?.date && (
									<>
										<strong>
											{anonGetPairedEventPrice
												.paired_event?.title || "-"}
										</strong>
										<br />
										{format(
											new Date(
												anonGetPairedEventPrice.paired_event?.date
											),
											"dd/MM, eeee",
											{
												locale: locale,
											}
										)}
										<br />
										{format(
											new Date(
												anonGetPairedEventPrice.paired_event?.date
											),
											"HH:mm",
											{
												locale: locale,
											}
										)}
									</>
								)}
							</p>
							<div className={"Selector"}>
								{anonGetPairedEventPrice &&
									anonGetPairedEventPrice.paired_event
										?.prices && (
										<Controller
											render={({field}) => (
												<>
													{anonGetPairedEventPrice.paired_event?.prices.map(
														(
															price: any,
															index: number
														) => {
															const type =
																priceTypes.find(
																	(s) =>
																		s.id ===
																		price.ticket_type
																)

															return (
																<InputRadioWithPrice
																	value={
																		price.id
																	}
																	price={`${price.price} ₪`}
																	title={
																		type
																			? type.title
																			: ""
																	}
																	field={
																		field
																	}
																	id={
																		"input_radio_with_paired_price_" +
																		index
																	}
																	key={
																		price.id
																	}
																/>
															)
														}
													)}
												</>
											)}
											name={"paired_price_select"}
											control={control}
											defaultValue={"0"}
										/>
									)}
							</div>
						</>
					)}
				</div>
				<div className={"BottomContainer"}>
					<div className={"Subtotal"}>
						{/* <div className={"PromoCode"}>
							<div className={"Input"}>
								<Controller
									render={({field}) => (
										<InputText
											placeholder={
												t("site.Do you have a coupon code Enter here")
											}
											id={"input_message"}
											field={field}
										/>
									)}
									name={"message"}
									control={control}
									defaultValue={""}
								/>
							</div>
							<div className={"Button"}>
								<Button
									type={"button"}
									fullWidth={true}
									id={"button_send_message"}
									prevent={false}
									variant={"outline"}
									mode={"submit"}
									onClick={() => handleSubmit(onSubmit)}
								>
									<p>{t("site.Activate a coupon")}</p>
								</Button>
							</div>
						</div> */}
						<div className={"TotalPriceContainer"}>
							<p>{t("site.Interim amount")}</p>
							<p>{withoutDiscountSum.toFixed(2)} ₪</p>
						</div>
						<div className={"TotalPriceContainer"}>
							<p>
								{t("site.Discount")}{" "}
								{` ${subscriptionSelect ? discount : 0}%`}
							</p>
							<p>
								{(withoutDiscountSum - getTotalPrice()).toFixed(
									2
								)}
								- ₪
							</p>
						</div>
					</div>
					<div className={"Total"}>
						<div className={"TotalPriceContainer"}>
							<p>{t("site.Total payment")}</p>
							<p>{getTotalPrice().toFixed(2)} ₪</p>
						</div>
						<Button
							type={"button"}
							mode={"submit"}
							fullWidth={true}
							id={"submit_button_in_form_with_prices"}
							prevent={false}
							onClick={() => {
								onSubmit("CARD")
							}}
						>
							<p className={"SubmitButtonText"}>
								{t("site.For payment on credit")}
							</p>
						</Button>
						<div className={"WithoutCard"}>
							<Link
								onClick={() => {
									onSubmit("CASH")
								}}
								styled
							>
								{t(
									"site.I want to pay at the entrance to the party"
								)}
							</Link>
						</div>
					</div>
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

export default SelectPrice
