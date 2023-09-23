import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import Logotype from "@/components/ui/Header/Logotype"
import Section from "@/components/ui/SignUp/Section/Section"
import {Controller, useForm} from "react-hook-form"
import React, {useState, useEffect, useMemo} from "react"
import {useRouter} from "next/router"
import Button from "@/components/ui/Button/Button/Button"
import {TFunction, useTranslation} from "next-i18next"
import TextArea from "@/components/ui/Forms/Inputs/TextArea/TextArea"
import InProgressBar from "@/components/ui/Forms/Inputs/InProgressBar/InProgressBar"
import Link from "@/components/ui/Button/Link/Link"
import UploadImage from "../UploadImage/UploadImage"
import ProgressBar from "@/components/ui/Forms/Inputs/InProgressBar/ProgressBar"
import VerificateRadditIcon from "@/components/ui/Icons/VerificateRadditIcon"
import {cc} from "@/components/ui/Functions/Classnames"
import {uploadImages} from "@/services/common.service"
import CropPhotoModal from "../CropPhotoModal/CropPhotoModal"
import BlockPhotoIcon from "@/components/ui/Icons/BlockPhotoIcon"
import AdviceIcon from "@/components/ui/Icons/AdviceIcon"
import MiniArrowIcon from "@/components/ui/Icons/MiniArrowIcon"
import {connect} from "react-redux"
import {userProfileActions} from "@/redux/actions/userProfileActions"
import AdminMessage from "@/components/ui/AdminMessage/AdminMessage"
import {ImageS3} from "@/components/@types/Api/Common/ImageS3"
import {
	useGetProfileDataQuery,
	useUpdateImageProfileMutation,
} from "@/services/users.service"
// import {dataURLtoFile} from "@/components/ui/Functions/DataURLtoFile"
// import {getBase64Image} from "@/components/ui/Functions/GetBase64Image"
// import {getProgressLength} from "@/components/ui/Functions/GetProgressLength"
import {
	useAddProfileImageMutation,
	useChangeTypeImagesMutation,
	useDeleteImageMutation,
	useGetProfileImagesMutation,
} from "@/services/images.service"
import {
	setImageTypeToBoolean,
	setImageBooleanToType,
} from "@/components/ui/Functions/ImageTypeConverter"
import {goBackEditMode} from "@/components/ui/Functions/GoBack"
import {toggleEditMode} from "@/redux/slices/EditProfileSlice"
import CleanLayout from "@/components/ui_app/AppLayouts/CleanLayout"
import {yupResolver} from "@hookform/resolvers/yup"
import {Step6Schema} from "@/app/validation/ProfileRegistration/Step6.schema"
import {format} from "date-fns"
import {useGetUserProfilesInfo} from "@/components/ui/Functions/Hooks/GetUserProfilesInfo"
// import {debounce} from "@/components/ui/Functions/Debounce"
// import {
// 	useProfilePartialUpdateMutation
// } from "@/services/users.service"
// const [profilePartialUpdate] = useProfilePartialUpdateMutation()
// import {removeSpaces} from "@/components/ui/Functions/RemoveSpaces"

type ErrorTranslations = {
	[x: string]: any
}
 
const getErrorTranslations = (t: TFunction): ErrorTranslations => {
	return {
		yup_pr_step6_about_min_length: t("site.yup_pr_step6_about_min_length"),
		yup_pr_step6_about_max_length: t("site.yup_pr_step6_about_max_length"),
		yup_pr_step6_about_no_number: t("site.yup_pr_step6_about_no_number"),
		yup_pr_step6_about_required: t("site.yup_pr_step6_about_required"),
	}
}

