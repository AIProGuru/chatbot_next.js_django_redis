// this is services, that is not connected to Redux (and we don't need to connect them)

import axiosInstance, {axiosPublicInstance} from "app/axiosInstance"
import axios from "axios"
import {ImageProfileField} from "@/components/@types/Api/Common/ImageField"
import {ImageS3} from "@/components/@types/Api/Common/ImageS3"

function getPreSignedData(ext: string) {
	return axiosInstance.post("api/images/presign_url/upload", {
		extension: ext,
	})
}

function uploadImageS3(url: string, formData: any) {
	return axios.post(url, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
			Accept: "*/*",
		},
	})
}

async function uploadImages(
	ImageProfileField: ImageProfileField[]
): Promise<ImageS3[]> {
	const allowedFileTypes = ["jpg", "jpeg", "png"] // allowed file types
	const notAllowedFields = ["Content-Type"] // restricted fields
	const resultImages: ImageS3[] = [] // result array

	for await (let ImageProfile of ImageProfileField) {
		ImageProfile = ImageProfile as ImageProfileField
		const file = ImageProfile.file as File
		if (file.type) {
			const type = file.type.split("/")[1]

			if (allowedFileTypes.includes(type)) {
				const psd: any = await getPreSignedData(type)

				const url = psd.data.presigned_url // get url
				const fd = new FormData() // make form data

				for (const key in psd.data.presigned_data) {
					if (!notAllowedFields.includes(key)) {
						fd.append(key, psd.data.presigned_data[key])
					}
				}

				fd.append("file", file) // append file to form

				try {
					const res = await uploadImageS3(`${url}`, fd)

					// attach file info only if status OK
					if (res.status === 204) {
						resultImages.push({
							id: ImageProfile.id,
							type: ImageProfile.type,
							fileName: psd.data.bucket_path,
							url: url,
						})
					}
				} catch (e) {
					console.log(
						"Something went wrong while upload image",
						psd.data.bucket_path
					)
					console.log(e)
				}
			}
		}
	}

	return resultImages
}

export enum SignUpValidationTypes {
	username,
	email,
	phone,
}

const ValidateSignUpData = (type: SignUpValidationTypes, value: string) => {
	let apiUrl = ""
	const data = {}

	switch (type) {
		case SignUpValidationTypes.username:
			apiUrl = `public/validate-user-username/`
			Object.assign(data, {username: value})
			break

		case SignUpValidationTypes.email:
			apiUrl = `public/validate-user-email/`
			Object.assign(data, {email: value})
			break

		case SignUpValidationTypes.phone:
			apiUrl = `public/validate-user-phone/`
			Object.assign(data, {phone: value})
			break
	}

	return axiosPublicInstance.post(apiUrl, data)
}

export {uploadImages, ValidateSignUpData}
