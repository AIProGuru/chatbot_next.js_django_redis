type ImageS3 = {
	id: number
	type: 'MAIN' | 'PRIVATE' | 'AVATAR' | 'VALIDATION',
	fileName: string
	url: string
}

export type {ImageS3}
