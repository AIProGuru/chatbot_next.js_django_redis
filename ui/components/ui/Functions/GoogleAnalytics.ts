export const pageview = (url: any, key: string) => {
	window &&
		window.gtag("config", key, {
			path_url: url,
		})
}
