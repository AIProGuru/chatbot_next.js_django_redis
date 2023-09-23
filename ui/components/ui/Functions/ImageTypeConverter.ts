function setImageTypeToBoolean(
	type: "MAIN" | "PRIVATE" | "AVATAR" | "VALIDATION",
	image: any
) {
	switch (type) {
		case "MAIN":
			Object.assign(image, {is_main: true})
			Object.assign(image, {is_private: false})
			Object.assign(image, {is_avatar: false})
			return image
		case "PRIVATE":
			Object.assign(image, {is_private: true})
			Object.assign(image, {is_main: false})
			Object.assign(image, {is_avatar: false})
			return image
		case "AVATAR":
			Object.assign(image, {is_avatar: true})
			Object.assign(image, {is_private: false})
			Object.assign(image, {is_main: false})
			return image
		case "VALIDATION":
			Object.assign(image, {is_validation: true})
			return image
		default:
			Object.assign(image, {is_main: true})
			Object.assign(image, {is_private: false})
			Object.assign(image, {is_avatar: false})
			return image
	}
}

function setImageBooleanToType(arrayImages: any) {
	arrayImages.map((image: any) => {
		if (!image.id) {
			Object.assign(image, {id: null})
		}
		if (image.type) return
		if (image.is_avatar) {
			Object.assign(image, {type: "AVATAR"})
		} else if (image.is_main) {
			Object.assign(image, {type: "MAIN"})
		} else if (image.is_private) {
			Object.assign(image, {type: "PRIVATE"})
		} else {
			Object.assign(image, {type: "MAIN"})
		}
	})
}

export {setImageTypeToBoolean, setImageBooleanToType}
