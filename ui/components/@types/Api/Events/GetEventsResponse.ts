import {TEvent} from "@/components/@types/Api/Events/Event"

type GetEventsResponse = {
	count: number
	next: string
	next_url: string
	page_links: any[]
	previous: any
	results: TEvent[]
}

export type {GetEventsResponse}
