import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {
	Credit,
	GetProfileLimitsResponse,
	IConversation,
	LastMessage,
	Limit,
	Message,
} from "@/TryChat/@types/Conversations/Conversation"

type InitialState = {
	conversations: IConversation[]
	conversationsCount: number
	conversation: IConversation | undefined
	messages: Message[]
	editMessage: Message | undefined
	lastReadMessage: number | undefined | null
	lastMessage: number | undefined | null
	canSendMessages: string[] | undefined | null
	limits: Limit
	credits: Credit
	typings: Typing[]
}

export type Typing = {
	conversationID: string
	timestamp: number
}

type RAddConversation = {
	conversations: IConversation[]
}

type RSetConversationsCount = {
	count: number
}

type RDeleteConversation = {
	conversationID: string
}

type RSetConversation = {
	conversation: IConversation | undefined
}

type RUpdateConversationCounter = {
	conversationID: string
}

type REditMessage = {
	message: Message | undefined
}

type RSetLastReadMessage = {
	messageID: number | undefined | null
	roomID: string
}

type RSetLastMessage = {
	messageID: number | undefined | null
}

type RSetMessages = {
	messages: Message[]
}

type RNewMessage = {
	message: Message
}

type RUpdateMessage = {
	timestamp: number
	content: string
}

type RUpdateMessageChatList = {
	conversationID: string
	timestamp: number
	content: string
}

type RDeleteMessage = {
	timestamp: number
}

type RSetCanSendMessages = {
	canSendMessages: string[] | undefined | null
}

type RDeleteMemberFromGroup = {
	profileID: string
}

type RSetProfileLimits = {
	limits: GetProfileLimitsResponse
}

type RSetTyping = {
	conversationID: string
	timestamp: number
}

function uniqueConversation(array: IConversation[]) {
	const a = array.concat()
	for (let i = 0; i < a.length; ++i) {
		for (let j = i + 1; j < a.length; ++j) {
			if (a[i].room.id === a[j].room.id) a.splice(j--, 1)
		}
	}

	return a
}

function uniqueMessage(array: Message[]) {
	const a = array.concat()
	for (let i = 0; i < a.length; ++i) {
		for (let j = i + 1; j < a.length; ++j) {
			if (a[i].timestamp === a[j].timestamp) a.splice(j--, 1)
		}
	}

	return a
}

const initialState: InitialState = {
	conversations: [],
	conversationsCount: 0,
	conversation: undefined,
	messages: [],
	editMessage: undefined,
	lastReadMessage: undefined,
	lastMessage: undefined,
	canSendMessages: undefined,
	limits: {
		date: 0,
		limit: 0,
		subscription: "",
		subscription_limit: 0,
	},
	credits: {
		credit: 0,
		date: 0,
		total_credits: 0,
	},
	typings: [],
}

