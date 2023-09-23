import React, { useState } from "react"
import AppDefaultLayout from "@/components/ui_app/AppLayouts/AppDefaultLayout"
import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import Logotype from "@/components/ui/Header/Logotype"
import Section from "@/components/ui/SignUp/Section/Section"
import {Controller, useForm} from "react-hook-form"
import {useRouter} from "next/router"
import Button from "@/components/ui/Button/Button/Button"
import {connect} from "react-redux"
import InputText from "@/components/ui/Forms/Inputs/Text/InputText"
import {useTranslation} from "next-i18next"
import InputPassword from "@/components/ui/Forms/Inputs/Password/InputPassword"
import AdminMessage from "@/components/ui/AdminMessage/AdminMessage"

function SignUpStep4(props: any) {
	const {t} = useTranslation("site")

	// basic props
	const {} = props
	const router = useRouter()
	const [open, setOpen] = useState(true)
	// react hook form
	const {handleSubmit, control, watch, setValue} = useForm()

	

	// on form submit
	function onFormSubmit(data: any) {
	//	console.log(data)
	}

	// on go back
	function onGoBackClick() {
		router.push(`/auth/signup/PROFILEID/step/3`).then()
	}

	return (
		<AppDefaultLayout useHeader={false} useTabBar={false} fullHeight={true}>
			<div className="SignUpPageContainer">
				<div className="Step4">
					<div className="GoBack">
						<TransparentButton
							icon={<GoBackIcon />}
							onClick={onGoBackClick}
						/>
					</div>
					<div className="WelcomeLogotype">
						<Logotype size={"signup"} />
					</div>
					<AdminMessage
						open={open}
						setOpen={setOpen}
						text={
							<p>
                            שימו לב - גם אתם אם חדשים וגם אם אתם כבר חברים שלנו בקהילה
                            פרופיל מלא הוא פרופיל שמקבל יותר פניות
                            דאגו למלא את כל השדות בפרופיל ואז גם תקודמו בתוצאות חיפוש
                            קדימה - דקה שתיים ואתם משודרגים
							</p>
						}
					/>
					<form onSubmit={handleSubmit(onFormSubmit)}>
						<Section
							title={t("site.Some short and concluding details")}
							padding={"small"}
						>
							<div className="UsernameSection">
								<Controller
									render={({field}) => (
										<InputText
											field={field}
											placeholder={t(
												"site.Nickname this will be your name on the site"
											)}
											maxLength={25}
											required={true}
											error={
												"this is kinda error example"
											}
										/>
									)}
									name={"username"}
									control={control}
									defaultValue={""}
								/>
								<p className={"Info"}>
									{t(
										"site.Enter a nickname with no special characters"
									)}{" "}
									@#$/*
								</p>
							</div>
						</Section>

						<Section>
							<div className="EmailPasswordSection">
								<div className="Input">
									<Controller
										render={({field}) => (
											<InputText
												field={field}
												placeholder={t(
													"site.Email_addr"
												)}
											/>
										)}
										name={"email"}
										control={control}
										defaultValue={""}
									/>
								</div>
								<div className="Input">
									<div className="Field">
										<Controller
											render={({field}) => (
												<InputPassword
													field={field}
													placeholder={t(
														"site.password"
													)}
													error={
														"this is kinda error example"
													}
												/>
											)}
											name={"password"}
											control={control}
											defaultValue={""}
										/>
									</div>
									<div className="Help">
										<p>
											{t(
												"site.Enter a password of at least 6 digits"
											)}
										</p>
										<p>
											{t(
												"site.The password must include at least one digit and one character"
											)}
										</p>
										<p>
											{t(
												"site.The password must include at least one uppercase letter and one lowercase letter"
											)}
										</p>
									</div>
									<div className="Field">
										<Controller
											render={({field}) => (
												<InputPassword
													field={field}
													placeholder={t(
														"site.Type the password again"
													)}
												/>
											)}
											name={"password_confirmation"}
											control={control}
											defaultValue={""}
										/>
									</div>
								</div>
							</div>
						</Section>

						{/* actions */}
						<div className="Actions">
							{/* submit form */}
							<Button
								type={"button"}
								mode={"submit"}
								prevent={false}
								fullWidth={true}
							>
								<p className={"SubmitButtonText"}>
									{t("site.Great, let's continue")}!
								</p>
							</Button>
						</div>
					</form>
				</div>
			</div>
		</AppDefaultLayout>
	)
}

// export default SignUpStep2

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpStep4)
