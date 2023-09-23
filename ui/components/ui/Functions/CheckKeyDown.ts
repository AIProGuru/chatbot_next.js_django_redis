const checkKeyDown = (e: any, keyCode: string) => {
	if (e.code === keyCode) {
		e.preventDefault()
		return true
	} else {
		return false
	}
}

export {checkKeyDown}
