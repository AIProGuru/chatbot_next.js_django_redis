function getSelectedIds(arr: any) {
	const ids: number[] = []
	for (const key of Object.keys(arr)) {
		if (arr[key]) ids.push(parseInt(key.split("_")[1]))
	}
	return ids
}

function getSelectedKeysFromObject(arr: any) {
	return Object.entries(arr)
		.filter(([key, value]) => value === true)
		.map(([key, value]) => key)
}

function getSelectedStringIds(arr: any) {
	const ids: string[] = []
	for (const key of Object.keys(arr)) {
		if (arr[key]) ids.push(key.split("_")[1])
	}
	return ids
}

function getSelectedStringTitlesIds(arr: any) {
	const ids: string[] = []
	for (const key of Object.keys(arr)) {
		if (arr[key]) ids.push(key.split("id_")[1])
	}
	return ids
}

function getSelectedStringHostedIds(arr: any) {
	const ids: string[] = []
	for (const key of Object.keys(arr)) {
		if (arr[key]) ids.push(key.split("id_")[1])
	}
	return ids
}

export {
	getSelectedIds,
	getSelectedStringIds,
	getSelectedStringTitlesIds,
	getSelectedStringHostedIds,
	getSelectedKeysFromObject,
}
