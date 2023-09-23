function getDirection(router: any) {
	let direction = "ltr"

	try {
		const {locale} = router

		switch (locale) {
			case "he":
				direction = "rtl"
				break

			default:
				direction = "ltr"
		}
	} catch (e) {
		console.log(e)
	}

	return direction
}

export {getDirection}
