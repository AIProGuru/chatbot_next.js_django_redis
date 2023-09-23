type TryClientConfig = {
	url: string
	accessToken: string
	refreshToken: string
	path?: string
	transports: string[]
	// | ["polling"]
	// | ["websocket"]
	// | ["polling", "websocket"]
	upgrade?: boolean
	autoConnect?: boolean
}

export type {TryClientConfig}
