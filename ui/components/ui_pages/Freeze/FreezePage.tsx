import styles from "./FreezePage.module.scss"
import BlogNewHeader from "@/components/ui/Blog/New/Header/BlogNewHeader"
import TextArea from "@/components/ui/Forms/Inputs/TextArea/TextArea"
import {useForm, Controller} from "react-hook-form"
import {TFunction, useTranslation} from "next-i18next"
import React, {useMemo} from "react"
import Button from "@/components/ui/Button/Button/Button"
import {useRouter} from "next/router"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import InputCheckboxHorizontal from "@/components/ui/Forms/Inputs/CheckboxHorizontal/InputCheckboxHorizontal"
import {useFreezeMutation} from "@/services/support.service"
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
			title: t("site.Freeze profile"),
		},
		container: {
			reason: {
				label: t("site.Why do you want to freeze this profile"),
			},
			content_area: {
				label: t("site.tell us what happened"),
				textarea: {
					placeholder: t(
						"site.Write details that will help us understand the freeze reason"
					),
				},
				warning1: t("site.freeze warning1"),
				warning2: t("site.freeze warning2"),
				warning3: t("site.freeze warning3"),
				warning4: t("site.freeze warning4"),
				warning5: t("site.freeze warning5"),
				warning6: t("site.freeze warning6"),
			},
			actions: {
				button_new_recommendation: t("site.Freeze profile"),
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

function FreezePage(props: any) {
	const {control, handleSubmit, formState, watch} = useForm<FormData>({
		resolver: yupResolver(ReportSchema),
	})
	const {t} = useTranslation("site")
	const router = useRouter()

	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])
	const errorTranslations = useMemo(() => {
		return getErrorTranslations(t)
	}, [t])

	const userProfilesData = useGetUserProfilesInfo()

	// rtk
	const [freeze] = useFreezeMutation()

	const myReason = watch("reason")
	const myReasonIDs = myReason ? getSelectedIds(myReason) : []
	const reasons = [
		{
			id: 1,
			title: t("site.we are not together anymore"),
			key: 'SEPARATED',
		},
		{
			id: 2,
			title: t("site.the website is not friendly"),
			key: 'UNFRIENDLY_WEBSITE',
		},
		{
			id: 3,
			title: t("site.we're taking a break"),
			key: 'TAKING_BREAK',
		},
		{
			id: 4,
			title: t("site.we have another profile"),
			key: 'HAVE_ANOTHER_PROFILE',
		},
		{
			id: 5,
			title: t("site.other reason"),
			key: 'OTHER',
		},
	]
	function onFormSubmit(data: FormData) {
		const reasonIDs = getSelectedIds(data.reason) || []

		const selectedKeys = reasons
		.filter(reason => reasonIDs.includes(reason.id))
		.map(reason => reason.key);

		if (userProfilesData && userProfilesData.current_profile_id) {
			freeze({
				reasons: selectedKeys,
				description: removeSpaces(data.report_text),
			})
				.unwrap()
				.then((r) => {
					router.push(`/auth/logout`).then(() => {
						router.reload()
					})
				})
				.catch((e) => {
					console.log(e)
				})
		}
	}

	function goBackAction() {
		router.back()
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
					<div className={styles.Information}>
						<p>{pageTranslations.container.content_area.warning1}</p>
						<p>{pageTranslations.container.content_area.warning2}</p>
						<p>{pageTranslations.container.content_area.warning3}</p>
						<p>{pageTranslations.container.content_area.warning4}</p>
						<p>{pageTranslations.container.content_area.warning5}</p>
						<p>{pageTranslations.container.content_area.warning6}</p>
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

export default FreezePage
