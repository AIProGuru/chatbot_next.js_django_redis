function getBase64Image (url: any, callback: any) {
	const img = new Image()
	img.setAttribute("crossOrigin", "anonymous")
	img.onload = () => {
		const canvas = document.createElement("canvas")
		canvas.width = img.width
		canvas.height = img.height
		const ctx = canvas.getContext("2d")
		ctx!.drawImage(img, 0, 0)
		const dataURL = canvas.toDataURL("image/png")
		callback(dataURL)
	}
	img.src = url
}

export {getBase64Image}