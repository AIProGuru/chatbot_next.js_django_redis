import {useRouter} from "next/router"
import {useEffect, useState} from "react"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import SignUpProfileStep1 from "@/components/ui_app/SignUp/Steps/Step1Profile"
import SignUpProfileStep2 from "@/components/ui_app/SignUp/Steps/Step2Profile"
import SignUpProfileStep3 from "@/components/ui_app/SignUp/Steps/Step3Profile"
import SignUpProfileStep5 from "@/components/ui_app/SignUp/Steps/Step5Profile"
import SignUpProfileStep6 from "@/components/ui_app/SignUp/Steps/Step6Profile"
import {
	useGetUserProfilesQuery,
	useLazyGetProfilePercentageQuery,
} from "@/services/users.service"
import {NextSeo} from "next-seo"

function SignUpStepPage() {
	// props & constants
	const {t} = useTranslation("site")
	const router = useRouter()
	const {step} = router.query
	const {profileID: id} = router.query

	// state
	const [profileProgress, setProfileProgress] = useState<number>(0)
	const [currentStep, setCurrentStep] = useState<number | undefined>(
		undefined
	)
	const [isEditMode, setIsEditMode] = useState<boolean>(false)

	// rtk
	const {data: userProfilesData} = useGetUserProfilesQuery({
		page: 1,
		pageSize: 10,
	})
	const [triggerProfilePercentage, profilePercentageResponse] =
		useLazyGetProfilePercentageQuery()

	// functions
	const Step = (expected: number) => {
		if (!currentStep) return
		return expected === currentStep
	}

	// effects
	useEffect(() => {
		if (step && !Array.isArray(step)) {
			const splitStep = step.toString().split("-")

			if (splitStep.length > 1) {
				switch (splitStep[1]) {
					case "edit":
						setIsEditMode(true)
						break

					default:
						setIsEditMode(false)
						break
				}
			} else {
				setIsEditMode(false)
			}

			setCurrentStep(Number(splitStep[0]))
		}
	}, [step])

	useEffect(() => {
		if (currentStep && currentStep > 6) {
			router.push("/").then()
		}
	}, [currentStep])

	// profile percentage
	useEffect(() => {
		if (id) {
			triggerProfilePercentage({
				profileId: id,
			})
		}
	}, [id, triggerProfilePercentage])

	// profile percentage
	useEffect(() => {
		if (
			profilePercentageResponse &&
			profilePercentageResponse.status === "fulfilled" &&
			profilePercentageResponse.data
		) {
			profilePercentageResponse.data.percent > 100
				? setProfileProgress(100)
				: setProfileProgress(profilePercentageResponse.data.percent)
		}
	}, [profilePercentageResponse])

	if (!id || !userProfilesData || !currentStep) return null
  
	return (
		<>
			<NextSeo title={t("site.Create a profile")} />
			{Step(1) && <SignUpProfileStep1 editMode={isEditMode} />}
			{Step(2) && <SignUpProfileStep2 editMode={isEditMode} />}
			{Step(3) && (
				<SignUpProfileStep3
					thisPageProfile={"WOMAN"}
					profileProgress={profileProgress}
					editMode={isEditMode}
				/>
			)}
			{Step(4) && (
				<SignUpProfileStep3
					thisPageProfile={"MAN"}
					profileProgress={profileProgress}
					editMode={isEditMode}
				/>
			)}
			{Step(5) && (
				<SignUpProfileStep5
					profileProgress={profileProgress}
					editMode={isEditMode}
				/>
			)}
			{Step(6) && (
				<SignUpProfileStep6
					profileProgress={profileProgress}
					editMode={isEditMode}
				/>
			)}
		</>
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

SignUpStepPage.requireAuth = true

export default SignUpStepPage
