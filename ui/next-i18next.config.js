function getLocaleList() {
	// todo: request locale list from server
	return ["en", "ru", "he"]
}

function getDefaultLocale() {
	// todo: request default locale from server
	return "he"
}

module.exports = {
	i18n: {
		defaultLocale: getDefaultLocale(),
		locales: getLocaleList(),
	},
}
