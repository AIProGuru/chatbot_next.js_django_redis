import styles from "./SubscriptionsPage.module.scss"
import {TFunction, useTranslation} from "next-i18next"
import {useRouter} from "next/router"
import React, {useEffect, useMemo, useState} from "react"
import BlogNewHeader from "@/components/ui/Blog/New/Header/BlogNewHeader"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import SubRabbitRoundedIcon from "@/components/ui/Icons/SubRabbitRounded/SubRabbitRoundedIcon"
import {useForm, Controller, useWatch} from "react-hook-form"
//import InputRadioSubscription from "@/components/ui/Forms/Inputs/RadioSubscription/InputRadioSubscription"
import InputRadioSubscriptionType from "@/components/ui/Forms/Inputs/RadioSubscriptionType/InputRadioSubscriptionType"
import Button from "@/components/ui/Button/Button/Button"
import {goBackEditMode} from "@/components/ui/Functions/GoBack"
import {toggleEditMode} from "@/redux/slices/EditProfileSlice"
import {connect} from "react-redux"
import {
	SubPrices,
	Subscription,
	useLazyGetSubscriptionsQuery,
} from "@/services/subscription.service"
import {uniqueArrayByParam} from "@/components/ui/Functions/UniqueArray"
import InputRadioSubscription from "@/components/ui/Forms/Inputs/RadioSubscription/InputRadioSubscription"
import {
	useGetUrlSubPaymentMutation,
	useLazyGetUserSubscriptionQuery,
} from "@/services/payment.service"
import Link from "@/components/ui/Button/Link/Link"

interface SubscriptionsPageProps {
	editProfileState?: any
	signup?: boolean
}

type FormData = {
	[x: string]: any
}

type SubscriptionType = {
	id: string
	title: string
	value: string
}

// type SubscriptionPrice = {
// 	id: string
// 	title: string
// 	price: number
// 	value: string
// }

const getPageTranslations = (t: TFunction) => {
	return {
		subscriptions: {
			choose_plan: t("site.Now it remains only to choose a plan"),
			form: {
				sub_types: {
					lite: t("site.lite swingers"),
					vip: "VIP SWINGERS",
				},
				sub_description: t("site.VIP subscription allows"),
				sub_prices: {
					one_month: t("site.1 month"),
					three_months: t("site.3 months"),
					one_year: t("site.1 year"),
				},
				actions: {
					submit_button_text: t("site.We will continue"),
				},
			},
		},
	}
}

