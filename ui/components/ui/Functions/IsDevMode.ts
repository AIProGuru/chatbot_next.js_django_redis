const environment = process.env.NODE_ENV || "development"

const isDevMode = () => {
	return environment === "development"
}

export {isDevMode}
