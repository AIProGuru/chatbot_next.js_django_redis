import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import React, {useEffect, useState} from "react"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import {useRouter} from "next/router"
// import {useAppSelector} from "@/redux/store"
// import {useGetUserProfilesQuery} from "@/services/users.service"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
// import {enGB, he, ru} from "date-fns/locale"
import {
	// useGetUrlPaymentMutation,
	useGetUrlSubPaymentMutation,
} from "@/services/payment.service"
import SplashScreen from "@/components/ui/Splash/SplashScreen"
import {NextSeo} from "next-seo"

function Payment() {
	const {t} = useTranslation("site")

	// router
	const router = useRouter()
	const {subID} = router.query
	const [paymentUrl, setPaymentUrl] = useState<string>("")

	const [isLoading, setIsLoading] = useState(true)
	const [showSplash, setShowSplash] = useState(true)

	// when go back from page
	const handleStepBack = () => {
		router.push(`/`).then(() => {
			router.reload()
		})
	}

	const [registerGetUrlSubPayment] = useGetUrlSubPaymentMutation()

	useEffect(() => {
		if (typeof subID !== "string" || !subID) return
		registerGetUrlSubPayment({
			id: subID,
		})
			.unwrap()
			.then((r) => {
				console.log("r", r)
				setPaymentUrl(r)
			})
			.catch((e) => {
				console.log(e)
			})
	}, [subID])

	// splash screen
	useEffect(() => {
		if (paymentUrl) {
			setIsLoading(false)
		}
	}, [setIsLoading, paymentUrl])

	if (showSplash) {
		return (
			<SplashScreen isLoading={isLoading} setShowSplash={setShowSplash} />
		)
	}

	// show data
	// console.log("Get profile data: ", userProfilesData)

	return (
		<AppDefaultLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<NextSeo title={t("site.payment")} />
			<div className={"PartyScreen"}>
				<div className={"PaymentContainer"}>
					<div className={"Header"}>
						<div className={"HeaderTitle"}>
							<p>{t("site.For a fee")}</p>
						</div>
						<div className={"GoBack"}>
							<TransparentButton
								icon={<CloseIcon style={"light"} />}
								id={"transparent_button_go_back"}
								onClick={handleStepBack}
							/>
						</div>
					</div>
					{paymentUrl && (
						<iframe
							src={paymentUrl}
							width="100%"
							height="1200px"
							seamless
						/>
					)}
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

export default Payment
