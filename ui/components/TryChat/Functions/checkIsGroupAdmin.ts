import {IConversation} from "@/TryChat/@types/Conversations/Conversation"

const checkIsGroupAdmin = (
	conversation: IConversation,
	myID: string
): boolean | undefined => {
	if (!conversation) return
	const search = conversation.profiles.find((s) => s.id === myID)
	if (search) {
		return search.is_admin
	} else {
		return false
	}
}

export {checkIsGroupAdmin}
