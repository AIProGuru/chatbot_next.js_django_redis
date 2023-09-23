import styles from "./SubscriptionsModal.module.scss"
import {TFunction, useTranslation} from "next-i18next"
import {useRouter} from "next/router"
import React, {useEffect, useMemo, useState} from "react"
import {useForm, Controller, useWatch} from "react-hook-form"
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
import SubscriptionNotification from "@/components/ui/Subscripbtions/Notification/SubscriptionNotification"
import Link from "@/components/ui/Button/Link/Link"
import {
	useGetUrlSubPaymentMutation,
	useLazyGetUserSubscriptionQuery,
} from "@/services/payment.service"
import {format} from "date-fns"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"

interface SubscriptionsPageProps {
	editProfileState?: any
}

type FormData = {
	[x: string]: any
}


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

function SubscriptionsModal(props: SubscriptionsPageProps) {
	const {editProfileState} = props
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

	const userProfilesData = useGetUserProfilesInfo()

	// rtk get user data
	// const userProfilesData = useGetUserProfilesInfo()

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
		// TODO: fix the user subs to take subscription from user profiles info
		// triggerGetUserSubs({})
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
		if (!userSubResponse?.data?.subscription_type) {
			setValue("subscription_type", "single")
		}
	}, [userSubResponse])

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

	const getTypeSub = () => {
		if (userProfilesData && userProfilesData.trial) {
			return "VIP"
		} else if (
			userSubResponse &&
			userSubResponse.data?.payment?.checkout_data?.subscription?.title
		) {
			return userSubResponse.data?.payment?.checkout_data?.subscription
				.title
		} else {
			return "Free"
		}
	}

	const getValidSub = () => {
		if (
			userProfilesData &&
			userProfilesData.trial &&
			userProfilesData.subscription_date_to
		) {
			return format(
				new Date(userProfilesData.subscription_date_to).getTime(),
				"yyyy-MM-dd"
			)
		}
		if (userSubResponse && userSubResponse.data?.date_to) {
			return format(
				new Date(userSubResponse.data?.date_to).getTime(),
				"yyyy-MM-dd"
			)
		}
		return undefined
	}

	return (
		<div className={styles.SubscriptionsModal}>
			<div className={styles.Container}>
				<SubscriptionNotification
					subscription={{
						type: getTypeSub(),
						valid_until: getValidSub(),
					}}
					onClick={() => {
						// handleCallback("/profiles/my/subscriptions")
						// updateDrawer(true)
					}}
				/>

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
															id={subscriptionType.id.toString()}
															title={
																subscriptionType.title
															}
															field={field}
															disabled={
																subscriptionType.type ===
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
							/>
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
						<div className={styles.SubscriptionDescription}>
							{getDescription() && <p>{getDescription()}</p>}
						</div>
						<div className={styles.Actions}>
							<Button
								type={"button"}
								fullWidth={true}
								mode={"submit"}
								prevent={false}
								onClick={() => {
									if (
										subscriptions.length &&
										subscriptionType &&
										subscriptionPrice
									) {
										registerGetUrlSubPayment({
											id: subscriptionPrice,
										})
											.unwrap()
											.then((r) => {
												console.log("r", r)
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
								disabled={
									subscriptions.length &&
									subscriptionType &&
									subscriptionPrice &&
									subscriptionPrice !==
										userSubResponse.data?.payment
											?.subscription_price_id
										? false
										: true
								}
							>
								<p className={styles.SubmitButtonText}>
									{
										pageTranslations.subscriptions.form
											.actions.submit_button_text
									}
								</p>
							</Button>
							<div
								className={
									styles.SubscriptionContactUsDescription
								}
							>
								<p>
									<Link
										href={"/pages/contact-us/contact"}
										id={"contact-us"}
										styled={true}
										// variant={"signin"}
									>
										{t("site.Contact Us")}
									</Link>{" "}
									{t("site.to cancel the subscription")} 
								</p>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

// export default SubscriptionsModal
const mapStateToProps = (state: any) => ({
	editProfileState: state.EditProfileSlice,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionsModal)
