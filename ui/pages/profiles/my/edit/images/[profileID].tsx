import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import GoBackIcon from "@/components/ui/Icons/GoBackIcon"
import Logotype from "@/components/ui/Header/Logotype"
import Section from "@/components/ui/SignUp/Section/Section"
import {useForm} from "react-hook-form"
import React, {useState, useEffect, useMemo} from "react"
import {useRouter} from "next/router"
import Button from "@/components/ui/Button/Button/Button"
import {TFunction, useTranslation} from "next-i18next"
import Link from "@/components/ui/Button/Link/Link"
import VerificateRadditIcon from "@/components/ui/Icons/VerificateRadditIcon"
import {cc} from "@/components/ui/Functions/Classnames"
import {uploadImages} from "@/services/common.service"
import BlockPhotoIcon from "@/components/ui/Icons/BlockPhotoIcon"
import AdviceIcon from "@/components/ui/Icons/AdviceIcon"
import MiniArrowIcon from "@/components/ui/Icons/MiniArrowIcon"
import {connect} from "react-redux"
import {userProfileActions} from "@/redux/actions/userProfileActions"
import {ImageS3} from "@/components/@types/Api/Common/ImageS3"
import {
	useGetProfileDataQuery,
	useUpdateImageProfileMutation,
} from "@/services/users.service"
import {
	useAddProfileImageMutation,
	useChangeTypeImagesMutation,
	useDeleteImageMutation,
	useGetProfileImagesMutation,
} from "@/services/images.service"
import {
	setImageBooleanToType,
	setImageTypeToBoolean,
} from "@/components/ui/Functions/ImageTypeConverter"
import {toggleEditMode} from "@/redux/slices/EditProfileSlice"
import CleanLayout from "@/components/ui_app/AppLayouts/CleanLayout"
import {yupResolver} from "@hookform/resolvers/yup"
import {Step6Schema} from "@/app/validation/ProfileRegistration/Step6.schema"
import CropPhotoModal from "@/components/ui_app/SignUp/CropPhotoModal/CropPhotoModal"
import UploadImage from "@/components/ui_app/SignUp/UploadImage/UploadImage"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"

type ErrorTranslations = {
	[x: string]: any
}

const getErrorTranslations = (t: TFunction): ErrorTranslations => {
	return {
		yup_pr_step6_about_min_length: t("site.yup_pr_step6_about_min_length"),
		yup_pr_step6_about_max_length: t("site.yup_pr_step6_about_max_length"),
	}
}

