import styles from "./PageNewRecommendation.module.scss"
import BlogNewHeader from "@/components/ui/Blog/New/Header/BlogNewHeader"
import TextArea from "@/components/ui/Forms/Inputs/TextArea/TextArea"
import {useForm, Controller} from "react-hook-form"
import {TFunction, useTranslation} from "next-i18next"
import {useMemo} from "react"
import Button from "@/components/ui/Button/Button/Button"
// import {goBack} from "@/components/ui/Functions/GoBack"
import {useRouter} from "next/router"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import {useCreateRecommendationMutation} from "@/services/recommendations.service"
import {connect} from "react-redux"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"

type FormData = {
	recommendation_text: string
	[x: string]: any
}

const getPageTranslations = (t: TFunction) => {
	return {
		header: {
			title: t("site.Add new recommendation"), // example: t('site.phrase_code')
		},
		container: {
			content_area: {
				label: t("site.Comment content"),
				textarea: {
					placeholder: t("site.Write a comment about this profile"),
				},
			},
			actions: {
				button_new_recommendation: t("site.Submit the recommendation"),
			},
			information: {
				text: t(
					"site.Swingers Website shall not be liable in any way for harming other users or distributing content that is inappropriate in any form or type"
				),
			},
		},
	}
}

function PageNewRecommendation(props: any) {
	const {control, handleSubmit} = useForm<FormData>()
	const {t} = useTranslation("site")
	const router = useRouter()
	const {uid} = router.query
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])

	const [createRecommendation] = useCreateRecommendationMutation({})

	const userProfilesData = useGetUserProfilesInfo()

	function onFormSubmit(data: FormData) {
		if (!data.recommendation_text) {
			alert("Recommendation is empty")
			return
		}

		if (
			uid &&
			!Array.isArray(uid) &&
			userProfilesData &&
			userProfilesData.current_profile_id
		) {
			createRecommendation({
				data: {
					profile_id: uid,
					recommending_profile_id:
						userProfilesData.current_profile_id, // my id
					recommendation: data.recommendation_text,
				},
			})
				.unwrap()
				.then((r) => {
					goBackAction()
				})
				.catch((e) => {
					console.log(e)
				})
		}
	}

	function goBackAction() {
		router.back()
		// goBack(router, `/profiles/${id}`, ["/"])
	}

	if (!userProfilesData) return null

	return (
		<div className={styles.PageNewRecommendation}>
			<BlogNewHeader
				title={pageTranslations.header.title}
				callback={goBackAction}
				icon={<CloseIcon style={"light"} />}
			/>

			<div className={styles.Container}>
				<form onSubmit={handleSubmit(onFormSubmit)}>
					<div className={styles.ContentArea}>
						<div className={styles.Label}>
							{pageTranslations.container.content_area.label}
						</div>
						<Controller
							render={({field}) => {
								return (
									<TextArea
										maxLength={250}
										row={10}
										field={field}
										placeholder={
											pageTranslations.container
												.content_area.textarea
												.placeholder
										}
									/>
								)
							}}
							name={"recommendation_text"}
							control={control}
							defaultValue={""}
						/>
					</div>

					<div className={styles.Actions}>
						<Button
							type={"button"}
							mode={"submit"}
							prevent={false}
							fullWidth={true}
							id={"button_new_recommendation"}
						>
							<p className={styles.SubmitButtonText}>
								{
									pageTranslations.container.actions
										.button_new_recommendation
								}
							</p>
						</Button>
					</div>

					<div className={styles.Information}>
						<p>{pageTranslations.container.information.text}</p>
					</div>
				</form>
			</div>
		</div>
	)
}

export default PageNewRecommendation