const TryChatSlice = createSlice({
	name: "TryChatSlice",
	initialState,
	reducers: {
		addConversations: (state, action: PayloadAction<RAddConversation>) => {

			const currentConversations = state.conversations.slice()
			const newConversations = action.payload.conversations

			if (newConversations && newConversations.length > 0) {
				newConversations.forEach((newCnv) => {
					const search = currentConversations.find(
						(s) => s.room.id === newCnv.room.id
					)

					if (search) {
						const index = currentConversations.indexOf(search)
						currentConversations.splice(index, 1)
					}
				})
			}

			const updatedConversations = uniqueConversation([
				...currentConversations,
				...newConversations,
			])

			state.conversations = updatedConversations
		},
		deleteConversation: (
			state,
			action: PayloadAction<RDeleteConversation>
		) => {
			const currentConversations = state.conversations.slice()
			const search = currentConversations.find(
				(s) => s.room.id === action.payload.conversationID
			)
			if (search) {
				const index = currentConversations.indexOf(search)
				currentConversations.splice(index, 1)
			}
			state.conversations = currentConversations
		},
		setConversationsCount: (
			state,
			action: PayloadAction<RSetConversationsCount>
		) => {
			state.conversationsCount = action.payload.count
		},
		incrementConversationsCount: (state) => {
			state.conversationsCount = state.conversationsCount + 1
		},
		setConversation: (state, action: PayloadAction<RSetConversation>) => {
			state.conversation = action.payload.conversation
		},
		updateConversationCounter: (
			state,
			action: PayloadAction<RUpdateConversationCounter>
		) => {
			const currentConversations = state.conversations.slice()
			const search = currentConversations.find(
				(s) => s.room.id === action.payload.conversationID
			)
			if (search) {
				const index = currentConversations.indexOf(search)
				currentConversations.splice(index, 1)

				const updatedConversation: IConversation = {
					...search,
					unread_messages: 0,
				}

				const updatedConversations = uniqueConversation([
					...currentConversations,
					updatedConversation,
				])

				state.conversations = updatedConversations
			}
		},
		editMessage: (state, action: PayloadAction<REditMessage>) => {
			state.editMessage = action.payload.message
		},
		setLastReadMessage: (
			state,
			action: PayloadAction<RSetLastReadMessage>
		) => {
			if (
				state.conversation &&
				state.conversation.room.id === action.payload.roomID
			) {
				state.lastReadMessage = action.payload.messageID
			}
		},
		setLastMessage: (state, action: PayloadAction<RSetLastMessage>) => {
			state.lastMessage = action.payload.messageID
		},
		setMessages: (state, action: PayloadAction<RSetMessages>) => {
			const messages = state.messages.slice()
			const updatedMessages = uniqueMessage(
				messages.concat(
					action.payload.messages.sort((m1, m2) => {
						const d1 = m1.timestamp || 0
						const d2 = m2.timestamp || 0

						if (d1 < d2) return 1
						if (d1 > d2) return -1
						return 0
					})
				)
			)
			state.messages = updatedMessages
		},
		newMessage: (state, action: PayloadAction<RNewMessage>) => {
			const conversation = state.conversation

			if (
				!state.conversation ||
				state.conversation === null ||
				state.conversation === undefined
			)
				return

			if (state.conversation.room.id === action.payload.message.room_id) {
				console.log(
					"REDUX 2",
					state.conversation.room.id !==
						action.payload.message.room_id,
					action.payload
				)

				const messages = state.messages.slice()
				const updatedMessages = uniqueMessage(
					[action.payload.message].concat(messages)
				)
				state.messages = updatedMessages
			}
		},
		updateMessage: (state, action: PayloadAction<RUpdateMessage>) => {
			const messages = state.messages.slice()
			const search = messages.find(
				(s) => s.timestamp === action.payload.timestamp
			)

			if (search) {
				const index = messages.indexOf(search)
				const updatedMessage: Message = {
					...search,
					message: action.payload.content,
				}
				messages.splice(index, 1, updatedMessage)

				state.messages = messages
			}
		},
		updateMessageChatList: (
			state,
			action: PayloadAction<RUpdateMessageChatList>
		) => {
			const conversations = state.conversations.slice()
			const search = conversations.find(
				(s) => s.room.id === action.payload.conversationID
			)

			if (
				search &&
				search.message &&
				search.message.timestamp === action.payload.timestamp
			) {
				const index = conversations.indexOf(search)
				conversations.splice(index, 1)

				const updatedLastMessage: LastMessage = Object.assign(
					{},
					search.message,
					{
						message: action.payload.content,
					}
				)

				const updatedConversation: IConversation = {
					...search,
					message: updatedLastMessage,
				}

				const updatedConversations = uniqueConversation([
					...conversations,
					updatedConversation,
				])

				state.conversations = updatedConversations
			}
		},
		deleteMessage: (state, action: PayloadAction<RDeleteMessage>) => {
			const messages = state.messages.slice()
			const updatedMessages = messages.filter((message) => {
				return message.timestamp !== action.payload.timestamp
			})
			state.messages = updatedMessages
		},
		clearMessages: (state, action: PayloadAction<any>) => {
			state.messages = []
		},
		clearConversations: (state, action: PayloadAction<any>) => {
			state.conversations = []
		},
		setCanSendMessages: (
			state,
			action: PayloadAction<RSetCanSendMessages>
		) => {
			state.canSendMessages = action.payload.canSendMessages
		},
		deleteMemberFromGroup: (
			state,
			action: PayloadAction<RDeleteMemberFromGroup>
		) => {
			const conversation = state.conversation
			if (conversation) {
				const search = conversation.profiles.find(
					(s) => s.id === action.payload.profileID
				)

				if (search) {
					const index = conversation.profiles.indexOf(search)
					conversation.profiles.splice(index, 1)

					state.conversation = conversation
				}
			}
		},
		setLimits: (state, action: PayloadAction<RSetProfileLimits>) => {
			state.limits = action.payload.limits.limit
			state.credits = action.payload.limits.credit
		},
		setTyping: (state, action: PayloadAction<RSetTyping>) => {
			const typings = state.typings

			const search = typings.find(
				(s) => s.conversationID === action.payload.conversationID
			)
			if (search) {
				const index = typings.indexOf(search)
				typings.splice(index, 1)
			}

			typings.push({
				conversationID: action.payload.conversationID,
				timestamp: action.payload.timestamp,
			})

			state.typings = typings
		},
		clearTypings: (state) => {
			let typings = state.typings

			typings.forEach((t) => {
				// const date = t.timestamp + 5000
				// const newDate = new Date().getTime()

				// console.log('setTyping', date, newDate, date > )

				if (t.timestamp + 2000 < new Date().getTime()) {
					typings = typings.filter(
						(s) => s.conversationID !== t.conversationID
					)
				}
			})

			state.typings = typings
		},
	},
})

export const {
	addConversations,
	setConversationsCount,
	incrementConversationsCount,
	deleteConversation,
	setConversation,
	updateConversationCounter,
	editMessage,
	setLastReadMessage,
	setLastMessage,
	setMessages,
	newMessage,
	updateMessage,
	deleteMessage,
	clearMessages,
	updateMessageChatList,
	clearConversations,
	setCanSendMessages,
	deleteMemberFromGroup,
	setLimits,
	setTyping,
	clearTypings,
} = TryChatSlice.actions
export default TryChatSlice.reducer
