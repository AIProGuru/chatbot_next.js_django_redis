// create conversation event
type CreateConversationResponse = {
	profiles: string[]
	room: Room
}

// get conversations list event
type GetConversationsResponse = {
	conversations: IConversation[]
	count: number
}

type IConversation = {
	room: Room
	profiles: Profile[]
	message_count?: number
	message?: LastMessage
	unread_messages?: number
	room_unread_message_timestamp?: number
	last_message_timestamp: number
}

type GetMessagesResponse = {
	messages: Message[]
}

type DeleteMessageResponse = {
	timestamp: number
}

type EditMessageResponse = {
	new_message: string
	room_id: string
	timestamp: number
}

type ReadMessagesResponse = {
	room_id: string
}

type TypingResponse = {
	profile_id: string
	room_id: string
}

type SearchConversationResponse = {
	room: Room
}

type DeleteMemberFromGroupResponse = {
	admin_profile_id: string
	delete_profile_id: string
	room_id: string
}

type ExitGroupRoomResponse = {
	room_id: string
	is_admin: boolean
	profile_id: string
}

type GetProfileLimitsResponse = {
	credit: Credit
	limit: Limit
}

export type Limit = {
	date: number
	limit: number
	subscription: string
	subscription_limit: number
}

export type Credit = {
	credit: number
	date: number
	total_credits: number
}

// room
type Room = {
	id: string
	is_open: boolean
	is_bot_room: boolean
	name: string
	room_type: RoomType
	timestamp: number
}

enum RoomType {
	personal = "Personal",
	group = "Group",
}

// messages
type Message = {
	id?: number
	profiles_id?: string[]

	message: string
	message_type: MessageType
	profile_id: string
	room_id: string
	timestamp: number
	updated?: boolean | null
	additional_params: MessageAdditionalParams
}

type MessageAdditionalParams = {
	event_type?: string
	room_created?: boolean
}

type LastMessage = {
	id: number
	message: string
	message_type: MessageType
	profile_id: string
	room_id: string
	timestamp: number
	updated: boolean | null
}

export type Profile = {
	id: string
	is_admin: boolean
	is_open: boolean
	is_read: boolean
}

enum MessageType {
	text = "Text",
	image = "Image",
	system = "System",
}

export {RoomType, MessageType}
export type {
	CreateConversationResponse,
	GetConversationsResponse,
	GetMessagesResponse,
	DeleteMessageResponse,
	EditMessageResponse,
	TypingResponse,
	SearchConversationResponse,
	ReadMessagesResponse,
	DeleteMemberFromGroupResponse,
	GetProfileLimitsResponse,
	ExitGroupRoomResponse,
	IConversation,
	Message,
	LastMessage,
	Room,
	MessageAdditionalParams,
}
