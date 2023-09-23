import React from "react"
import {useTranslation} from "next-i18next"
import AddPhotoIcon from "@/components/ui/Icons/AddPhotoIcon"
import ImageUploading from "react-images-uploading"
import CircleButton from "@/components/ui/Button/CircleButton/CircleButton"
import ActionIcon from "@/components/ui/Icons/ActionIcon"
import Image from "@/components/ui/Image/Image"

interface UploadImageProps {
	images: Array<any>
	setImages: any
	maxPhotos: number
	withCrop?: boolean
	image?: any
	cropOpen?: any
	setCropOpen?: any
	setImageToCrop?: any
}

function UploadImage(props: UploadImageProps) {
	const {
		images,
		setImages,
		maxPhotos,
		withCrop,
		setCropOpen,
		setImageToCrop,
	} = props
	const {t} = useTranslation("site")

	const onChangePhoto = (imageList: any, addUpdateIndex: any) => {
		setImages(imageList)
	}

	const avatars = images.filter((image: any) => image?.type === "AVATAR")
	const mainImages = images.filter((image: any) => image?.type === "MAIN")
	const privateImages = images.filter((image: any) =>
		["PRIVATE_BLUR", "PRIVATE"].includes(image?.type)
	)
	const validationImages = images.filter((image: any) =>
		["VALIDATION"].includes(image?.type)
	)

	const showImages = [
		...avatars,
		...mainImages,
		...privateImages,
		...validationImages,
	]

	return (
		<ImageUploading
			multiple
			value={images}
			onChange={onChangePhoto}
			maxNumber={maxPhotos}
			dataURLKey="data_url"
			maxFileSize={5242880}
			acceptType={["jpg", "png", "jpeg"]}
			inputProps={{
				multiple: false,
			}}
		>
			{({
				imageList,
				onImageUpload,
				onImageRemoveAll,
				onImageUpdate,
				onImageRemove,
				isDragging,
				dragProps,
				errors,
			}) => (
				<>
					{showImages.map((image: any, index: number) => (
						<div key={index}>
							<div className={"PhotoContainer"}>
								{image.data_url && (
									<Image
										onClick={() =>
											image?.id
												? {}
												: onImageUpdate(index)
										}
										src={image.data_url}
										alt=""
									/>
								)}
								{withCrop && (
									<div className="OptionsPhoto">
										<CircleButton
											icon={<ActionIcon color="dark" />}
											onClick={() => {
												setImageToCrop(image)
												setCropOpen(true)
											}}
											id={"circle_button_action_event"}
											color={"white"}
										/>
									</div>
								)}
							</div>

							{
								<p className="MainPhotoText">
									{t(`site.sups6_img_${image.type}`)}{" "}
									{["MAIN", "AVATAR", "VALIDATION"].includes(image.type) &&
										image.status &&
										" - " + t(`site.image_${image.status}`)}
								</p>
							}
						</div>
					))}
					{images.length !== maxPhotos && (
						<div
							onClick={() => onImageUpload()}
							className={"AddPhoto"}
						>
							<AddPhotoIcon />
						</div>
					)}
					{errors && (
						<div className="ErrorContainer">
							{errors.acceptType && (
								<span>
									{t(
										"site.Your selected file type is not allow"
									)}
								</span>
							)}
							{errors.maxFileSize && (
								<span>
									{t("site.Selected file size exceed 5mb")}
								</span>
							)}
						</div>
					)}
				</>
			)}
		</ImageUploading>
	)
}

export default UploadImage