function EditImages(props: any) {
	// props
	const {t} = useTranslation("site")
	const errorTranslations = useMemo(() => {
		return getErrorTranslations(t)
	}, [t])

	// state
	const [images, setImages] = useState<any>([])
	const [imagesProfile, setImagesProfile] = useState<any>([])
	const [imageVerification, setImageVerification] = useState<any>([])
	const [cropOpen, setCropOpen] = useState<boolean>(false)
	const [imageToCrop, setImageToCrop] = useState<any>({})
	const [disabledButton, setDisabledButton] = useState<boolean>(false)
	const [uploadOnModal, setUploadOnModal] = useState(false)
	const [cropValidationOpen, setCropValidationOpen] = useState<boolean>(false)

	const maxPhotos = 8

	const forbiddenPhoto = [
		t("site.Please do not post photos from the web"),
		t("site.Graphic photos of exposed genitals will be erased"),
		t("site.Please do not post any photos with under-aged persons"),
		t(
			"site.Please do not post photos of other people or which do not include"
		),
		t("site.Please do not post photos containing logos of other websites"),
	]

	// basic props
	const {updateProfile, editProfileState, toggleEditMode, profileProgress} =
		props
	const router = useRouter()
	const {profileID: id} = router.query

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

	// react hook form
	const {handleSubmit, control, watch, setValue} = useForm({
		resolver: yupResolver(Step6Schema),
		mode: "onChange",
	})

	// on go back
	function onGoBackClick() {
		router.push(`/profiles/my/edit`).then(() => {
			refetchProfileData()
		})
	}

	const [registerGetProfileImages] = useGetProfileImagesMutation()

	const about = watch("about")

	useEffect(() => {
		if (uploadOnModal) {
			savePhoto().then()
			setUploadOnModal(false)
		}
	}, [uploadOnModal])

	const setProfileImages = async (photos: any) => {
		if (photos) {
			// const dataImages = await Promise.all(
			// 	photos.map(async (image: any) => {
			// 		console.log("image", image)
			// 		return new Promise((res, rej) => {
			// 			try {
			// 				getBase64Image(`${image.s3_url}`, (base64: any) => {
			// 					const file = dataURLtoFile(
			// 						base64,
			// 						"ProfileImage"
			// 					)
			// const data = {
			// 	id: image.id,
			// 	data_url: base64,
			// 	file: file,
			// 	type: image.type,
			// }
			// 					setImageTypeToBoolean(image.type, data)
			// 					res(data)
			// 				})
			// 			} catch (e) {
			// 				rej(e)
			// 			}
			// 		})
			// 	})
			// )
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
						status: image.status,
					}
					setImageTypeToBoolean(image.type, data)
					return data
				})
			data_images_validation = photos
				.filter((image: any) => image.type === "VALIDATION")
				.map((image: any) => {
					const data = {
						id: image.id,
						data_url: image.s3_url,
						file: null,
						type: image.type,
						status: image.status,
					}
					setImageTypeToBoolean(image.type, data)
					return data
				})
			setImages(data_images)
			setImageVerification(data_images_validation)
		}
	}

	const getProfileImages = () => {
		if (id && typeof id === "string") {
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
	}

	useEffect(() => getProfileImages(), [id])

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
		await arrayImages.forEach((image: any) => {
			delete image.data_url
			delete image.is_avatar
			delete image.is_main
			delete image.is_private
		})
	}

	const savePhoto = async () => {
		if (images.length > maxPhotos) return
		setDisabledButton(true)
		const arrayImages = [...images]
		const arrayVerifyImages = [...imageVerification]

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
									resolve(true)
								})
								.catch((e) => {
									reject()
									console.log(e)
								})
						}
					})
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
						const photos = updatePhotoRes(res)
						registerAddImage({
							profileId: id,
							body: photos,
						})
							.unwrap()
							.then((r) => {

								getProfileImages()
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
					// if (!arrayImages.filter((item) => !item?.id).length) {
					// 	resolve(true)
					// 	return
					// }
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
					if (r.value === true) {
						getProfileImages()
					}
				})

			})
			.finally(() => {
				setDisabledButton(false)
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
				images.slice(-1)[0]?.file &&
				images.slice(-1)[0]?.file?.name !== "AvatarCropped" &&
				images.slice(-1)[0]?.data_url
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
				imageVerification.slice(-1)[0]?.file &&
				imageVerification.slice(-1)[0]?.file?.name !==
					"AvatarCropped" &&
				imageVerification.slice(-1)[0]?.data_url
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
					<div className="Sections">
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
										"/articles/51/%D7%97%D7%99%D7%9C%D7%95%D7%A4%D7%99-%D7%96%D7%95%D7%92%D7%95%D7%AA-%D7%A4%D7%A8%D7%95%D7%A4%D7%99%D7%9C-%D7%9E%D7%95%D7%95%D7%93%D7%90"
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
								onClick={() => {
									router.push("/profiles/my/edit").then()
								}}
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
						setUploadOnModal={setUploadOnModal}
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
						setUploadOnModal={setUploadOnModal}
						validation
					/>
				</div>
			</div>
		</CleanLayout>
	)
}

EditImages.requireAuth = true

export const getServerSideProps = async (ctx: any) => {
	const locale = ctx.locale || "en"

	return {
		props: {
			...(await serverSideTranslations(locale, ["site"])),
		},
	}
}

const mapStateToProps = (state: any) => ({
	editProfileState: state.EditProfileSlice,
})

const mapDispatchToProps = {
	updateProfile: userProfileActions.updateProfile,
	toggleEditMode: toggleEditMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditImages)