function Step6Profile(props: any) {
	// props
	const {
		updateProfile,
		// editProfileState,
		toggleEditMode,
		profileProgress,
		editMode,
	} = props
	const router = useRouter()
	const {profileID: id} = router.query
	const {t} = useTranslation("site")
	const errorTranslations = useMemo(() => {
		return getErrorTranslations(t)
	}, [t])

	// state
	const [images, setImages] = useState<any>([])
	const [imagesProfile, setImagesProfile] = useState<any>([])
	const [imageVerification, setImageVerification] = useState<any>([])
	const [cropOpen, setCropOpen] = useState<boolean>(false)
	const [cropValidationOpen, setCropValidationOpen] = useState<boolean>(false)
	const [imageToCrop, setImageToCrop] = useState<any>({})
	const [disabledButton, setDisabledButton] = useState<boolean>(false)
	const [open, setOpen] = useState(true)

	const maxPhotos = 8

	// rtk get user data
	const userProfilesData = useGetUserProfilesInfo()

	const forbiddenPhoto = [
		t("site.Please do not post photos from the web"),
		t("site.Graphic photos of exposed genitals will be erased"),
		t("site.Please do not post any photos with under-aged persons"),
		t(
			"site.Please do not post photos of other people or which do not include"
		),
		t("site.Please do not post photos containing logos of other websites"),
	]

	// rtk mutation to remove image profile
	const [registerDeleteImage] = useDeleteImageMutation()

	// rtk mutation to edit image profile
	const [registerEditImage] = useUpdateImageProfileMutation()

	// rtk mutation to edit image profile
	const [registerAddImage] = useAddProfileImageMutation()

	const [registerChangeTypeImage] = useChangeTypeImagesMutation()

	const {data: getProfileData, refetch: refetchProfileData} =
		useGetProfileDataQuery({
			profileId: id,
		})

	//mican
	// const [saved, setSaved] = useState(false)

	// useEffect(() => {
	// 	setTimeout(() => setSaved(false), 1800)
	// }, [saved])

	// const debouncedSubmit = debounce((data: any) => {
	// 	if (
	// 		(data.nickname || data.nickname.length >= 0) &&
	// 		(data.about || data.about.length >= 0)
	// 	) {
	// 		profilePartialUpdate({
	// 			body: {
	// 				nickname: removeSpaces(data.nickname),
	// 				about: removeSpaces(data.about),
	// 			},
	// 		})
	// 			.unwrap()
	// 			.then((r) => {
	// 				setSaved(true)
	// 				console.log(
	// 					"profilePartialUpdate",
	// 					data.nickname,
	// 					data.about,
	// 					r
	// 				)
	// 			})
	// 			.catch((e) => {
	// 				console.log("profilePartialUpdate", e)
	// 			})
	// 	}
	// }, 1000)

	// const onSubmit = (data: any) => {
	// 	debouncedSubmit(data)
	// }
	//lekan

	// react hook form
	const {handleSubmit, control, watch, setValue, formState} = 
		useForm({
			resolver: yupResolver(Step6Schema),
			mode: "all",
			reValidateMode: "onChange",
		})


	//auto validate the input after 3 seconds
	useEffect(() => {
		setTimeout(() => {
			handleSubmit(() => {})();
		}, 3000);
	}, []);



	
	// on go back
	function onGoBackClick() {
		if (editMode) {
			goBackEditMode(router, toggleEditMode)
			return
		}

		router.push(`/auth/signup/${id}/step/5`).then(() => {
			refetchProfileData()
		})
	}

	const handlePaste = (e: any) =>{
		e.preventDefault();
		alert(t("site.on_paste"));
	}

	const [registerGetProfileImages] = useGetProfileImagesMutation()

	const about = watch("about")

	const setProfileImages = async (photos: any) => {
		if (photos) {
			let data_images = []
			let data_images_validation = []
			data_images = photos
				.filter((image: any) => image.type !== "VALIDATION")
				.map((image: any) => {
					const data = {
						id: image.id,
						data_url: image.s3_url,
						file: null,
						type: image.type,
					}
					return setImageTypeToBoolean(image.type, data)
				})
			data_images_validation = photos
				.filter((image: any) => image.type === "VALIDATION")
				.map((image: any) => {
					const data = {
						id: image.id,
						data_url: image.s3_url,
						file: null,
						type: image.type,
					}
					return setImageTypeToBoolean(image.type, data)
				})
			setImages(data_images)
			setImageVerification(data_images_validation)
		}
	}

	useEffect(() => {
		if (typeof id === "string") {
			registerGetProfileImages({
				myProfileId: id,
				profileId: id,
			})
				.unwrap()
				.then((r) => {
					setImagesProfile(r.images)
					setProfileImages(r.images).then()
				})
				.catch((e) => {
					console.log(e)
				})
		}
	}, [id])

	useEffect(() => {
		setValue("about", getProfileData?.about || "")
	}, [getProfileData])

	useEffect(() => {
		if (imageVerification[0]) {
			Object.assign(imageVerification[0], {type: "VALIDATION"})
		}
	}, [imageVerification])

	const updatePhotoRes = (array: any) => {
		return array.map((item: ImageS3) => {
			return {
				// id: item.id,
				type: item.type,
				// s3_url: item.url,
				s3_bucket_path: item.fileName,
			}
		})
	}

	const updateKeysObject = async (arrayImages: any) => {
		await setImageBooleanToType(arrayImages)
		arrayImages.forEach((image: any) => {
			delete image.data_url
			delete image.is_avatar
			delete image.is_main
			delete image.is_private
		})
	}

	const savePhoto = async () => {
		if (Object.keys(formState.errors).length) return
		if (images.length > maxPhotos) return
		setDisabledButton(true)
		const arrayImages = [...images]
		const arrayVerifyImages = [...imageVerification]

		const formData = {
			about: about,
		}
		if (getProfileData?.about !== about && typeof id === "string") {
			updateProfile(id, 6, formData)
		}

		const submitEditStatusImagesPromise = new Promise(
			async (resolve, reject) => {
				if (arrayImages.length && typeof id === "string") {
					const profileImages = arrayImages
						.filter((item) => item?.id)
						.map((image: any) => {
							return {
								id: image.id,
								type: image.type,
							}
						})
					await profileImages.map((image) => {
						const t = imagesProfile.find((img: any) => {
							return img.id === image.id
						})
						if (t && t.type !== image.type) {
							registerChangeTypeImage({
								imageId: t.id,
								profileId: id,
								newType: image.type,
							})
								.unwrap()
								.then((r) => {
									console.log("upload 2")
								})
								.catch((e) => {
									console.log(e)
								})
						}
					})
					resolve(true)
				}
			}
		)

		const submitImagesPromise = new Promise(async (resolve, reject) => {
			if (arrayImages.length && typeof id === "string") {
				await updateKeysObject(arrayImages)

				if (!arrayImages.filter((item) => !item?.id).length) {
					resolve(true)
					return
				}
				uploadImages(
					arrayImages
						.filter((item) => !item?.id)
						.map((item: any) => {
							return {
								id: item.id,
								type: item.type,
								file: item.file,
							}
						})
				)
					.then((res: any) => {
						console.log("upload 1")
						const photos = updatePhotoRes(res)
						registerAddImage({
							profileId: id,
							body: photos,
						})
							.unwrap()
							.then((r) => {
								console.log("upload 2")

								setImages([])
								resolve(true)
							})
							.catch((e) => {
								console.log(e)
								reject()
							})
					})
					.catch((err: any) => {
						console.log(err)
						reject()
					})
			}
		})

		const submitVerificationImagesPromise = new Promise(
			async (resolve, reject) => {
				if (arrayVerifyImages.length && typeof id === "string") {
					await updateKeysObject(arrayVerifyImages)

					if (!arrayImages.filter((item) => !item?.id).length) {
						resolve(true)
						return
					}
					uploadImages(
						arrayVerifyImages.map((item: any) => {
							return {
								id: item.id,
								type: item.type,
								file: item.file,
							}
						})
					)
						.then((res: any) => {
							console.log("upload 3")

							const photos = updatePhotoRes(res)
							const formData = {
								about: about,
							}
							updateProfile(id, 6, formData)
							registerAddImage({
								profileId: id,
								body: photos,
							})
								.unwrap()
								.then((r) => {
									console.log("upload 4")

									setImageVerification([])
									resolve(true)
								})
								.catch((e) => {
									console.log(e)
									reject()
								})
						})
						.catch((e) => {
							reject()
						})
				}
			}
		)

		const promises = [
			arrayImages.length && typeof id === "string" && submitImagesPromise,
			arrayVerifyImages.length &&
				typeof id === "string" &&
				submitVerificationImagesPromise,
			arrayImages.length &&
				typeof id === "string" &&
				submitEditStatusImagesPromise,
		]

		Promise.allSettled(promises)
			.then((results: any) => {
				results.forEach((r: any) => {
					console.log("allSettled", r)
				})

				// refetchProfileData()

				// router
				// 	.push("/")
				// 	.then()
				// 	.then(() => {
				// 		refetchProfileData()
				// 	})
			})
			.finally(() => {
				setDisabledButton(false)
				router.push("/").then(() => {
					refetchProfileData()
					window.location.reload()
				})
			})
	}

	const onImageDelete = (setState: Function, images: object[]) => {
		if (
			imagesProfile.find((image: any) => image.id == imageToCrop.id) &&
			typeof id === "string"
		) {
			registerDeleteImage({
				imageId: imageToCrop.id,
				profileId: id,
			})
				.unwrap()
				.then((r) => {
					console.log(r)
				})
				.catch((e) => {
					console.log(e)
				})
		}
		setState(
			images.filter(
				(image: any) => image.data_url !== imageToCrop.data_url
			)
		)
	}

	useEffect(() => {
		setTimeout(() => {
			if (
				images &&
				images.slice(-1)[0] &&
				!images.slice(-1)[0]?.id &&
				images.slice(-1)[0]?.file?.name !== "AvatarCropped"
			) {
				setImageToCrop(images.slice(-1)[0])
				setCropOpen(true)
			}
		}, 150)
	}, [images])

	useEffect(() => {
		setTimeout(() => {
			if (
				imageVerification &&
				imageVerification.slice(-1)[0] &&
				!imageVerification.slice(-1)[0]?.id &&
				imageVerification.slice(-1)[0]?.file?.name !== "AvatarCropped"
			) {
				setImageToCrop(imageVerification.slice(-1)[0])
				setCropValidationOpen(true)
			}
		}, 150)
	}, [imageVerification])

	return (
		<CleanLayout useTabBar={false} fullHeight={true}>
			<div className="SignUpPageContainer">
				<div
					className="Step3"
					style={
						cropOpen ? {overflow: "hidden", height: "100vh"} : {}
					}
				>
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
					{profileProgress && (
						<div className="InProgressBarContainer">
							<ProgressBar
								valueLength={profileProgress}
								textInTop={t(
									"site.Add photos and you have a perfect profile"
								)}
							/>
						</div>
					)}
					<div className="Sections">
						<Section
							title={t("site.Tell us a little about yourself")}
							padding={"small"}
						>
							<Controller
								render={({field, fieldState}) => {
									return (
										<TextArea
											field={field}
											row={7}
											maxLength={500}
											onPaste={handlePaste}
											placeholder={t(
												"site.What is your head, what are you looking for, tell a little"
											)}
											id={"about.textarea"}
											error={
												fieldState.error?.message &&
												errorTranslations[
													fieldState.error.message
												]
											}
										/>
									)
								}}
								name={"about"}
								control={control}
								defaultValue={getProfileData?.about || ""}
							/>
							<InProgressBar
								valueLength={about?.length || 0}
								maxCount={500}
								withText
							/>
						</Section>
						<Section
							title={t(
								"site.Want to get 10 times as many inquiries It's time for some pictures"
							)}
							padding={"small"}
						>
							<p className="ModalCropTitle">
								{t("site.CropPhotoModal-head-2")}
								<br />
								{t("site.CropPhotoModal-head-3")}. <br />
								{`${t(
									"site.You can upload up to"
								)} ${maxPhotos} ${t("site.pictures")}`}
								.
							</p>
							<div className={"UploadPhotoContainer"}>
								<UploadImage
									images={images}
									setImages={setImages}
									image={imageToCrop}
									cropOpen={cropOpen}
									setCropOpen={setCropOpen}
									setImageToCrop={setImageToCrop}
									maxPhotos={maxPhotos}
									withCrop
								/>
							</div>
							<div className={"LinkContainer"}>
								<AdviceIcon />
								<Link
									href={
										"/articles/51/%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA"
									}
									styled
								>
									{t(
										"site.Get tips from us for uploading photos"
									)}
								</Link>
								<MiniArrowIcon />
							</div>
							<div className={"ForbiddenList"}>
								{forbiddenPhoto.map(
									(text: string, index: any) => (
										<div key={index}>
											<BlockPhotoIcon />
											<p>{text}</p>
										</div>
									)
								)}
							</div>
						</Section>
						<Section title={t("site.Want even more inquiries")}>
							<p className={"VerificateText"}>
								{t(
									"site.And attach a picture with a bare face, hold a page with your profile name and you will receive a verifying profile stamp"
								)}
							</p>
							<div
								className={cc([
									"UploadPhotoContainer",
									"UploadVerifyPhotoContainer",
								])}
							>
								<UploadImage
									images={imageVerification}
									setImages={setImageVerification}
									image={imageToCrop}
									cropOpen={cropValidationOpen}
									setCropOpen={setCropValidationOpen}
									setImageToCrop={setImageToCrop}
									maxPhotos={1}
									// withCrop
								/>
								<div className={"RabbitVerify"}>
									<VerificateRadditIcon />
								</div>
							</div>
							<p className={"VerificateText"}>
								{t("site.How It Works")}
								<br />{" "}
								{t(
									"site.Upload your photo with a bare face and body not naked"
								)}
							</p>
							<div className={"LinkContainer"}>
								<AdviceIcon />
								<Link
									href={
										"/articles/51/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7"
									}
									styled
								>
									{t("site.Sample profile photos verifies")}
								</Link>
								<MiniArrowIcon />
							</div>
						</Section>
						{/* actions */}
						<div className={"Actions"}>
							{/* submit form */}
							<Button
								type={"button"}
								mode={"submit"}
								prevent={false}
								fullWidth={true}
								onClick={handleSubmit((d) => savePhoto())}
								disabled={disabledButton}
							>
								<p className={"SubmitButtonText"}>
									{t("site.Stunning that you continue")}
								</p>
							</Button>
						</div>
					</div>
					<CropPhotoModal
						open={cropOpen}
						setOpen={setCropOpen}
						image={imageToCrop}
						images={images}
						setImages={setImages}
						onImageDelete={() => onImageDelete(setImages, images)}
					/>
					<CropPhotoModal
						open={cropValidationOpen}
						setOpen={setCropValidationOpen}
						image={imageToCrop}
						images={imageVerification}
						setImages={setImageVerification}
						onImageDelete={() =>
							onImageDelete(
								setImageVerification,
								imageVerification
							)
						}
						validation
					/>
				</div>
			</div>
		</CleanLayout>
	)
}

const mapStateToProps = (state: any) => ({
	// editProfileState: state.EditProfileSlice,
})

const mapDispatchToProps = {
	updateProfile: userProfileActions.updateProfile,
	toggleEditMode: toggleEditMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(Step6Profile)
