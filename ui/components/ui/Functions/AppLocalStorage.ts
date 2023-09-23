// const
export const lsFiltersStorage = "filtersStorage"
export const lsFiltersAvailableStorage = "filtersAvailableStorage"
export const lsNotificationsManagerStorage = "nmStorage"

// local storage
let appStorage: Storage | null = null
if (typeof window !== "undefined") {
	appStorage = localStorage
}

export function lsSetItem(param: string, value: any) {
	appStorage && appStorage.setItem(param, value)
}

export function lsGetItem(param: string): string {
	if (appStorage) {
		return appStorage.getItem(param) || "{}"
	} else {
		return "{}"
	}
}

export function lsGetItemString(param: string): string | null {
	if (appStorage) {
		return appStorage.getItem(param) || null
	} else {
		return null
	}
}

export function lsRemItem(param: string) {
	appStorage && appStorage.removeItem(param)
}

export function lsClearStorage() {
	appStorage && appStorage.clear()
}
