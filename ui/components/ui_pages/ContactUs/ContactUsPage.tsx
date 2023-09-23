import styles from "./ContactUsPage.module.scss"
import BlogNewHeader from "@/components/ui/Blog/New/Header/BlogNewHeader"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import {TFunction, useTranslation} from "next-i18next"
import {useForm, Controller, useWatch} from "react-hook-form"
import {useRouter} from "next/router"
import React, {useEffect, useMemo, useState} from "react"
import InputText from "@/components/ui/Forms/Inputs/Text/InputText"
import TextArea from "@/components/ui/Forms/Inputs/TextArea/TextArea"
import Button from "@/components/ui/Button/Button/Button"
import InputRadioHorizontalDefault from "@/components/ui/Forms/Inputs/RadioHorizontal/InputRadioHorizontalDefault"
import Drawer from "@/components/ui/Drawer/Drawer/Drawer"
import {yupResolver} from "@hookform/resolvers/yup"
import {ContactUsSchema} from "@/app/validation/ContactUs.schema"
import {
	Subject,
	useLazyGetFeedbackSubjectsQuery,
	useNewFeedbackMutation,
} from "@/services/support.service"
import InputPhoneNumber from "@/components/ui/Forms/Inputs/PhoneNumber/InputPhoneNumber"
import ArrowIcon from "@/components/ui/Icons/ArrowIcon"
import ButtonLocation from "@/components/ui/Button/ButtonLocation/ButtonLocation"

type FormData = {
	full_name: string
	email: string
	phone_number: string
	content: string
	subject: string
}

type ErrorTranslations = {
	[x: string]: any
}

const getPageTranslations = (t: TFunction) => {
	return {
		header: {
			title: t("site.Contact us"), // example: t('site.phrase_code')
		},
		container: {
			drawer_title: t("site.Subject"),
			welcome_message: t("site.Want to talk to us Send an email to"),
			inputs: {
				full_name: t("site.Full name"),
				email: t("site.Email"),
				phone_number: t("site.Phone number"),
				content: t("site.Content descr"),
				subject: t("site.Select subject"),
				actions: {
					submit: t("site.Sent"),
				},
			},
		},
	}
}

const getErrorTranslations = (t: TFunction): ErrorTranslations => {
	return {
		yup_contact_us_full_name_required: t("site.Full name required"),
		yup_contact_us_email_required: t("site.yup_signup_email_required"),
		yup_contact_us_email_must_be_email: t(
			"site.yup_signup_email_must_be_email"
		),
		yup_contact_us_content_required: t("site.Content must not be empty"),
		yup_contact_us_phone_number_valid: t(
			"site.yup_signup_phone_number_valid"
		),
	}
}

