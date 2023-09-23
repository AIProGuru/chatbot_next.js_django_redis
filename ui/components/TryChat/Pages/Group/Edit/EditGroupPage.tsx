import styles from "./EditGroupPage.module.scss"
import EditGroupHeader from "@/components/TryChat/Components/Header/EditGroupHeader/EditGroupHeader"
import EditGroupSearch from "@/components/TryChat/Components/EditGroup/Search/EditGroupSearch"
import EditGroupMembers from "@/components/TryChat/Components/EditGroup/Members/EditGroupMembers"
import {UserProfile} from "@/services/users.service"
import {ProfileAvatar} from "@/services/images.service"
import {IConversation} from "@/TryChat/@types/Conversations/Conversation"

interface EditGroupPageProps {
	setEditGroupModal: Function
	profiles: UserProfile[]
	avatars: ProfileAvatar[]
	conversation: IConversation | undefined
	emitDeleteConversation: (isGroup: boolean) => void
	emitDeleteMemberFromGroup: (profileID: string) => void
	isGroupAdmin: () => boolean | undefined
	myID: string | undefined
}

function EditGroupPage(props: EditGroupPageProps) {
	const {
		setEditGroupModal,
		profiles,
		avatars,
		conversation,
		emitDeleteConversation,
		emitDeleteMemberFromGroup,
		isGroupAdmin,
		myID,
	} = props

	const closeModal = () => {
		setEditGroupModal(false)
	}

	return (
		<div className={styles.EditGroupPage}>
			<EditGroupHeader
				closeModal={closeModal}
				emitDeleteConversation={emitDeleteConversation}
				isGroupAdmin={isGroupAdmin}
			/>
			<div className={styles.Container}>
				<EditGroupSearch room={conversation && conversation.room} />
				<EditGroupMembers
					profiles={profiles}
					avatars={avatars}
					isGroupAdmin={isGroupAdmin}
					emitDeleteMemberFromGroup={emitDeleteMemberFromGroup}
					myID={myID}
				/>
			</div>
		</div>
	)
}

export default EditGroupPage
