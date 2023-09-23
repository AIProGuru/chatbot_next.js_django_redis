function uniqueArray(array: any[]) {
	const a = array.concat()
	for (let i = 0; i < a.length; ++i) {
		for (let j = i + 1; j < a.length; ++j) {
			if (a[i] === a[j]) a.splice(j--, 1)
		}
	}

	return a
}

const uniqueArrayByParam = (array: any[], param: string) => {
	const a: any[] = array.concat()
	for (let i = 0; i < a.length; ++i) {
		for (let j = i + 1; j < a.length; ++j) {
			if (a[i][param] === a[j][param]) a.splice(j--, 1)
		}
	}

	return a
}

export {uniqueArray, uniqueArrayByParam}
