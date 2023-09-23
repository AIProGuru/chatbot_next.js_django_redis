import {IConversation} from "@/TryChat/@types/Conversations/Conversation"

const GetGroupName = (conversation: IConversation) => {
	if (!conversation) return ""
	return conversation.room.name
}

export {GetGroupName}
