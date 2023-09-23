function onBeforeLogout(router: any) {
	router.push(`/auth/logout`).then(() => {
		router.reload()
	})
}

export {onBeforeLogout}
