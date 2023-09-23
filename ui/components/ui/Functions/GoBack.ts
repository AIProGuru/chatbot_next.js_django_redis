function goBack(
	router: any,
	defaultGoBackPath: string,
	availablePaths?: (string | undefined | null)[]
) {
	const storage = globalThis?.sessionStorage
	const prevPath = storage.getItem("prevPath")
	const thisPage = router.asPath

	// console.log(prevPath && prevPath.includes(thisPage))
	// console.log(
	// 	"availablePaths.includes(prevPath)",
	// 	availablePaths && availablePaths.includes(prevPath),
	// 	availablePaths &&
	// 		Boolean(
	// 			availablePaths.filter((e: any) => e.includes(prevPath)).length >
	// 				0
	// 		)
	// )
	// console.log(router.locale, router.locales)

	if (
		!storage ||
		!prevPath ||
		(prevPath && availablePaths && !availablePaths.includes(prevPath)) ||
		(prevPath && prevPath.includes(thisPage))
	) {
		router.push(defaultGoBackPath)
		return
	}

	router.push(prevPath)
}

function goBackEditMode(router: any, toggleEditMode: any) {
	const toggle = new Promise((resolve) => {
		toggleEditMode({state: false})
		resolve(true)
	})

	toggle.then(() => {
		router.back()
	})
}

export {goBack, goBackEditMode}
