import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import Button from "@/components/ui/Button/Button/Button"
import {useForm, Controller} from "react-hook-form"
import React, {useEffect, useState} from "react"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import {useRouter} from "next/router"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import {useTranslation} from "next-i18next"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import {getNickName} from "@/components/ui/Functions/GetNickname"
import Section from "@/components/ui/SignUp/Section/Section"
import TextArea from "@/components/ui/Forms/Inputs/TextArea/TextArea"
import {useRegisterBlogMutation} from "@/services/blog.service"
import {NextSeo} from "next-seo"
import {yupResolver} from "@hookform/resolvers/yup"
import {validationBlog} from "@/app/validationSchemas"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
import {removeSpaces} from "@/components/ui/Functions/RemoveSpaces"

function CreateBlog() {
	const {t} = useTranslation("site")

	const [fromServerError, setFromServerError] = useState("")

	const formOptions = {resolver: yupResolver(validationBlog)}
	// router
	const router = useRouter()
	const {handleSubmit, watch, control, formState, setValue} =
		useForm(formOptions)
	const {errors} = formState

	// rtk get user data
	const userProfilesData = useGetUserProfilesInfo()

	const [registerBlog] = useRegisterBlogMutation()

	const title = watch("title")

	useEffect(() => {
		setFromServerError("")
	}, [title])

	// when go back from page
	const handleStepBack = () => {
		router.push(`/blogs`).then((r) => r)
	}

	const selfProfile =
		userProfilesData &&
		userProfilesData.profiles &&
		userProfilesData.profiles.find(
			(profile) => userProfilesData?.current_profile_id === profile.id
		)

	const onFormSubmit = (data: any) => {
		if (!data.title || !data.description) return
		setFromServerError("")
		registerBlog({
			status: 1,
			title: removeSpaces(data.title),
			description: removeSpaces(data.description),
		})
			.unwrap()
			.then((r) => {
				handleStepBack()
			})
			.catch((e) => {
				console.log(e.data)
				if (e.data?.title) {
					setFromServerError(e.data!.title!.join(", "))
				}
			})
	}

	return (
		<AppDefaultLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<NextSeo title={t("site.Create a blog")} />
			<div className={"PartyScreen"}>
				<div className={"CreateBlogContainer"}>
					<div className={"Header"}>
						<div className={"HeaderTitle"}>
							<p>{t("site.Start a blog")}</p>
						</div>
						<div className={"GoBack"}>
							<TransparentButton
								icon={<CloseIcon style={"light"} />}
								id={"transparent_button_go_back"}
								onClick={handleStepBack}
							/>
						</div>
					</div>
					<div className="UsernameContainer">
						<p>
							<span>{t("site.Author's name")}</span>
							{getNickName(selfProfile)}
						</p>
					</div>
					<form onSubmit={handleSubmit(onFormSubmit)}>
						<Section
							title={t("site.Give an intriguing title to a blog")}
							padding={"small"}
							boldTitle
						>
							<Controller
								render={({field}) => {
									return (
										<TextArea
											field={field}
											row={2}
											maxLength={50}
											placeholder={t(
												"site.Write a headline here that will attract readers to your blog"
											)}
											id={"title.textarea"}
											error={
												fromServerError ||
												(errors?.title?.message &&
													t(
														`site.${errors?.title?.message}`
													)) //errors?.title?.message
											}
										/>
									)
								}}
								name={"title"}
								control={control}
								defaultValue={""}
							/>
						</Section>
						<Section
							title={t("site.Blog content")}
							padding={"small"}
							boldTitle
						>
							<Controller
								render={({field}) => {
									return (
										<TextArea
											field={field}
											row={9}
											maxLength={500}
											placeholder={t(
												"site.Write details to help us understand the report"
											)}
											id={"description.textarea"}
											error={
												errors?.description?.message &&
												t(
													`site.${errors?.description?.message}`
												)
											}
										/>
									)
								}}
								name={"description"}
								control={control}
								defaultValue={""}
							/>
						</Section>
						<div className="Actions">
							{/* submit form */}
							<Button
								type={"button"}
								mode={"submit"}
								prevent={false}
								fullWidth={true}
								onClick={() => {}}
								disabled={
									fromServerError ||
									Object.keys(errors).length !== 0
										? true
										: false
								}
							>
								<p className="ActionButtonText">
									{t("site.I want to blog")}
								</p>
							</Button>
						</div>
					</form>
					<div className="AboutText">
						<p>
							{t(
								"site.We understand and understand that the content provided is our responsibility"
							)}
						</p>
					</div>
				</div>
			</div>
		</AppDefaultLayout>
	)
}

CreateBlog.requireAuth = true

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

export default CreateBlog
