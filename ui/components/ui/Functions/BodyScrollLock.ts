function toggleBodyScroll(state: boolean) {
	if (state) {
		// @ts-ignore
		document.querySelector("body").classList.add("MainBlocked")
	} else {
		// @ts-ignore
		document.querySelector("body").classList.remove("MainBlocked")
	}
}

export {toggleBodyScroll}
