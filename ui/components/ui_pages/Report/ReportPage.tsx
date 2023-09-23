import styles from "./ReportPage.module.scss"
import BlogNewHeader from "@/components/ui/Blog/New/Header/BlogNewHeader"
import TextArea from "@/components/ui/Forms/Inputs/TextArea/TextArea"
import {useForm, Controller} from "react-hook-form"
import {TFunction, useTranslation} from "next-i18next"
import React, {useEffect, useMemo, useState} from "react"
import Button from "@/components/ui/Button/Button/Button"
// import {goBack} from "@/components/ui/Functions/GoBack"
import {useRouter} from "next/router"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
// import {useCreateRecommendationMutation} from "@/services/recommendations.service"
import {connect} from "react-redux"
import InputCheckboxHorizontal from "@/components/ui/Forms/Inputs/CheckboxHorizontal/InputCheckboxHorizontal"
import {
	Reason,
	useLazyGetReportReasonsQuery,
	useNewReportMutation,
} from "@/services/support.service"
import {getSelectedIds} from "@/components/ui/Functions/GetSelectedIDs"
import {yupResolver} from "@hookform/resolvers/yup"
import {ReportSchema} from "@/app/validation/Report.schema"
import {removeSpaces} from "@/components/ui/Functions/RemoveSpaces"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"

type FormData = {
	report_text: string
	[x: string]: any
}

type ErrorTranslations = {
	[x: string]: any
}

const getPageTranslations = (t: TFunction) => {
	return {
		header: {
			title: t("site.Report on this profile"), // example: t('site.phrase_code')
		},
		container: {
			reason: {
				label: t("site.Why do you want to report a profile"),
				illegal_activity: t("site.Illegal activity drug sale"),
				spam: t("site.Suspicion of a fictitious profile spam"),
				violence: t("site.Bullying verbal violence"),
				porno: t("site.Pornographic nudity"),
				pretending_to_be_someone_else: t(
					"site.Non-personal profile posts"
				),
			},
			content_area: {
				label: t("site.tell us what happened"),
				textarea: {
					placeholder: t(
						"site.Write details that will help us understand the report"
					),
				},
			},
			actions: {
				button_new_recommendation: t("site.Report"),
			},
		},
	}
}

const getErrorTranslations = (t: TFunction): ErrorTranslations => {
	return {
		yup_report_report_text_required: t("site.Content must not be empty"),
		yup_report_reason_required: t("site.Select at least one reason"),
		yup_report_report_text_min_20_characters: t(
			"site.yup_report_report_text_min_20_characters"
		),
	}
}

function ReportPage(props: any) {
	const {control, handleSubmit, formState, watch} = useForm<FormData>({
		resolver: yupResolver(ReportSchema),
	})
	const {t} = useTranslation("site")
	const router = useRouter()
	const {uid} = router.query
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])
	const errorTranslations = useMemo(() => {
		return getErrorTranslations(t)
	}, [t])

	const userProfilesData = useGetUserProfilesInfo()

	//state
	const [reasons, setReasons] = useState<Reason[]>([])

	// rtk
	const [reportReasonsTrigger, reportReasons] = useLazyGetReportReasonsQuery()
	const [newReport] = useNewReportMutation()

	const myReason = watch("reason")
	const myReasonIDs = myReason ? getSelectedIds(myReason) : []

	// did mount
	useEffect(() => {
		reportReasonsTrigger({})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (
			reportReasons &&
			reportReasons.status === "fulfilled" &&
			reportReasons.data
		) {
			setReasons(reportReasons.data.results)
		}
	}, [reportReasons])

	function onFormSubmit(data: FormData) {
		console.log("report", data)

		const reasonIDs = getSelectedIds(data.reason) || []

		console.log("report", reasonIDs)

		if (
			uid &&
			!Array.isArray(uid) &&
			userProfilesData &&
			userProfilesData.current_profile_id
		) {
			newReport({
				reported_profile: uid,
				title: "-",
				description: removeSpaces(data.report_text),
				reasons: reasonIDs,
			})
				.unwrap()
				.then((r) => {
					console.log("newReport", r)
					goBackAction()
				})
				.catch((e) => {
					if (
						e &&
						e.data &&
						e.data.reported_profile &&
						Array.isArray(e.data.reported_profile)
					) {
						alert(e.data.reported_profile.join(". "))
						return
					}
					console.log("newReport", e)
				})
		}
	}

	function goBackAction() {
		router.back()
		// goBack(router, `/profiles/${id}`, ["/"])
	}

	if (!userProfilesData) return null

	return (
		<div className={styles.ReportPage}>
			<BlogNewHeader
				title={pageTranslations.header.title}
				callback={goBackAction}
				icon={<CloseIcon style={"light"} />}
			/>

			<div className={styles.Container}>
				<form onSubmit={handleSubmit(onFormSubmit)}>
					<div className={styles.ReasonArea}>
						<div className={styles.Label}>
							{pageTranslations.container.reason.label}
						</div>

						<div className={styles.Select}>
							{reasons &&
								reasons.map((row) => {
									return (
										<Controller
											render={({field}) => (
												<>
													<InputCheckboxHorizontal
														title={row.title}
														field={field}
														value={row.id.toString()}
														id={`input_checkbox_horizontal_${row.id}`}
													/>
												</>
											)}
											name={`reason.id_${row.id}`}
											control={control}
											defaultValue={false}
											key={row.id}
										/>
									)
								})}
							{!myReasonIDs.length &&
								formState.errors?.reason?.message && (
									<p className={"SignUpErrorMessage"}>
										{
											errorTranslations[
												formState.errors?.reason
													?.message
											]
										}
									</p>
								)}
						</div>
					</div>

					<div className={styles.ContentArea}>
						<div className={styles.Label}>
							{pageTranslations.container.content_area.label}
						</div>
						<Controller
							render={({field, fieldState}) => {
								return (
									<TextArea
										maxLength={250}
										row={8}
										field={field}
										placeholder={
											pageTranslations.container
												.content_area.textarea
												.placeholder
										}
										error={
											fieldState.error?.message &&
											errorTranslations[
												fieldState.error.message
											]
										}
									/>
								)
							}}
							name={"report_text"}
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
				</form>
			</div>
		</div>
	)
}

export default ReportPage
