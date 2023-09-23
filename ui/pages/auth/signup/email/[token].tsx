// import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import {useRouter} from "next/router"
import {useTranslation} from "next-i18next"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import SuccessPage, {Struct} from "@/components/ui_pages/Success/SuccessPage"
import {NextSeo} from "next-seo"
import {useEmailVerificationMutation} from "@/redux/services"
import {useEffect, useState} from "react"
import NoAuthLayout from "@/components/ui_app/AppLayouts/NoAuthLayout"

function SignUpSuccess() {
	const router = useRouter()
	const {t} = useTranslation("site")
	const {token} = router.query

	const [ready, setReady] = useState(false)

	const [verifyEmail] = useEmailVerificationMutation()

	const toggleReady = () => {
		setTimeout(() => {
			setReady(true)
		}, 1000)
	}

	useEffect(() => {
		if (token) {
			console.log(token)
			verifyEmail({
				token: token.toString(),
			})
				.unwrap()
				.then((r) => {
					console.log(r)
				})
				.catch((e) => {
					console.log(e)
				})
				.finally(() => {
					toggleReady()
				})
		}
	}, [token])

	const pageStruct: Struct = {
		content: [t("site.Your email successfully verified")],
		actions: [
			{
				children: t("site.Sign in"),
				type: "button",
				fullWidth: true,
				id: "button_go_to_auth",
				onClick: () => {
					router.push("/auth/signin").then()
				},
				classname: "SubmitButtonText",
				disabled: !ready,
			},
		],
		close: () => {
			router.push("/").then()
		},
	}

	return (
		<NoAuthLayout useHeader={false} useTabBar={false}>
			<NextSeo title={t("site.Your email successfully verified")} />
			<SuccessPage struct={pageStruct} />
		</NoAuthLayout>
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

export default SignUpSuccess