function SubscriptionsPage(props: SubscriptionsPageProps) {
	const {editProfileState, signup} = props
	const {t} = useTranslation("site")
	const router = useRouter()
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])
	const {handleSubmit, control, reset, setValue} = useForm<FormData>()

	const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

	const [triggerGetSubs, subResponse] = useLazyGetSubscriptionsQuery()
	const [triggerGetUserSubs, userSubResponse] =
		useLazyGetUserSubscriptionQuery()

	const [registerGetUrlSubPayment] = useGetUrlSubPaymentMutation()

	const subscriptionType = useWatch({
		control,
		name: "subscription_type",
	})

	const subscriptionPrice = useWatch({
		control,
		name: "subscription_price",
	})

	useEffect(() => {
		triggerGetSubs({})
		triggerGetUserSubs({})
	}, [])

	useEffect(() => {
		if (subResponse && subResponse.isSuccess && !subResponse.isFetching) {
			setSubscriptions((prevState) =>
				uniqueArrayByParam(
					[...prevState, ...subResponse.data.items],
					"id"
				)
			)
		}
	}, [subResponse])

	useEffect(() => {
		setValue("subscription_price", "")
	}, [subscriptionType])

	useEffect(() => {
		if (signup && subscriptions.length) {
			setValue("subscription_type", "without")
		} else if (!userSubResponse?.data?.subscription_type) {
			setValue("subscription_type", "single")
		}
	}, [subscriptions, userSubResponse])

	useEffect(() => {
		if (
			userSubResponse &&
			userSubResponse.data &&
			userSubResponse.data.subscription_type
		) {
			setValue(
				"subscription_type",
				userSubResponse.data.subscription_type
			)
		}
	}, [userSubResponse])

	function onFormSubmit(data: FormData) {
		console.log(data)
	}

	function goBack() {
		if (signup) {
			router.push("/")
			return
		}
		if (editProfileState && editProfileState.editMode) {
			goBackEditMode(router, toggleEditMode)
			return
		}

		router.back()
	}

	const subPrices =
		(subscriptionType &&
			subscriptions.find((sub) => {
				return sub.type === subscriptionType
			})?.prices) ||
		[]

	const disabled = () => {
		if (signup) {
			if (subscriptions.length && subscriptionType) {
				return false
			} else {
				return true
			}
		} else {
			if (subscriptions.length && subscriptionType && subscriptionPrice) {
				return false
			} else {
				return true
			}
		}
	}

	const sub = subscriptions.find((sub) => {
		return subscriptionType === sub.type
	})

	const getDescription = () => {
		if (sub && sub.description) {
			return sub.description
		} else {
			return ""
		}
	}

	// console.log("getDescription", getDescription())
	return (
		<div className={styles.SubscriptionsPage}>
			<BlogNewHeader
				callback={() => {
					goBack()
				}}
				icon={<CloseIcon style={"light"} />}
			/>

			<div className={styles.Icon}>
				<SubRabbitRoundedIcon />
			</div>

			<div className={styles.Container}>
				<div className={styles.ChoosePlan}>
					{pageTranslations.subscriptions.choose_plan}
				</div>

				<div className="Form">
					<form onSubmit={handleSubmit(onFormSubmit)}>
						<div className={styles.SubscriptionsList}>
							<Controller
								render={({field}) => (
									<>
										{subscriptions &&
											subscriptions.map(
												(
													subscriptionType: Subscription
												) => {
													return (
														<InputRadioSubscriptionType
															key={
																subscriptionType.id
															}
															value={
																subscriptionType.type
															}
															id={
																subscriptionType.id
															}
															title={
																subscriptionType.title
															}
															field={field}
															signup={signup}
															disabled={
																signup
																	? false
																	: subscriptionType.type ===
																	  "without"
															}
														/>
													)
												}
											)}
									</>
								)}
								name={"subscription_type"}
								control={control}
								// defaultValue={"single"}
							/>
						</div>
						<div className={styles.SubscriptionDescription}>
							{getDescription() && <p>{getDescription()}</p>}
						</div>
						<div className={styles.PriceList}>
							<Controller
								render={({field}) => (
									<>
										{subPrices &&
											subPrices.map(
												(
													subscriptionPrice: SubPrices
												) => {
													return (
														<InputRadioSubscription
															key={
																subscriptionPrice.id
															}
															value={
																subscriptionPrice.id
															}
															currentPrice={
																userSubResponse
																	?.data
																	?.payment
																	?.subscription_price_id
															}
															price={subscriptionPrice.price.toString()}
															title={
																subscriptionPrice.cycle_description
																	? subscriptionPrice.cycle_description
																	: `${subscriptionPrice.time_duration} ${subscriptionPrice.time_cycle}`
															}
															field={field}
															disabled={
																userSubResponse
																	?.data
																	?.payment
																	?.subscription_price_id ===
																subscriptionPrice.id
															}
														/>
													)
												}
											)}
									</>
								)}
								name={"subscription_price"}
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={styles.Actions}>
							<Button
								type={"button"}
								fullWidth={true}
								mode={"submit"}
								prevent={false}
								onClick={() => {
									if (
										signup &&
										subscriptionType === "without"
									) {
										router.push("/")
										return
									}
									if (
										subscriptions.length &&
										subscriptionType &&
										subscriptionPrice
									) {
										// router
										// 	.push(
										// 		`/profiles/my/subscriptions/payment/${subscriptionPrice}`
										// 	)
										// 	.then()
										registerGetUrlSubPayment({
											id: subscriptionPrice,
										})
											.unwrap()
											.then((r) => {
												window.location.href = r
											})
											.catch((e) => {
												console.log(e)
											})
									}
									// const subId = subscriptions.find((sub) => {
									// 	return sub.type === subscriptionType
									// })
								}}
								disabled={disabled()}
							>
								<p className={styles.SubmitButtonText}>
									{
										pageTranslations.subscriptions.form
											.actions.submit_button_text
									}
								</p>
							</Button>
						</div>
						<div
							className={styles.SubscriptionContactUsDescription}
						>
							<p>
								<Link
									href={
										"/articles/51/%D7%93%D7%A3-%D7%94%D7%A1%D7%91%D7%A8-%D7%9C%D7%A1%D7%95%D7%92%D7%99-%D7%94%D7%9E%D7%A0%D7%95%D7%99%D7%99%D7%9D-%D7%95%D7%A8%D7%9B%D7%99%D7%A9%D7%AA-%D7%9E%D7%A0%D7%95%D7%99"
									}
									id={"contact-us"}
									styled={true}
									// variant={"signin"}
								>
									{t(
										"site.To learn more about subscription types and payment methods, click here"
									)}
								</Link>
							</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

// export default SubscriptionsPage
const mapStateToProps = (state: any) => ({
	editProfileState: state.EditProfileSlice,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionsPage)
