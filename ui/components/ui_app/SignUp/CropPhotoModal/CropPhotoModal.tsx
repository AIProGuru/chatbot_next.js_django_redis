import TransparentButton from "@/components/ui/Button/TransparentButton/TransparentButton"
import React, {useCallback, useEffect, useRef, useState} from "react"
import {useTranslation} from "next-i18next"
import Modal from "@/components/ui/Modal/Modal"
import CloseIcon from "@/components/ui/Icons/CloseIcon"
import ReactCrop from "react-image-crop"
import Button from "@/components/ui/Button/Button/Button"
import InputSwitch from "@/components/ui/Forms/Inputs/Switch/InputSwitch"
import {Controller, useForm} from "react-hook-form"
import Divider from "@/components/ui/Divider/Divider"
import DeleteIcon from "@/components/ui/Icons/DeleteIcon"
import {dataURLtoFile} from "@/components/ui/Functions/DataURLtoFile"

interface CropPhotoModalProps {
	open: boolean
	setOpen: any
	image: any
	onImageDelete: any
	images: Array<any>
	setImages: any
	setUploadOnModal?: Function
	validation?: boolean
}

function CropPhotoModal(props: CropPhotoModalProps) {
	const {
		open,
		setOpen,
		image,
		setImages,
		images,
		onImageDelete,
		setUploadOnModal,
		validation,
	} = props
	const {t} = useTranslation("site")

	const index = images.findIndex((img) => {
		return img?.data_url === image?.data_url
	})

	// react hook form
	const {control, watch, setValue} = useForm()

	const [upImg, setUpImg] = useState<any>(image.data_url)
	const imgRef = useRef(null)
	const [crop, setCrop] = useState<any>({
		unit: "%",
		width: 90,
		aspect: 1 / 1,
	})
	const [completedCrop, setCompletedCrop] = useState<any>(null)

	const onLoad = useCallback((img: any) => {
		imgRef.current = img
	}, [])

	useEffect(() => {
		if (!image?.data_url) {
			setOpen(false)
		}
	}, [image])

	useEffect(() => {
		setUpImg(image.data_url)
	}, [image])

	const getCroppedImg = (image: any, crop: any) => {
		const canvas = document.createElement("canvas")
		const scaleX = image?.naturalWidth / image?.width
		const scaleY = image?.naturalHeight / image?.height
		canvas.width = crop?.width
		canvas.height = crop?.height
		const ctx = canvas.getContext("2d")

		// New lines to be added
		if (ctx) {
			const pixelRatio = window.devicePixelRatio
			canvas.width = crop?.width * pixelRatio
			canvas.height = crop?.height * pixelRatio
			ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
			ctx.imageSmoothingQuality = "high"

			ctx.drawImage(
				image,
				crop?.x * scaleX,
				crop?.y * scaleY,
				crop?.width * scaleX,
				crop?.height * scaleY,
				0,
				0,
				crop?.width,
				crop?.height
			)
		}

		// As Base64 string
		return canvas.toDataURL("image/jpeg")
	}

	const avatarPhotoSwitch = watch("optionPhoto_makeAvatarPhoto")
	const mainPhotoSwitch = watch("optionPhoto_makeMainPhoto")
	const privatePhotoSwitch = watch("optionPhoto_privatePhoto")

	const goBack = () => {
		setOpen(false)
	}

	useEffect(
		() =>
			setCrop({
				unit: "%",
				width: 90,
				aspect: 1 / 1,
			}),
		[image]
	)

	const type = avatarPhotoSwitch
		? "AVATAR"
		: privatePhotoSwitch
		? "PRIVATE"
		: mainPhotoSwitch
		? "MAIN"
		: "VALIDATION"

	const updateCroppedPhoto = async () => {
		if (image?.id) {
			let newArr = [...images] // copying the old datas array
			newArr[index] = {
				id: image?.id,
				data_url: image.data_url,
				file: null,
				type: type,
				status: image.status,
				is_avatar: avatarPhotoSwitch,
				is_main: mainPhotoSwitch,
				is_private: privatePhotoSwitch,
			}
			setImages(newArr)
			goBack()
			return
		}
		if (!image?.id) {
			let newArr = [...images] // copying the old datas array
			if (completedCrop?.height === 0) {
				newArr[index] = {
					id: image?.id || null,
					data_url: image.data_url,
					file: image?.id
						? new File([image.file], "Edited Profile Image", {
								type: image.file.type,
						  })
						: image.file,
					is_avatar: avatarPhotoSwitch,
					is_main: mainPhotoSwitch,
					is_private: privatePhotoSwitch,
					type: type,
				}
				setImages(newArr)
				goBack()
				return
			}
			const base64 = getCroppedImg(imgRef.current, crop)
			const file = dataURLtoFile(
				base64,
				image?.id ? "Edited Profile Image" : "AvatarCropped"
			)
			newArr[index] = {
				id: image?.id || null,
				data_url: base64,
				file: file,
				is_avatar: avatarPhotoSwitch,
				is_main: mainPhotoSwitch,
				is_private: privatePhotoSwitch,
				type: type,
			}
			setImages(newArr)
		}
		goBack()
	}

	useEffect(() => {
		setValue("optionPhoto_makeAvatarPhoto", image.is_avatar || false)
		setValue("optionPhoto_makeMainPhoto", image.is_main || false)
		setValue("optionPhoto_privatePhoto", image.is_private || false)
	}, [image])

	const deleteImage = () => {
		onImageDelete()
		goBack()
	}

	const haveAvatar = images.find((image) => image?.is_avatar)

	const disabled = validation
		? false
		: !mainPhotoSwitch && !avatarPhotoSwitch && !privatePhotoSwitch

	return (
		<Modal open={open}>
			<div className="ModalCrop">
				<div className="GoBack">
					<TransparentButton
						icon={<CloseIcon style="light" />}
						onClick={() => {
							if (
								!["AvatarCropped"].includes(
									image?.file?.name
								) &&
								!image?.id
							) {
								onImageDelete()
							}
							setOpen(false)
						}}
					/>
				</div>
				<div className="ImageEdit">
					{!image?.id ? (
						<ReactCrop
							src={upImg}
							onImageLoaded={onLoad}
							crop={crop}
							onChange={(c: any) => setCrop(c)}
							onComplete={(c: any) => setCompletedCrop(c)}
						/>
					) : (
						<img src={upImg} className="NoCropPhoto" />
					)}
				</div>
				<div className="ActionsContainer">
					{!validation && (
						<>
							<div className="Input">
								<Controller
									render={({field}) => (
										<InputSwitch
											field={field}
											value={
												"optionPhoto_makeAvatarPhoto"
											}
											title={t(
												"site.Definition as Avatar"
											)}
											textAlign={"right"}
											id={"filter_not_read"}
											disabled={
												privatePhotoSwitch ||
												mainPhotoSwitch ||
												haveAvatar
											}
										/>
									)}
									name={"optionPhoto_makeAvatarPhoto"}
									control={control}
									defaultValue={false}
								/>
							</div>
							<Divider />
							<div className="Input">
								<Controller
									render={({field}) => (
										<InputSwitch
											field={field}
											value={"optionPhoto_makeMainPhoto"}
											title={t(
												"site.Definition as main image"
											)}
											textAlign={"right"}
											id={"filter_not_read"}
											disabled={
												privatePhotoSwitch ||
												avatarPhotoSwitch
											}
										/>
									)}
									name={"optionPhoto_makeMainPhoto"}
									control={control}
									defaultValue={false}
								/>
							</div>
							<Divider />
							<div className="Input">
								<Controller
									render={({field}) => (
										<InputSwitch
											field={field}
											value={"optionPhoto_privatePhoto"}
											title={t(
												"site.Transformation into a private image"
											)}
											textAlign={"right"}
											id={"filter_not_read"}
											disabled={
												mainPhotoSwitch ||
												avatarPhotoSwitch
											}
										/>
									)}
									name={"optionPhoto_privatePhoto"}
									control={control}
									defaultValue={false}
								/>
							</div>
							<Divider />
						</>
					)}
					<div onClick={deleteImage} className="DeleteContainer">
						<div className="DeleteImage">
							<DeleteIcon />
						</div>
						<p>{t("site.Remove image")}</p>
					</div>
					<div className={"Actions"}>
						{/* submit form */}
						<Button
							type={"button"}
							prevent={false}
							fullWidth={true}
							mode={"submit"}
							onClick={() => {
								if (disabled) return
								updateCroppedPhoto().then()
								if (setUploadOnModal) {
									setUploadOnModal(true)
								}
							}}
							disabled={disabled}
						>
							<p className={"SubmitButtonText"}>
								{t("site.Confirmation")}
							</p>
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default CropPhotoModal