function ContactUsPage() {
	// props
	const {t} = useTranslation("site")
	const router = useRouter()
	const {mode} = router.query
	console.log(mode)
	const pageTranslations = useMemo(() => {
		return getPageTranslations(t)
	}, [t])
	const errorTranslations = useMemo(() => {
		return getErrorTranslations(t)
	}, [t])

	// state
	const [drawerShow, setDrawerShow] = useState(false)
	const [drawerTrigger, setDrawerTrigger] = useState(false)
	const [subjects, setSubjects] = useState<Subject[]>([])

	// react hook form
	const {control, handleSubmit, register, setValue, formState} =
		useForm<FormData>({
			resolver: yupResolver(ContactUsSchema),
		})
	const subjectWatch = useWatch({
		control,
		name: "subject",
	})

	// rtk
	const [feedbackSubjectsTrigger, feedbackSubjects] =
		useLazyGetFeedbackSubjectsQuery()
	const [newFeedback] = useNewFeedbackMutation()

	useEffect(() => {
		feedbackSubjectsTrigger({})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (
			feedbackSubjects &&
			feedbackSubjects.status === "fulfilled" &&
			feedbackSubjects.data
		) {
			setSubjects(feedbackSubjects.data.results)
			console.log(feedbackSubjects.data.results)
		}
	}, [feedbackSubjects])

	const onFormSubmit = (data: FormData) => {
		newFeedback({
			email: data.email ? data.email : null,
			phone: data.phone_number ? data.phone_number : null,
			full_name: data.full_name ? data.full_name : null,
			description: data.content ? data.content : null,
			subject_type: data.subject ? Number(data.subject) : null,
		})
			.unwrap()
			.then((r) => {
				router.push("/pages/contact-us-success").then()
			})
			.catch((e) => {
				console.log("newFeedback", e)
			})
	}

	const drawerTriggerAction = () => {
		setDrawerTrigger(true)
		setTimeout(() => {
			setDrawerTrigger(false)
		}, 100)
	}

	const getSubjectTitle = () => {
		if (mode && mode === "delete-profile") {
			const search = subjects.find((s) => s.id.toString() === "5")

			if (search) {
				return search.title
			} else {
				return pageTranslations.container.inputs.subject
			}
		}

		if (subjectWatch) {
			const search = subjects.find(
				(s) => s.id.toString() === subjectWatch
			)
			if (search) {
				return search.title
			} else {
				return pageTranslations.container.inputs.subject
			}
		} else {
			return pageTranslations.container.inputs.subject
		}
	}

	useEffect(() => {
		if (subjectWatch) {
			drawerTriggerAction()
		}
	}, [subjectWatch])

	return (
		<div className={styles.ContactUsPage}>
			<Drawer
				show={drawerShow}
				setShow={setDrawerShow}
				position={"bottom"}
				title={pageTranslations.container.drawer_title}
				trigger={drawerTrigger}
			>
				<div className="LocationDrawerContainer">
					<Controller
						render={({field}) => (
							<>
								{subjects &&
									subjects.map((subject) => {
										return (
											<InputRadioHorizontalDefault
												key={subject.id}
												field={field}
												value={subject.id.toString()}
												title={subject.title}
											/>
										)
									})}
							</>
						)}
						name={"subject"}
						control={control}
						defaultValue={
							(mode && mode === "delete-profile" && "5") || ""
						}
					/>
				</div>
			</Drawer>

			<BlogNewHeader
				callback={() => {
					router.push("/").then()
				}}
				icon={<CloseIcon style={"light"} />}
				title={pageTranslations.header.title}
			/>
			<div className={styles.Container}>
				<div className={styles.WelcomeMessage}>
					<p>{pageTranslations.container.welcome_message}</p>
				</div>
				<div className={styles.Form}>
					<form onSubmit={handleSubmit(onFormSubmit)}>
						<div className={styles.Input}>
							<Controller
								render={({field, fieldState}) => {
									return (
										<InputText
											field={field}
											required={true}
											placeholder={
												pageTranslations.container
													.inputs.full_name
											}
											error={
												fieldState.error?.message &&
												errorTranslations[
													fieldState.error?.message
												]
											}
											autoComplete={"off"}
										/>
									)
								}}
								name={"full_name"}
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={styles.Input}>
							<Controller
								render={({field, fieldState}) => {
									return (
										<InputText
											field={field}
											required={true}
											placeholder={
												pageTranslations.container
													.inputs.email
											}
											type={"email"}
											error={
												fieldState.error?.message &&
												errorTranslations[
													fieldState.error?.message
												]
											}
											autoComplete={"off"}
										/>
									)
								}}
								name={"email"}
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={styles.Input}>
							<InputPhoneNumber
								name={"phone_number"}
								register={register}
								setValue={setValue}
								error={
									formState.errors.phone_number?.message &&
									errorTranslations[
										formState.errors.phone_number.message
									]
								}
							/>
							{/*<Controller*/}
							{/*	render={({field, fieldState}) => {*/}
							{/*		return (*/}
							{/*			<InputText*/}
							{/*				field={field}*/}
							{/*				placeholder={*/}
							{/*					pageTranslations.container*/}
							{/*						.inputs.phone_number*/}
							{/*				}*/}
							{/*				autoComplete={false}*/}
							{/*				error={*/}
							{/*					fieldState.error?.message &&*/}
							{/*					errorTranslations[*/}
							{/*						fieldState.error?.message*/}
							{/*					]*/}
							{/*				}*/}
							{/*			/>*/}
							{/*			*/}
							{/*		)*/}
							{/*	}}*/}
							{/*	name={"phone_number"}*/}
							{/*	control={control}*/}
							{/*	defaultValue={""}*/}
							{/*/>*/}
						</div>
						<div className={styles.Input}>
							<ButtonLocation
								type={"button"}
								prevent={true}
								id={"button_open_subject_drawer"}
								fullWidth={true}
								onClick={() => {
									setDrawerShow(true)
								}}
								icon={<ArrowIcon />}
								variant={"contact-us"}
							>
								<p className={styles.ButtonOpenDrawer}>
									{getSubjectTitle()}
								</p>
							</ButtonLocation>
							{/*<Button*/}
							{/*	type={"button"}*/}
							{/*	prevent={true}*/}
							{/*	background={"gray"}*/}
							{/*	id={"button_open_location_drawer"}*/}
							{/*	fullWidth={true}*/}
							{/*	onClick={() => {*/}
							{/*		setDrawerShow(true)*/}
							{/*	}}*/}
							{/*>*/}
							{/*	<p className={styles.ButtonOpenDrawer}>*/}
							{/*		{getSubjectTitle()}*/}
							{/*	</p>*/}
							{/*</Button>*/}
						</div>
						<div className={styles.Input}>
							<Controller
								render={({field, fieldState}) => {
									return (
										<TextArea
											maxLength={250}
											row={8}
											field={field}
											placeholder={
												pageTranslations.container
													.inputs.content
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
								name={"content"}
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
								id={"button_contact_send"}
							>
								<p className={styles.SubmitButtonText}>
									{
										pageTranslations.container.inputs
											.actions.submit
									}
								</p>
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default ContactUsPage
