type RegionsResponse = {
	count: number
	next: string
	next_url: string
	page_links: []
	previous: any
	previous_url: any
	results: Region[]
}

type Region = {
	id: number
	title: string
	location?: Location
}

type Location = {
	id: number
	title: string
}

export type {RegionsResponse, Region, Location}